require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb')
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Carga} = require('./models/carga');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/cargas', authenticate, (req, res) => {
    var carga = new Carga({
        preco: req.body.preco,
        _creator: req.user._id
    });

    carga.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/cargas', authenticate, (req,res) => {
    Carga.find({
        _creator: req.user._id
    }).then((cargas)=> {
        res.send({cargas})
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/cargas/:id', authenticate, (req, res) => {
    var id = req.params.id;
    //validate id using is valid
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Carga.findOne({
        _id: id,
        _creator: req.user._id
    }).then((carga) => {
        if(!carga) {
            return res.status(404).send();
        }
        res.send({carga})
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.delete('/cargas/:id', authenticate, (req, res) => {
    var id = req.params.id;
    //validate id using is valid
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Carga.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((carga) => {
        if(!carga) {
            return res.status(404).send();
        }
        res.send({carga})
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.patch('/cargas/:id', authenticate, (req,res) => {
    var id = req.params.id;
    //var body = _.pick(req.body, ['preco', 'completed']);
    var body = _.pick(req.body, ['preco']);

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    // if(_.isBoolean(body.completed) && body.completed) {
    //     body.completedAt = new Date().getTime();
    // } else {
    //     body.completed = false;
    //     body.completedAt = null;
    // }

    Carga.findOneAndUpdate({
        _id: id,
        _creator: req.user._id        
    }, {$set: body}, {new: true})
        .then((carga) => {
            if(!carga){
                return res.status(404).send();
            }
            res.send({carga});
        }).catch((e) => {   
            res.status(400).send();
        })
})


//Post /users
app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);    
    const user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);        
    })
});


app.get('/users/me',authenticate, (req,res) => {
    res.send(req.user);
})

//Post /users/login {email, password}
app.post('/users/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);    

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);            
        })
    }).catch((e) => {
        res.status(400).send(e);        
    })
});

app.delete('/users/me/token', authenticate, (req,res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});


app.listen(port, () => {
    console.log(`started in port ${port}`);
});


module.exports = {
    app
}