var mongoose = require('mongoose');

var Analise = mongoose.model('Analise', {
    imagem: {
        type: Buffer
    },
    qualidade: {
        type: Number
    },
    data: {
        type: Date,
        default: Date.now
    },
    red: {
        type: Number        
    },
    green: {
        type: Number        
    },
    blue: {
        type: Number        
    },
    gray: {
        type: Number        
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    }
});

module.exports = {
    Analise
}