const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Admin = require("../models/Admin");
const hashPassword = require("../functions/hashing");
const { SECRET_KEY } = require("../functions/verifyToken");

// router.get('/Hi',(req,res)=>{
//     res.send('Hi');
// })
//SIGNIN ROUTE FOR ADMIN(WILL BE REMOVED)
router.post("/admin/signin", async (req, res) => {
  if (!req.body) {
    console.log("empty btich");
    return;
  }
  const { name, mail, password } = req.body;
  if (!mail && !password) {
    return;
  }

  console.log(`mail is ${mail} and password is ${password}`);
  const hashedPass = await hashPassword(password);
  console.log(hashedPass);

  const newAdmin = new Admin({
    name,
    email: mail,
    password: hashedPass,
  });

  await newAdmin.save();
  res.json({ msg: "Registered" });
  res.send("OK BITCH");
});
//LOGIN ROUTE
router.post("/admin/login", async (req, res) => {
  const { mail, password } = req.body;

  console.log(`mail is ${mail} and password is ${password}`);
  // const hashedPass = await hashPassword(password);
  // console.log(hashedPass)

  const admin = await Admin.findOne({ email: mail });

  if (!admin) {
    return res.json({ isLoggedIn: false });
  }
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.json({ isLoggedIn: false });
  }
  if (admin.role != "admin") {
    return res.json({ isLoggedIn: false });
  }

  const token = jwt.sign(
    {
      userID: admin._id,
      mail: admin.email,
      role: admin.role,
      name: admin.name,
      lastLogin: Date.now(),
    },
    SECRET_KEY,
    {
      expiresIn: "30d",
    }
  );
  admin.lastLogin = Date.now();
  await admin.save();
  res.json({
    isLoggedIn: true,
    token,
  });
  console.log("LOGGEDIN");
});

router.post("/admin/updatedetails", async (req, res) => {
  const data = req.body;
  console.log(data);
  try {
    const adminUser = await Admin.findOne({ email: data.original });
    if (!adminUser) {
      return res.status(404).json({ msg: "TEST NO VALID" });
    }
    adminUser.email = data.email;
    adminUser.name = data.name;
    adminUser.lastEmailChanged = Date.now()
    await adminUser.save();
    const token = jwt.sign(
      {
        userID: adminUser._id,
        mail: adminUser.email,
        role: adminUser.role,
        name: adminUser.name,
        lastLogin: Date.now(),
        lastEmailChanged: Date.now()
      },
      SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
    return res.status(200).json({
      status: true,
      msg: "Done Update",
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "This is that",
    });
  }
});

router.post("/admin/updatepass", async (req, res) => {
  const {email,current_pass,new_password} = req.body;
  // console.log(data)
  try {
    const admin = await Admin.findOne({ email });
    if(!admin){
        return res.status(404).json({
            success:false,
            msg:"WRONGGGGGGG"
        })
    }
    const isMatch = await bcrypt.compare(current_pass,admin.password)
    if(!isMatch){
         return res.status(405).json({
            success:false,
            msg:"WRONGGGGGGG"
        })
    }
    const hashPass = await hashPassword(new_password)
    admin.password = hashPass;
    admin.lastPasswordChanged =Date.now()
    await admin.save();
    return res.status(202).json({
        success:true,
        msg:"DONE",
        lastPass : Date.now()
    })
  } catch (err) {
    console.log(err);
     return res.status(404).json({
            success:false,
            msg:"Issue on our side"
        })
  }
});

router.delete('/admin/deleteacc',async(req,res)=>{
    const {email} = req.body;
    try{
        await Admin.deleteOne({email})
        return res.status(203).json({
            success:true,
            msg:"Done"
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            msg:"some error on our end"
        })
    }
})
module.exports = router;
