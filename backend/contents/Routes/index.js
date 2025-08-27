const adminAuth = require('./adminAuth')
const orderRoutes = require('./orderRoutes')
const customerRoutes = require('./customerRoutes')
const productRoutes = require('./productRoutes')
const adminOrderRoutes = require('./adminOrderRoutes')
const paymentRoutes = require('./paymentsRoutes')
const salesRoutes = require('./salesRoutes')
const billRoutes = require('./billRoutes')
const taskRoutes = require('./taskRoutes')
const preferenceRoutes = require('./preferenceRoutes')

function Routes(app){
    app.use("/",adminAuth);
    app.use("/",orderRoutes)
    app.use("/",customerRoutes)
    app.use("/",productRoutes)
    app.use("/",adminOrderRoutes)
    app.use("/",paymentRoutes)
    app.use('/',salesRoutes)
    app.use('/',billRoutes)
    app.use('/',taskRoutes)
    app.use('/',preferenceRoutes)
}

module.exports = Routes;