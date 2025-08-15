const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Order = require('../models/Order')
const User = require('../models/User')


router.get('/admin/payments/all',async(req,res)=>{
try{
    const payments = await Order.find().populate("orderedBy","name").select("Paymentid orderedBy method price date ");
    console.log(payments)
    if(payments.length>0){
        return res.status(201).json(payments);
    }else{
        return res.status(404).json({message:"No payments found"});
    }
} catch(e){
    console.log(e);
    return res.status(500).json({message:"Some error on our end"})
}
})

module.exports = router