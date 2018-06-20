var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://felipegs:159753feh@ds255320.mlab.com:55320/node-course');
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
    mongoose    
}