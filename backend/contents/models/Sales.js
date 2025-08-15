const mongoose = require('mongoose')
const {nanoid} = require('nanoid')
const Product = require('./Product')
const Order = require('./Order')
const SalesPerson =require('./SalesPerson')
const salesSchema = new mongoose.Schema({
    salesid:{
        type:String,
        required:true,
        unique:true,
        default : ()=> nanoid(10)
    },
    prodId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    date:{
        type:Date,
        required:true,
        default:Date.now()
    },
    amount:{
        type: Number,
        required:true,
        min:0
    },
    salesPerson:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"SalesPerson"
    }
})

module.exports =  new mongoose.model("Sale",salesSchema)