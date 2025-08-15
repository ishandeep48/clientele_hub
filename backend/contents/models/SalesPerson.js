const mongoose = require('mongoose')

const salesPersonSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    uid:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    }
})

module.exports = new mongoose.model("SalesPerson",salesPersonSchema)