const fs = require('fs');
const http = require('http');
const https = require('https');
const opn = require('opn');
const makeTable = require('./makeTable.js');

const htmlTemplate = require('./htmlTemplate.js');

class UserDataTableHtml {
  _cleanUserData(user) {
    const objectTemplate = {
      id : "",
      firstName : "",
      lastName : "",
      age : ""
    }

    return Object.assign({}, objectTemplate, user);
  }

  _userHtmlTableRows(users) {
    let htmlString = '';

    users.forEach((user)=>{
      const cleanUser = this._cleanUserData(user);
      htmlString += `<tr><td>${cleanUser.id}</td><td>${cleanUser.firstName}</td><td>${cleanUser.lastName}</td><td>${cleanUser.age}</td></tr>`;
    })

    return htmlString;
  }

  writeHtmlFile(users) {
    return new Promise((resolve,reject)=>{
      const tableRowHtml = this._userHtmlTableRows(users);
      
      fs.writeFile('index.html', htmlTemplate(tableRowHtml), (error) => {
          if (error) {
            reject();
          }
          resolve();
      });
    });
  }
}

class UserDataJsonApi {
  constructor(endpoints) {
    this.endpoints = endpoints;
    this.users = [];
    this.usersHash = {};
  }

  _httpGet(endpoint) {
    return new Promise((resolve, reject)=>{
      https.get(endpoint, (response)=>{
        let body = '';
        response.on('data', (chunk)=>{
            body += chunk;
        });
    
        response.on('end', ()=>{
          resolve(JSON.parse(body));
        });
      }).on('error', (e)=>{
        console.error("Got an error: ", e);
        reject(e);
      });
    });
  }

  getRawDataFromEndpoints() {
    return new Promise((resolve,reject) => {
      let allData = [];
      let currentIndex = 0;
      
      const recursiveHelper = () => {
        this._httpGet(this.endpoints[currentIndex])
          .then((data)=>{
            this.users.push(data);

            if (currentIndex >= this.endpoints.length-1) {    
              resolve(this.users);
            } else {
              currentIndex++;
              recursiveHelper()
            }
          })
          .catch((e)=>{
          console.error(e);
        });;
      }

      recursiveHelper();
    });
  }

  concatenateUserArrays() {
    let combinedArrays = [];
    
    this.users.forEach((arr) => {
      combinedArrays = combinedArrays.concat(arr);
    });
    
    this.users = combinedArrays;

    return this;
  }

  reduceUserObjectsIntoHash() {
    this.users.forEach((user) => {
      this.usersHash[user.id] = Object.assign({}, this.usersHash[user.id], user);
    });

    console.log(this.usersHash);

    return this;
  }

  addReducedUserObjectsToUserList() {
    this.users = Object.keys(this.usersHash).map((key) => {
        return this.usersHash[key]
    });

    console.log(this.users);
    
    return this;
  }

  getJsonData() {
    
    return new Promise((resolve,reject) => {
      this.getRawDataFromEndpoints()
        .then((userData)=>{
          this.concatenateUserArrays()
            .reduceUserObjectsIntoHash()
            .addReducedUserObjectsToUserList();
          resolve(this.users);
      })
      .catch((error)=>{
        reject(error);
      });
    });
    
  }
}

class Build {
  constructor(options) {
    const defaultOptions = {
      port: 8080,
      fileName: 'index.html',
      endpoints: [
        'https://api.myjson.com/bins/xqrsi',
        'https://api.myjson.com/bins/szaya'
      ]
    }
    
    this.options = Object.assign({},defaultOptions,options);
  }

  _readTableHtmlFile(resolve, reject){
    return (request, response) => {
      fs.readFile(this.options.fileName, (error, data)=>{
        if (error) {
          reject(error);
        }
        response.writeHead(200, {'Content-Type':'text/html','Content-Length':data.length});
        response.write(data);
        response.end();
        resolve(data);
      });
    }
  }
 
  createServer () {
    return new Promise((resolve, reject)=>{
      http
        .createServer(this._readTableHtmlFile(resolve, reject))
        .listen(this.options.port);
    })
  }

  error(e) {
    console.error(e);
  }

  start () {
    const userData = new UserDataJsonApi(this.options.endpoints);
    const htmlTable = new UserDataTableHtml();
   
    userData
      .getJsonData()
      .then((data)=>{
        htmlTable
          .writeHtmlFile(data)
          .then(()=>{
            this.createServer();
            opn('http://localhost:'+this.options.port);
          })
          .catch(this.error);
      })
      .catch(this.error);

  }

}

module.exports = {
  UserDataTableHtml,
  UserDataJsonApi,
  Build
}