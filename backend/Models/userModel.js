const mongoose=require('mongoose');
var UsersSchema=mongoose.Schema({
      firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
 
    password: {
        type: String,
         required: true
    },
     file: { type: String,required:true,},
})
module.exports = mongoose.model('user', UsersSchema, "user");