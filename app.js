var fs = require('fs');
var parse = require('csv-parse');
 
var inputFile = './input.csv';
var lines = [];
var output = [];

readFile()
    .then(function() {
        return biuldObj(lines);
    })
    .then(function() {
        console.log(output);
    })
    .catch(function (e) {
        console.log("Something went wrong :", e);
    });
 




function biuldObj(data) {
    return new Promise(function(resolve, reject) {
        for (line = 1; line < data.length; line++) {
            var obj = {};
            for(row = 0; row < data[line].length; row++) {
                key = data[0][row];
                value = data[line][row];
                if (!obj[key]) {
                    obj[key] = value;
                } else {
                    obj[key] = obj[key] +", "+ value;
                }
            }
            output.push(obj);
        }
        resolve();
    });
}


function createObj(line,index) {
    var obj = [];
    obj.fullname = line[index];
    return obj;
}

function checkIfUserExist(output, user){
return false;
}



function readFile() {
    return new Promise(function(resolve, reject){
        var parser = parse({delimiter: ','}, function (err, data) {
            if (err) throw err;
            else {
                data.forEach(function(line) {
                    lines.push(line);
                });    
                resolve();
            }
        });
        fs.createReadStream(inputFile).pipe(parser);
    });
}
