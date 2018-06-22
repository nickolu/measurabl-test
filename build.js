const fs = require('fs');
const makeTable = require('./makeTable.js');
const htmlTemplate = require('./htmlTemplate.js');
const http = require('http')
const opn = require('opn');

function init() {
    const endPoint1 = 'https://api.myjson.com/bins/xqrsi';
    const endPoint2 = 'https://api.myjson.com/bins/szaya';

    makeTable.getData(endPoint1)
        .then((data) => {
            let tableData = data;
            makeTable.getData(endPoint2)
                .then((data)=>{
                    const combinedData = makeTable.combineDataSets(tableData, data);    
                    const htmlString = makeTable.makeHtmlTableString(combinedData);
                    
                    makeTable.makeHtmlFile(htmlString, htmlTemplate);

                    http.createServer(function(req, res){
                        fs.readFile('index.html',function (err, data){
                            res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
                            res.write(data);
                            res.end();
                        });
                    }).listen(8080);
                
                    opn('http://localhost:8080');
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        });
    
    
    
}

init();