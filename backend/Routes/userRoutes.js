const auth = require("../middleware/auth");
var express=require("express");
var usercontroller=require("../Controllers/controller");

var approute=express.Router();
const multer = require('multer');
const path = require('path');

var Storage = multer.diskStorage({
    destination: 'public/upload/user',
    
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
    
})

var upload = multer({ storage: Storage });
approute.get("/",usercontroller.welcomepage);
 approute.get("/login",usercontroller.login);
 approute.get("/register",usercontroller.register)




approute.post("/register",usercontroller.addUser);
approute.post("/login",usercontroller.loginUser);
approute.get("/resetpass",usercontroller.resetPass);
approute.post("/uploads",upload.single("file"),usercontroller.upload);
approute.patch("/update_user/:id",auth,usercontroller.updateUser);
approute.post("/forgotpass",usercontroller.forgotpass);
approute.post("/addpost",usercontroller.addpost);
approute.get("/fetchposts",auth,usercontroller.fetchposts)
module.exports=approute;