var fs = require('fs');
var parse = require('csv-parse');

var phoneNumber = require('awesome-phonenumber');
var Isemail = require('isemail');

var inputFile = './input.csv';
var lines = [];
var array = [];
var users = [];

readFile()
    .then(function() {
        return biuldObj(lines);
    })
    .then(function() {
        return mapJson();
    })
    .then(function(output) {
        output.forEach(function(item){console.log(item);});
//        console.log(output);
    })
    .catch(function (e) {
        console.log("Something went wrong: ", e);
    });
 

function mapJson() {

    var output = [];
    for (i = 0; i < array.length; i++) {
        if (checkIfUserExist(array[i].fullname)) {
            // complete an existing user

        } else {
            // add new user
            var obj = {};
            obj.addresses = [];
            var keys = Object.keys(array[i]);
            keys.forEach(function(key) {
                if (key == 'fullname') {
                    obj['fullname'] = array[i].fullname;
                } else if (key == 'eid') {
                    obj['eid'] = array[i].eid;
                } else if (key == 'class') {
                    obj['classes'] = getClasses(array[i].class);
                } else if (key == 'invisible') {
                    obj['invisible'] = array[i].invisible;
                } else if (key == 'see_all') {
                    obj['see_all'] = array[i].see_all;
                } else if (array[i][key]){
                    // don't hard code this keys
                    var t = key.split(" ");
                    var pn = new phoneNumber(array[i][key], 'BR');
                    if (t[0] == 'phone' && (new phoneNumber(array[i][key], 'BR').isValid()) ) {
                        // valid phone
                        if (t[2]) {
                            var temp = {
                                "type" : t[0],
                                "tags" : [t[1], t[2]],
                                "address" : array[i][key]
                            };
                        } else {
                            var temp = {
                                "type" : t[0],
                                "tags" : t[1],
                                "address" : array[i][key]
                            };
                        }
                    } else if (t[0] == 'email' && Isemail.validate(array[i][key]) ) {
                        // valid email
                        console.log(array[i][key], Isemail.validate(array[i][key]));
                        if (t[2]) {
                            var temp = {
                                "type" : t[0],
                                "tags" : [t[1], t[2]],
                                "address" : array[i][key]
                            };
                        } else {
                            var temp = {
                                "type" : t[0],
                                "tags" : t[1],
                                "address" : array[i][key]
                            };
                        }
                    }
                    obj.addresses.push(temp);
                }
            });
            output.push(obj);
            users.push(array[i].fullname);
        }
    } 
    return output;   
}


function getClasses(vec) {
    var regex = RegExp('Sala','g');
    var temp;
    var classes = [];
    while ((temp = regex.exec(vec)) !== null) {
        classes.push(vec.substring(temp.index, parseInt(`${regex.lastIndex}`) + 2));
    }
    return classes;
}

function checkIfUserExist(user) {
    return users.some(function (x){ return x == user});
}

function biuldObj(data) {
    return new Promise(function(resolve, reject) {
        var fullnameIndex = data[0].indexOf('fullname');
        for (line = 1; line < data.length; line++) {
      
                // add new user
                var obj = {};
                for(row = 0; row < data[line].length; row++) {
                    key = data[0][row];
                    value = data[line][row];
                    if (!obj[key]) {
                        // add new key
                        obj[key] = value;
                    } else {
                        // old key
                        obj[key] = obj[key] +", "+ value;
                    }
                }
                array.push(obj);
}
        resolve();
    });
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
