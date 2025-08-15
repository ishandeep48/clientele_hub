const express = require('express');
const router = express.Router();
const salesPerson = require('../models/SalesPerson')
const Sale = require('../models/Sales')
const Product = require('../models/Product')
const nanoid = require('nanoid')
router.get('/testhai/', async (req, res) => {
    const saless = await Sale.find().populate('prodId', 'pid ').populate('amount', 'price ').populate('salesPerson', 'name ');


    console.log(saless)
})


router.get('/admin/sales/all', async (req, res) => {
    try {
        const sales = await Sale.find().populate('prodId', 'pid ').populate('amount', 'price ').populate('salesPerson', 'name ');

        if (sales.length > 0) {
            return res.status(200).json(sales);
        } else {
            return res.status(404).json({ messsage: "No Sales Data found" });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Some error on our end" })
    }
})
router.post('/admin/sales/new', async (req, res) => {
    const data = req.body;

    // res.json({message:"hehe"})
    try {

        const salesPersonId = await salesPerson.findOne({ name: data.salesperson })
        const ProductID = await Product.findOne({ pid: data.product });
        console.log(ProductID._id.toString())
        // console.log(salesPersonId._id.toString())
        if (salesPersonId) {
            const sales = new Sale({
                prodId: ProductID._id.toString(),
                amount: parseInt(data.amount),
                date: data.date,
                salesPerson: salesPersonId._id.toString()
            })
            await sales.save()
            return res.status(200).json({ message: "done" });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "error occured" })
    }

})

router.post('/admin/sales/edit', async (req, res) => {
    const data = req.body;
    console.log(data);

    try {
        let sales = await Sale.findOne({ _id: data._id });
        const ProductID = await Product.findOne({ pid: data.product });
        const salesPersonId = await salesPerson.findOne({ name: data.salesperson })
        sales.prodId = ProductID?._id || data.prodId._id;
        sales.amount = parseInt(data.amount);
        sales.date = data.date;
        sales.salesPerson = salesPersonId?._id || data.salesPerson._id;
        await sales.save();
        return res.status(200).json({ message: "done" });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "error occured" })
    }
})

router.delete('/admin/sales/delete',async(req,res)=>{
    const data = req.body;
    try{
        await Sale.deleteOne({salesid:data.id})
        console.log("delted hehe")
        return res.status(200).json({message:"done"})
        
    }catch(e){
        console.error(e);
        return res.status(500).json({message:"Error occured"});
    }
})

module.exports = router;