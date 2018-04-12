// const MongoClient = require('mongodb').MongoClient; igual a linha de baixo
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log(err);
    }
    console.log('Connected to Mongodb Server');

    db.collection('Todos').insertOne({
        text: 'Walk the dog',
        complete: false 
    }, (err, result) => {
        if(err) {
            return console.log('Unable to insert todo', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
    })

    // db.collection('Users').insertOne({
    //     name: 'Felipe',
    //     age: 25,
    //     location: 'Brasil' 
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unable to insert todo', err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // })

     db.close();
});