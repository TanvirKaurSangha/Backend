const mongoose = require('mongoose');//Connection to the mongodb database
mongoose.connect('mongodb://localhost:27017/MyD',{useNewURLparser:true,UseUnifiedTopology:true})
.then(()=>{
    
        console.log("<<<<<<<<<<<--Database connection is Ready-->>>>>>> ")
     
})
.catch((err)=>{
    console.log(err)
    console.log("<<<<<<<<<<--A error has been occurred while"
        + " connecting to database.-->>>>>>>>>");   
})