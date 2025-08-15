const adminAuth = require('./adminAuth')
const orderRoutes = require('./orderRoutes')
const customerRoutes = require('./customerRoutes')
const productRoutes = require('./productRoutes')
const adminOrderRoutes = require('./adminOrderRoutes')
const paymentRoutes = require('./paymentsRoutes')
const salesRoutes = require('./salesRoutes')

function Routes(app){
    app.use("/",adminAuth);
    app.use("/",orderRoutes)
    app.use("/",customerRoutes)
    app.use("/",productRoutes)
    app.use("/",adminOrderRoutes)
    app.use("/",paymentRoutes)
    app.use('/',salesRoutes)
}

module.exports = Routes;