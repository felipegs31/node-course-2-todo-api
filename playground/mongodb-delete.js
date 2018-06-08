// const MongoClient = require('mongodb').MongoClient; igual a linha de baixo
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log(err);
    }
    console.log('Connected to Mongodb Server');

    db.collection('Todos').deleteMany({text: 'Eat Lunch'}).then( (result) => {
        console.log(result);
    }, (err) =>{
        console.log('unable to fetch todos', err)
    });

    db.collection('Todos').find().count().then( (count) => {
        console.log('Todos count: ' + count);
    }, (err) =>{
        console.log('unable to fetch todos', err)
    });

     db.close();
});