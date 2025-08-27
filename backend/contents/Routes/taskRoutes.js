const express = require('express')
const router = express.Router()
const Task = require('../models/Task')

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

// Get all tasks
router.get('/admin/tasks/all', async (req,res)=>{
    try{
        const tasks = await Task.find().sort({ dueDate: 1 })
        return res.json(tasks.map(toFrontendTask))
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

// Update a task by composite keys (title + dueDate)
router.put('/admin/tasks/update', async (req,res)=>{
    try{
        const { filter, update } = req.body
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

module.exports = router


