const mongoose = require('mongoose');
const db = require('mysql');
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "nodedb",
    database: "nodeskretch",
});
db.Promise = global.Promise
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/skretch', { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MySQL

db.connect((err) => { if (err) { throw err; }
    console.log("MySql Connected"); });
module.exports = { mongoose };