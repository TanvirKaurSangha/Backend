require('./Config/db');
var morgan=require("morgan");
var fs = require('fs')
var path = require('path')
const express = require('express');


const bodyparser = require('body-parser')
const app = express();
var routes=require("./Routes/userRoutes")

// server configuration
const PORT = 8080;

//implementing morgan
 
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
 
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use(express.static('public'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use("/",routes)
// make the server listen to requests

    app.listen(PORT, ()=>{
        console.log("Server is Listening on Port ", PORT);
    })

