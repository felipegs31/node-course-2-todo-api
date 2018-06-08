// const MongoClient = require('mongodb').MongoClient; igual a linha de baixo
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log(err);
    }
    console.log('Connected to Mongodb Server');

    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID()
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })

    db.close();
});