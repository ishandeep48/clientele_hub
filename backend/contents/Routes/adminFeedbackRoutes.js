const express = require('express')
const router = express.Router()
const { verifyToken } = require('../functions/verifyToken')
const Feedback = require('../models/Feedback')
const User = require('../models/User')

// Get all feedback for admin view
router.get('/admin/feedback/all', async (req,res)=>{
  try{    
    const feedback = await Feedback.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
    
    console.log('Admin feedback query result:', feedback.length, 'items')
    
    const result = feedback.map(f => ({
      id: f.feedbackId,
      message: f.message,
      customer: f.user?.name || f.user?.email || 'Unknown',
      rating: f.rating || 3,
      tag: f.tag || 'Suggestion',
      date: new Date(f.createdAt).toISOString().slice(0,10)
    }))
    console.log(result)
    return res.json(result)
  }catch(err){
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
