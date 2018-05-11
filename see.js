const csvFilePath = './input.csv';
const csv = require('csvtojson');


var parse = require('csv-parse');

var input = './input.csv';
parse(input, {comment: '#'}, function(err, output){
  console.log(output);
});

var array = [];
var output = [];

readFile(function (data){
    console.log(data);

    for (i = 0; i < data.length; i++) {
        if (checkIfUserExist(output, data[i] )) {
            console.log("COMPLETE THIS ... ");
        } else {

            var obj = createObj(data[i]);
            output.push(obj);

        }


    }
//    console.log(output);
//    console.log(output2);
});


function createObj(line) {
    var obj = [];
    obj.fullname = line.fullname;
    obj.eid = line.eid;
    return obj;
}


function checkIfUserExist(output, user) {
    var found = output.find(function (line) {
        return line.fullname == user.fullname;
    });
    if (found) {
        return true;
    } else {
        return false;
    }
}

function readFile (callback) {
    csv()
        .fromFile(csvFilePath)
        .on('json',(jsonObj)=>{
            array.push(jsonObj);
        })
        .on('done',(error)=>{
            if (error) throw error;
            console.log("We got the data!");
            callback(array);
        })
}





const output2 = [{
  "fullname": "John Doe 1",
  "eid": "1234",
  "classes": [
    "Sala 1",
    "Sala 2",
    "Sala 3",
    "Sala 4",
    "Sala 5",
    "Sala 6"
  ],
  "addresses": [{
    "type": "phone",
    "tags": [
      "Responsável",
      "Mãe"
    ],
    "address": "551138839332"
  }, {
    "type": "email",
    "tags": [
      "Mãe"
    ],
    "address": "johndoemae1@gmail.com"
  }, {
    "type": "email",
    "tags": [
      "Aluno"
    ],
    "address": "johndoealuno1@gmail.com"
  }, {
    "type": "email",
    "tags": [
      "Responsável",
      "Pai"
    ],
    "address": "johndoepai2@gmail.com"
  }, {
    "type": "email",
    "tags": [
      "Responsável",
      "Pai"
    ],
    "address": "johndoepai3@gmail.com"
  }, {
    "type": "phone",
    "tags": [
      "Pai"
    ],
    "address": "5519985504400"
  }, {
    "type": "phone",
    "tags": [
      "Responsável",
      "Mãe"
    ],
    "address": "551138839333"
  }],
  "invisible": true,
  "see_all": true
}, {
  "fullname": "Mary Doe 2",
  "eid": "1235",
  "classes": "Sala 1",
  "addresses": [{
    "type": "email",
    "tags": [
      "Responsável",
      "Pai"
    ],
    "address": "marydoe1@gmail.com"
  }],
  "invisible": false,
  "see_all": false
}, {
  "fullname": "Victor Doe 3",
  "eid": "1236",
  "classes": [
    "Sala 6",
    "Sala 7"
  ],
  "addresses": [{
    "type": "email",
    "tags": [
      "Responsável",
      "Pai"
    ],
    "address": "victordoepai1@hotmail.com"
  }, {
    "type": "email",
    "tags": [
      "Mãe",
      "Aluno"
    ],
    "address": "victordoe3@gmail.com"
  }, {
    "type": "phone",
    "tags": [
      "Aluno"
    ],
    "address": "551974430033"
  }],
  "invisible": false,
  "see_all": false
}];
