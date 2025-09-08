const express = require('express');
const router = express.Router();
const { verifyToken } = require('../functions/verifyToken');
const Bill = require('../models/Bill');
const Order = require('../models/Order');

function toInvoice(bill){
  const date = bill.billDate ? new Date(bill.billDate).toISOString().slice(0,10) : new Date().toISOString().slice(0,10)
  const amount = Number(bill.totalAmount || 0) + Number(bill.gst || 0)
  return {
    id: bill.billId,
    date,
    amount,
    status: bill.status === 'Paid' ? 'Paid' : 'Due',
  }
}

// List invoices for current user
router.get('/user/billing', verifyToken, async (req,res)=>{
  try{
    const userId = req.user.userID
    console.log(userId)
    const orders = await Order.find({ orderedBy: userId }).select('_id')
    console.log(orders)
    const orderIds = orders.map(o => o._id)
    console.log(orderIds)
    const bills = await Bill.find({
      $or: [
        { order: { $in: orderIds } },
        { orderIdText: { $in: orderIds.map(id => id.toString()) } },
      ]
    })

    return res.json(bills.map(toInvoice))
  }catch(err){
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Mark invoice as paid
router.put('/user/billing/:billId/pay', verifyToken, async (req,res)=>{
  try{
    const userId = req.user.userID
    const { billId } = req.params

    const bill = await Bill.findOne({ billId }).populate({
      path: 'order',
      select: 'orderedBy'
    })
    if(!bill) return res.status(404).json({ error: 'Invoice not found' })

    // authorize ownership
    if (bill.order && String(bill.order.orderedBy) !== String(userId)){
      return res.status(403).json({ error: 'Forbidden' })
    }

    bill.status = 'Paid'
    await bill.save()
    return res.json({ message: 'Paid', ...toInvoice(bill) })
  }catch(err){
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router;


