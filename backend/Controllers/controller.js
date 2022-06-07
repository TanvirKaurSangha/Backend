
const mongoose=require('mongoose');
var Users=require("../Models/userModel");
var Posts=require("../Models/postModel")
const config =require("../Config/config")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
 const multer=require('multer')
const path=require('path')
const nodemailer=require("nodemailer");
const randomstring=require("randomstring");

//FILE UPLOADING

//
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

module.exports.forgotpass=async(req,res)=>{
  try {
     let { email } = req.body;
          let user_exist = await Users.findOne({ email: email });
      console.log(" Forgot pass Entered email",email);
        if (user_exist) {
              
              let randomString= randomstring.generate();
              let data=await Users.updateOne({email:email},{$set:{token:randomString}});
              console.log(data,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
             console.log(user_exist,randomString, "<----- User Token ----->");
             this.sendEmail(user_exist.firstname,user_exist.email,randomString)
            return res.json({
               success:true,
                status: 200,
                message: "Please check your inbox of mail and reset your password"
            })
        }
        else{
           return res.json({
                status: 200,
                message: "User Does not Exist"
            })
        }
    
  } catch (error) {
    return res.json({
                status: 400,
                message: error.message
            })
  }
}
module.exports.sendEmail=async(name,email,token)=>{
console.log(" Send Email token",token)
 
try {
 const transporter= nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    //  requireTLS:true,
    auth:{
      user:config.emailUser,
      pass:config.emailPassword
    }
  })
  const mailOptions={
    
    from:config.emailUser,
    to:email,
    subject: "For Reset Password",
    html:'<p> hii '+token+',Please copy the link <a href="http://localhost:8080/resetpass?token='+token+'"> and reset password'
  }
  transporter.sendMail(mailOptions,function(error,information){
    if(error){
      console.log(error);
    }
    else{
      console.log("mail has been successfully send",information.response);
    }
  })
  
} catch (error) {
  return res.json({
                status: 400,
                message: error.message
            })
}
}

module.exports.resetPass=async(req,res)=>{
  console.log("Reset Password Called");
   try {
     const token=req.query.token;
     const tokenData=await Users.findOne({token:token});
     console.log(token,"------------Resetpass",tokenData);
     if(tokenData !=null){
       console.log("IF______",tokenData);
      const password=req.body.password;
       console.log("password",password);
       const newpassword=await bcrypt.hash(password, 10);
       console.log("Newpassword",newpassword)
       const userData= await Users.findByIdAndUpdate({_id:tokenData._id},{$set:{password:newpassword,token:""}},{new:true})
       res.json({
               
                success:true,
                message: "password reset successfully",
                data:userData
            })
     }
     else{
        return res.json({
                status: 200,
                success:true,
                message: "This token has been expired"
            })
     }
   } catch (error) {
      return res.json({
                status: 400,
                message: error.message
            })
   }
}

module.exports.addpost=async(req,res)=>{

  let {post_content,postedBy}=req.body
  console.log("REQUEST BODY",req.body);
  try {
    let posts=await Posts.create({
      post_content:post_content,
      postedBy:postedBy
    })
    console.log("POSTS",posts);
      res.status(201).json({
              message:"Post Added Successfully",
              success:true,
              data:posts  
     })
    
  } 
    catch (error) {
  return res.json({
                status: 400,
                message: error.message
            })
}
  }

  //Function for checking valid objectid

  function isValidObjectID(parameter, name) {
  let checkForValidMongoDbID = new RegExp("^[0-9a-fA-F]{24}$");
  return checkForValidMongoDbID.test(parameter)
}

  //fetching all the posts of the specific user
module.exports.fetchposts=async(req,res)=>{
    console.log("fetchposts",req.query.user_id);
    try {
    let user_id=req.query.user_id;
       if (!user_id || user_id == ''|| isValidObjectID(user_id) === false) {
        res.json({
            status: "error",
            message: "Invalid parameter!"
        });
        return;
    }
    
    let userposts=await Posts.find({postedBy: user_id}).populate("postedBy","lastname")// here are the fields you want to display like lastname etc
   
    console.log("------------------->",user_id,userposts);
   

    res.status(201).json({
      message:"Posts fetched successfully",
      success:true,
      data:userposts
    })

    } catch (error) {
     console.log(error,'ppppppppppp');
  return res.json({
                status: 400,
                message: error.message
            })
    }

  }
