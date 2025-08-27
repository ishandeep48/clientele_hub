const mongoose = require('mongoose')

// Expanded to support frontend Bills requirements
const billSchema = new mongoose.Schema({
    billId: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: false
    },
    orderIdText: {
        // Optional textual Order ID when not linking by ObjectId
        type: String,
    },
    customer: {
        type: String,
        required: true
    },
    billDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    dueDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Overdue', 'Cancelled'],
        default: 'Pending'
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    gst: {
        type: Number,
        required: true,
        min: 0
    }
})

module.exports = mongoose.model('Bill', billSchema);
