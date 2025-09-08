const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true
    },
    role : {
        type: String,
        required: true,
        enum:["admin"],
        default: "admin"
    },
    lastLogin:{
        type: Date,
        // required: true,
        default: Date.now
    },
    lastEmailChanged:{
        type: Date,
        // required: true,
        default: Date.now
    },
    lastPasswordChanged:{
        type: Date,
        // required: true,
        default: Date.now
    }
})

module.exports = mongoose.model("Admin",adminSchema);