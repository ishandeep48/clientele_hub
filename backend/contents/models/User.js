const mongoose =require('mongoose');

const userSchema = new mongoose.Schema({
    uid:{
        type:String,
        unique:true,
        required:true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    role : {
        type: String,
        required: true,
        enum:["user"],
        default: "user"
    },
    userType:{
        type:String,
        required:true,
        enum:["customer","lead"],
        default:["lead"]
    }
});

module.exports=mongoose.model("User",userSchema);