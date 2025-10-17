const cors = require('cors');
const express =require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const connectionString = process.env.MONGO_CONNECTION_STRING
function middleware(app){
    app.use(express.json());
    app.use(cors({origin:"*"})); 

    // mongoose.connect('mongodb://127.0.0.1:27017/clienthub')
    mongoose.connect(connectionString)
    .then(()=>console.log("Connected to database"))
    .catch((e)=>console.log("Couldnt connect to database ",e))

}
module.exports = middleware;