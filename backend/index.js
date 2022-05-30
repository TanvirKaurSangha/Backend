require('./Config/db');
const express = require('express');

const bodyparser = require('body-parser')
const app = express();
var routes=require("./Routes/userRoutes")

// server configuration
const PORT = 8080;


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

