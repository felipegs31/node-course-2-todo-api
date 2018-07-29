require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb')
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Carga} = require('./models/carga');
const {Analise} = require('./models/analise');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth");
    next();
});
  
app.post('/cargas', authenticate, (req, res) => {
    var carga = new Carga({
        peso: req.body.preco,
        _creator: req.user._id,
        grao: req.body.grao,
        placa: req.body.placa,
        nomeCarga: req.body.nomeCarga   
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
    })
    .populate('analise')
    .then((cargas)=> {
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

//Analise

//post analise de um user
app.post('/cargas/:id/analises', authenticate, (req, res) => {
    var id = req.params.id;

    var analise = new Analise({
        imagem: req.body.imagem,
        qualidade: req.body.qualidade,
        data: req.body.data,
        red: req.body.red,
        green: req.body.green,
        blue: req.body.blue,
        gray: req.body.gray,
        _creator: req.user._id
    });

    analise.save().then((doc) => {
        Carga.findOne({
            _id: id
        }).then((carga) => {
            carga._analise.push(doc);
            Carga.findOneAndUpdate({
                _id: id
            }, {$set: {_analise: carga._analise}}, 
            {new: true})
            .then((carga) => {
                res.send({carga});
            })
        })
    }, (e) => {
        res.status(400).send(e);
    });
});

//get todas as analises de um user de uma carga
app.get('/cargas/:id/analises', authenticate, (req,res) => {
    var id = req.params.id;
    Carga.findOne({
        _id: id,
        _creator: req.user._id
    })
    .populate('_analise')
    .then((carga) => {
        if(!carga) {
            return res.status(404).send();
        }
        res.send({carga})
    }).catch((e) => {
        res.status(400).send(e)
    })

});

//get todas as analises do sistema
app.get('/analises/all', authenticate, (req,res) => {
    Analise.find({}).then((analises)=> {
        res.send({analises})
    }, (e) => {
        res.status(400).send(e);
    })
});

//get todas as analises de um user
app.get('/analises/me/all', authenticate, (req,res) => {
    Analise.find({
        _creator: req.user._id
    }).then((analises)=> {
        res.send({analises})
    }, (e) => {
        res.status(400).send(e);
    })
});

//get analise em especifico
app.get('/analises/:id', authenticate, (req, res) => {
    var id = req.params.id;
    //validate id using is valid
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Analise.findOne({
        _id: id,
        _creator: req.user._id
    }).then((analise) => {
        if(!analise) {
            return res.status(404).send();
        }
        res.send({analise})
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.delete('/cargas/:idcarga/analises/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var idcarga = req.params.idcarga;
    //validate id using is valid
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Analise.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((analise) => {
        if(!analise) {
            return res.status(404).send();
        }        
        Carga.findOne({
            _id: idcarga
        }).then((carga) => {
            const index = carga._analise.indexOf(analise._id);
            if (index > -1) {
                carga._analise.splice(index, 1);
            }
            Carga.findOneAndUpdate({
                _id: id
            }, {$set: {_analise: carga._analise}}, {new: true})
            .then((cargadel) => {
                res.send({analise})
            })            
        })
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.patch('/analises/:id', authenticate, (req,res) => {
    var id = req.params.id;
    //var body = _.pick(req.body, ['preco', 'completed']);
    var body = _.pick(req.body, ['imagem', 'qualidade', 'data', 'red', 'green', 'blue', 'gray']);

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Analise.findOneAndUpdate({
        _id: id,
        _creator: req.user._id        
    }, {$set: body}, {new: true})
        .then((analise) => {
            if(!analise){
                return res.status(404).send();
            }
            res.send({analise});
        }).catch((e) => {   
            res.status(400).send();
        })
})


//Post /users
app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password', 'type','name']);
    const user = new User(body);

    user.save().then((cb) => {
        return user.generateAuthToken();
    }).then((token) => {
        var saida = {
            token: token,
            email: user.email,
            password: user.password,
            type: user.type,
            name: user.name
        }
        res.header('x-auth', token).send(saida);
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
            var saida = {
                token: token,
                email: user.email,
                password: user.password,
                type: user.type,
                name: user.name
            }
            res.header('x-auth', token).send(saida);            
        })
    }).catch((e) => {
        res.status(401).send(e);        
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