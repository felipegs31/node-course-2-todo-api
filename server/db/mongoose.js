const mongoose = require('mongoose');
console.log(process.env.NODE_ENV);
const env = process.env.NODE_ENV || 'development';
let connectionString = '';
if ( env === 'development') {
    connectionString = 'mongodb://localhost:27017/Grano';
} else if (env === 'test') {
    connectionString = 'mongodb://localhost:27017/GranoTest';
} else {
    connectionString = 'mongodb://felipegs:159753feh@ds255320.mlab.com:55320/node-course';
}

mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://felipegs:159753feh@ds255320.mlab.com:55320/node-course');
console.log(connectionString);
mongoose.connect(connectionString);

module.exports = {
    mongoose    
}