const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const Admin =require('../models/Admin')
const hashPassword=require('../functions/hashing')
const{SECRET_KEY} = require('../functions/verifyToken')

router.get('/Hi',(req,res)=>{
    res.send('Hi');
})
//SIGNIN ROUTE FOR ADMIN(WILL BE REMOVED)
router.post('/admin/signin',async(req,res)=>{
    if(!req.body){ console.log("empty btich");return;}
    const {name,mail,password}=req.body;
    if(!mail && !password){
        return;
    }

    console.log(`mail is ${mail} and password is ${password}`);
    const hashedPass = await hashPassword(password);
    console.log(hashedPass)

    const newAdmin = new Admin({
        name,
        email:mail,
        password:hashedPass
    });

    await newAdmin.save();
    res.json({msg:"Registered"});
    res.send("OK BITCH")
})
//LOGIN ROUTE
router.post('/admin/login',async (req,res)=>{
    const {mail,password}=req.body;

    console.log(`mail is ${mail} and password is ${password}`);
    // const hashedPass = await hashPassword(password);
    // console.log(hashedPass)

    const admin = await Admin.findOne({email:mail});

    if(!admin){
        return res.json({isLoggedIn:false});
    }
    const isMatch = await bcrypt.compare(password,admin.password);
    if(!isMatch){
        return res.json({isLoggedIn:false})
    }
    if(admin.role!="admin"){
        return res.json({isLoggedIn:false});
    }

    const token = jwt.sign(
        {
            userID:admin._id,
            mail:admin.mail,
            role: admin.role
        },
        SECRET_KEY,
        {
            expiresIn:'30d'
        }
    );
    res.json({
        isLoggedIn: true,
        token
    });
    console.log("LOGGEDIN")
})

module.exports=router;
