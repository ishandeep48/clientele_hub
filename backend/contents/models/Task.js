const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    customer: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'], default: 'Pending' },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    dueDate: { type: Date, required: true },
    assignedUser: { type: String, required: true }
})

module.exports = mongoose.model('Task', taskSchema)


