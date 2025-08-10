const adminAuth = require('./adminAuth')
const orderRoutes = require('./orderRoutes')


function Routes(app){
    app.use("/",adminAuth);
    app.use("/",orderRoutes)
}

module.exports = Routes;