var mongoose = require('mongoose');
var Analise = require('./analise');
var Schema = mongoose.Schema;
var Carga = mongoose.model('Carga', {
    data: {
        type: Date,
        default: Date.now
    },
    preco: {
        type: Number,
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    _analise: [{
        type: Schema.Types.ObjectId, 
        ref: 'Analise'
    }]
});

module.exports = {
    Carga
}