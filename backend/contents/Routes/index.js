const adminAuth = require('./adminAuth')
const orderRoutes = require('./orderRoutes')
const customerRoutes = require('./customerRoutes')
const productRoutes = require('./productRoutes')
const adminOrderRoutes = require('./adminOrderRoutes')


function Routes(app){
    app.use("/",adminAuth);
    app.use("/",orderRoutes)
    app.use("/",customerRoutes)
    app.use("/",productRoutes)
    app.use("/",adminOrderRoutes)
}

module.exports = Routes;