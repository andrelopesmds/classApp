var fs = require('fs');
var parse = require('csv-parse');
var phoneNumber = require('awesome-phonenumber');
var Isemail = require('isemail');

var inputFile = './input.csv';

var names = [];
var lines = [];
var headers = [];
var output = [];

readFile()
    .then(function() {
        return mapJson();
    })
    .then(function() {
        console.log(output);
        // Uncomment this line to see addresses details
        //output.forEach(function (item) { console.log(item.addresses);});
    })
    .catch(function (e) {
        console.log("Something went wrong: ", e);
    });

function mapJson() {
    return new Promise(function(resolve, reject) {
        for (i = 1; i < lines.length; i++) {
            var obj = {};
            obj.addresses = [];
            obj.classes = [];
            for (j = 0; j < lines[i].length; j++) {
                key = lines[0][j];
                value = lines[i][j];
                if (key == 'fullname' || key == 'eid') {
                    obj[key] = value;
                } else if (key == 'class') {
                    insertClass(obj, key, value);
                } else if (key == 'invisible' || key == 'see_all') {
                    if ( value.indexOf('yes') >=0  || value.indexOf('1') >= 0 ) {
                        obj[key] = true;
                    } else {
                        obj[key] = false;
                    }
                } else {
                    var s = key.split(" ");
                    if (s[0] == 'phone') {
                        insertPhone(obj, s, value);
                    } else if ( s[0] == 'email') {
                        insertEmail(obj, s, value);
                    }
                }
            }
            output.push(obj);
        }
        resolve();
    });
}

function insertPhone(obj, s, value) {
    var vec  = value.split(",");
    vec.forEach(function (item) {
        if (new phoneNumber(item, 'BR').isValid()) {
            var pn = new phoneNumber( item, 'BR' );
            var n = pn.getNumber();
            var number  = n.replace('+', '');
            tags = [];
            for(k = 1; k < s.length; k++) {
                tags.push(s[k]);
            }
            var temp = {
                "type" : s[0],
                "tags" : tags,
                "address" : number
            };
            obj.addresses.push(temp);
        }
    });
}

function insertEmail(obj, s, value) {
    var a = value.replace('/', ' ');
    var vec = a.split(/,| /);
    vec.forEach(function (item) {
        if (Isemail.validate(item)) {
            tags = [];
            tags.push(s[1]);
            if(s[2]) {
                tags.push(s[2]);
            }
            var temp = {
                "type" : s[0],
                "tags" : tags,
                "address" : item
            };
            obj.addresses.push(temp);
        }
    });
}

function insertClass(obj, key, value) {
    vec = getClasses(value);
    vec.forEach(function (item) {
        obj.classes[obj.classes.length] = item;
    });
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

function valueInVec(vec, value) {
    return vec.some(function (x){
        return x == value
    });
}

function readFile() {
    return new Promise(function(resolve, reject){
        var parser = parse({delimiter: ','}, function (err, data) {
            if (err) throw err;
            else {
                index = data[0].indexOf('fullname');
                removeLineDuplications(data);
                resolve();
            }
        });
        fs.createReadStream(inputFile).pipe(parser);
    });
}

function removeLineDuplications(data) {
    for (i = 0; i < data.length; i++) {
        if (valueInVec(names, data[i][index])) {
            const linePosition = names.indexOf(data[i][index]);
            for (j = 0; j < data[i].length; j++) {
                if (lines[0][j] != 'fullname' && lines[0][j] != 'eid') {
                    lines[linePosition][j] = lines[linePosition][j] + "," + data[i][j];
                }
            }
        } else {
            lines.push(data[i]);
            names.push(data[i][index]);
        }
    }
}
