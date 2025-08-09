const adminAuth = require('./adminAuth')


function Routes(app){
    app.use("/",adminAuth);
}

module.exports = Routes;