const cors = require('cors');
const express =require('express');
const mongoose = require('mongoose');

function middleware(app){
    app.use(express.json());
    app.use(cors({origin:"http://localhost:3000"})); 

    mongoose.connect('mongodb://127.0.0.1:27017/clienthub')
    .then(()=>console.log("Connected to database"))
    .catch(()=>console.log("Couldnt connect to database"))

}
module.exports = middleware;