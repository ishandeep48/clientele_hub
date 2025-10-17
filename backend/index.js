const express = require('express')
const middleware = require('./contents/middlewares/middleware.js')
const Routes = require('./contents/Routes/index.js')
const path = require('path')
const app =express()


middleware(app);
Routes(app);

app.listen(5000,()=>{
    console.log("server running at port 5000");
})