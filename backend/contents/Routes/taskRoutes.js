const express = require('express')
const router = express.Router()
const Task = require('../models/Task')
const Ticket = require('../models/Ticket')
const User = require('../models/User')

// Shape transformer to exactly what frontend expects
function toFrontendTask(task){
    return {
        title: task.title,
        customer: task.customer,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assignedUser: task.assignedUser,
    }
}

// Get all tasks (including auto-generated from tickets)
router.get('/admin/tasks/all', async (req,res)=>{
    try{
        // Get regular tasks
        const tasks = await Task.find().sort({ dueDate: 1 })
        
        // Get open tickets and convert to tasks
        const openTickets = await Ticket.find({ status: 'Open' })
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
        
        const ticketTasks = openTickets.map(ticket => ({
            title: `Support: ${ticket.subject}`,
            customer: ticket.user?.name || ticket.user?.email || 'Unknown',
            status: 'Pending',
            priority: 'Medium',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            assignedUser: 'Unassigned',
            isTicket: true,
            ticketId: ticket.ticketId,
            description: ticket.description
        }))
        
        // Combine regular tasks and ticket tasks
        const allTasks = [...tasks.map(toFrontendTask), ...ticketTasks]
        return res.json(allTasks)
    }catch(err){
        console.error(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
})

// Create task
router.post('/admin/tasks/new', async (req,res)=>{
    try{
        const { task } = req.body
        if(!task) return res.status(400).json({ error: 'Missing task in body' })
        const created = await Task.create({
            title: task.title,
            customer: task.customer,
            status: task.status || 'Pending',
            priority: task.priority || 'Medium',
            dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
            assignedUser: task.assignedUser,
        })
        return res.status(201).json({ message: 'Task created' })
    }catch(err){
        console.error(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
})

// Update a task by composite keys (title + dueDate) or ticketId
router.put('/admin/tasks/update', async (req,res)=>{
    try{
        const { filter, update } = req.body
        
        // Check if this is a ticket-based task
        if(filter?.ticketId){
            const ticket = await Ticket.findOne({ ticketId: filter.ticketId })
            if(!ticket) return res.status(404).json({ error: 'Ticket not found' })
            
            // Update ticket status based on task status
            if(update?.status === 'Completed'){
                ticket.status = 'Closed'
                ticket.updatedAt = Date.now()
                await ticket.save()
            }
            
            return res.json({ message: 'Ticket task updated' })
        }
        
        // Regular task update
        if(!filter || !filter.title || !filter.dueDate){
            return res.status(400).json({ error: 'Missing filter.title or filter.dueDate' })
        }
        const updated = await Task.findOneAndUpdate(
            { title: filter.title, dueDate: new Date(filter.dueDate) },
            {
                ...(update?.title ? { title: update.title } : {}),
                ...(update?.customer ? { customer: update.customer } : {}),
                ...(update?.status ? { status: update.status } : {}),
                ...(update?.priority ? { priority: update.priority } : {}),
                ...(update?.dueDate ? { dueDate: new Date(update.dueDate) } : {}),
                ...(update?.assignedUser ? { assignedUser: update.assignedUser } : {}),
            },
            { new: true }
        )
        if(!updated) return res.status(404).json({ error: 'Task not found' })
        return res.json({ message: 'Task updated' })
    }catch(err){
        console.error(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
})

// Delete task by composite keys (title + dueDate) fallback; in real case would use _id
router.delete('/admin/tasks/delete', async (req,res)=>{
    try{
        const { title, dueDate } = req.body
        if(!title || !dueDate) return res.status(400).json({ error: 'Missing title or dueDate' })
        const del = await Task.deleteOne({ title, dueDate: new Date(dueDate) })
        if(del.deletedCount === 0) return res.status(404).json({ error: 'Task not found' })
        return res.json({ message: 'Task deleted' })
    }catch(err){
        console.error(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
})

// Seed sample tasks
router.post('/admin/tasks/seed', async (req,res)=>{
    try{
        const count = await Task.countDocuments()
        if(count>0) return res.status(400).json({ message: 'Tasks already exist' })
        await Task.insertMany([
            { title: 'Follow up with Acme', customer: 'Acme Inc.', status: 'Pending', priority: 'High', dueDate: new Date(), assignedUser: 'Alex' },
            { title: 'Prepare proposal', customer: 'Globex', status: 'In Progress', priority: 'Medium', dueDate: new Date(Date.now()+86400000), assignedUser: 'Priya' },
            { title: 'Invoice payment', customer: 'Soylent', status: 'Completed', priority: 'Low', dueDate: new Date(Date.now()-86400000*2), assignedUser: 'Sam' },
        ])
        return res.status(201).json({ message: 'Seeded tasks' })
    }catch(err){
        console.error(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
})

// Add admin response to ticket (when task is updated)
router.post('/admin/tasks/ticket-response', async (req,res)=>{
    try{
        const { ticketId, message } = req.body
        if(!ticketId || !message) return res.status(400).json({ error: 'ticketId and message required' })
        
        const ticket = await Ticket.findOne({ ticketId })
        if(!ticket) return res.status(404).json({ error: 'Ticket not found' })
        
        ticket.responses.push({
            from: 'Admin',
            message,
            time: new Date().toLocaleString()
        })
        ticket.updatedAt = Date.now()
        await ticket.save()
        
        return res.json({ message: 'Response added to ticket' })
    }catch(err){
        console.error(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = router


