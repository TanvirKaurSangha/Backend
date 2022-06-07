const mongoose=require('mongoose');
require("./userModel")
const postSchema=mongoose.Schema({
    post_content:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now()
    },
   postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    }

});
module.exports = mongoose.model('posts', postSchema, "posts");