
const mongoose=require('mongoose');
var Users=require("../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
 const multer=require('multer')
const path=require('path')

//FILE UPLOADING

//jugtdrjhgtdrc
module.exports.upload=async(req, res) => {
  console.log("File uploaded ")
  try {
    
        if (!req.file) {
            res.send('something went wrong while uploading file');
        }
        var path=req.file.path
        //  var path = "/" + req.file.path.replace(/\/?public\/?/g, "");
          res.send("File is uploaded url : " + path);
        // res.send(req.file);
  
  } catch (err) {
    console.log(err)
     return res.status(401).json({
            message:"Error in uploading file",
            success:false,
            error:err.message
        })
  }
   
}


//REGISTERING A USER
module.exports.addUser=async(req,res)=>{



    try {
        var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/upload/user');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

var upload = multer({ storage: storage }).single("file");
  upload(req, res, function (err) {
        if (err) {
            return res.json({
                status: "error",
                message: "Error in uploading file"
            });
        }
      
      

    });

 let { email } = req.body;
          let old_user = await Users.findOne({ email: email });
      
        if (old_user) {
              console.log(old_user, "<-----user found----->");
            return res.json({
                status: 200,
                message: "User already exist"
            })
        }

else{
             encryptedPassword = await bcrypt.hash(req.body.password, 10);

  
            const users=await Users.create(
        {
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            password:encryptedPassword,
            file:req.file.filename
        })

     res.status(201).json({
        message:"User Registered Successfully",
              success:true,
              data:users  
     })
}
  
}
     
     catch (error) {
        return res.status(401).json({
            message:"Error in Adding user",
            success:false,
            error:error.message
        })
        
    }
}

//lOGIN USER
module.exports.loginUser=async(req,res)=>{

  try {
    // Get user input
    const { email, password } = req.body;

    
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
  
    const user = await Users.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
       "TOKEN_KEY_SECRET_HERE" ,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      return res.status(200).json(user);
      
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  
}

//UPDATING USER
module.exports.updateUser=async(req,res)=>{
  try {
    const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Users.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
  } catch (error) {
    console.log(error);
     res.status(400).json({ message: error.message })
  }


}

module.exports.resetPass=async(req,res)=>{
    console.log(req)
    res.json({
        message:"Password reset successfully",
        success:true,

    })
}