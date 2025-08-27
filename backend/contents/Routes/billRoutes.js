const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { nanoid } = require('nanoid')
const Bill = require('../models/Bill')
const Order = require('../models/Order')

// Helper to transform DB bill to frontend Bill shape
function toFrontendBill(bill) {
    const billDate = bill.billDate ? new Date(bill.billDate).toLocaleDateString() : ''
    const dueDate = bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : ''
    return {
        id: bill.billId,
        customer: bill.customer || (bill.order && bill.order.orderedBy ? bill.order.orderedBy.name : ''),
        orderId: bill.orderIdText || (bill.order ? (bill.order._id?.toString() || '') : ''),
        billDate,
        dueDate,
        status: bill.status || 'Pending',
        totalAmount: bill.totalAmount || 0,
        gst: bill.gst || 0,
    }
}

// GET all bills
router.get('/admin/bills/all', async (req, res) => {
    try {
        const bills = await Bill.find().populate({
            path: 'order',
            select: '_id orderedBy',
            populate: { path: 'orderedBy', select: 'name' }
        })
        const result = bills.map(toFrontendBill)
        return res.json(result)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
})

// GET a single bill by billId
router.get('/admin/bills/:billId', async (req, res) => {
    try {
        const { billId } = req.params
        const bill = await Bill.findOne({ billId }).populate({
            path: 'order',
            select: '_id orderedBy',
            populate: { path: 'orderedBy', select: 'name email phone' }
        })
        if (!bill) return res.status(404).json({ error: 'Bill not found' })
        return res.json(toFrontendBill(bill))
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
})

// CREATE or UPDATE bill
router.post('/admin/bills/new', async (req, res) => {
    try {
        const { bill } = req.body
        if (!bill) return res.status(400).json({ error: 'Missing bill in request body' })

        // If billId present, update existing
        if (bill.id) {
            const updated = await Bill.findOneAndUpdate(
                { billId: bill.id },
                {
                    customer: bill.customer,
                    orderIdText: bill.orderId,
                    billDate: bill.billDate ? new Date(bill.billDate) : undefined,
                    dueDate: bill.dueDate ? new Date(bill.dueDate) : undefined,
                    status: bill.status,
                    totalAmount: bill.totalAmount,
                    gst: bill.gst,
                },
                { new: true }
            )
            if (!updated) return res.status(404).json({ error: 'Bill not found' })
            return res.status(200).json({ message: 'Bill updated' })
        }

        // Else create new
        const newBill = new Bill({
            billId: nanoid(10),
            customer: bill.customer,
            orderIdText: bill.orderId,
            billDate: bill.billDate ? new Date(bill.billDate) : Date.now(),
            dueDate: bill.dueDate ? new Date(bill.dueDate) : undefined,
            status: bill.status || 'Pending',
            totalAmount: bill.totalAmount,
            gst: bill.gst,
        })
        await newBill.save()
        return res.status(201).json({ message: 'Bill created' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
})

// DELETE bill
router.delete('/admin/bills/:billId', async (req, res) => {
    try {
        const { billId } = req.params
        const del = await Bill.deleteOne({ billId })
        if (del.deletedCount === 0) return res.status(404).json({ error: 'Bill not found' })
        return res.status(200).json({ message: 'Bill deleted' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
})

// Seed sample bills (optional)
router.post('/admin/bills/seed', async (req, res) => {
    try {
        const count = await Bill.countDocuments()
        if (count > 0) return res.status(400).json({ message: 'Bills already exist' })

        const sample = [
            {
                billId: nanoid(10),
                customer: 'John Doe',
                orderIdText: 'ORD-1001',
                billDate: new Date(),
                dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000),
                status: 'Pending',
                totalAmount: 4999,
                gst: 900,
            },
            {
                billId: nanoid(10),
                customer: 'Jane Smith',
                orderIdText: 'ORD-1002',
                billDate: new Date(),
                dueDate: new Date(Date.now() + 14 * 24 * 3600 * 1000),
                status: 'Paid',
                totalAmount: 12999,
                gst: 2340,
            },
        ]
        await Bill.insertMany(sample)
        return res.status(201).json({ message: 'Seeded bills' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = router