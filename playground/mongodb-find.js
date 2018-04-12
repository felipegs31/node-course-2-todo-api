// const MongoClient = require('mongodb').MongoClient; igual a linha de baixo
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log(err);
    }
    console.log('Connected to Mongodb Server');

    // db.collection('Todos').find({_id: new ObjectID('5acecb124b5c43374c1f129c')}).toArray().then( (docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2))
    // }, (err) =>{
    //     console.log('unable to fetch todos', err)
    // });

    db.collection('Todos').find().count().then( (count) => {
        console.log('Todos count: ' + count);
    }, (err) =>{
        console.log('unable to fetch todos', err)
    });

     db.close();
});