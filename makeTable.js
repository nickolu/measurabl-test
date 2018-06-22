const fs = require('fs');
const getJSON = require('get-json');
const htmlTemplate = require('./htmlTemplate.js');

function getData(endpoint) {
    return new Promise((resolve,reject) => {
        getJSON(endpoint, (err, response) => {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            } 
        })
    });
}

function combineDataSets(data1, data2) {
    data1 = data1 || [];
    data2 = data2 || [];

    const hash = {};
    let newDataSet = [];
    
    data1.concat(data2).forEach((obj)=>{
        hash[obj.id] = Object.assign({}, hash[obj.id], obj);
    });

    newDataSet = Object.keys(hash).map((key) => {
        return hash[key]
    });
    
    return newDataSet;
}

function makeHtmlTableString(userData) {
    userData = userData || [];
    let htmlTableString = "";

    for (let i = 0, l = userData.length; i < l; i++) {
        let userId = userData[i].id ? userData[i].id : "";
        let firstName = userData[i].firstName ? userData[i].firstName : "";
        let lastName = userData[i].lastName ? userData[i].lastName : "";
        let age = userData[i].age ? userData[i].age : "";

        htmlTableString += `<tr><td>${userId}</td><td>${firstName}</td><td>${lastName}</td><td>${age}</td></tr>`;
    }

    return htmlTableString;
}

function makeHtmlFile(data, template) {
    fs.writeFile('index.html', htmlTemplate(data), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}

module.exports = {
    getData : getData,
    combineDataSets : combineDataSets,
    makeHtmlTableString : makeHtmlTableString,
    makeHtmlFile : makeHtmlFile
}