const express = require('express')
const router = express.Router()
const { verifyToken } = require('../functions/verifyToken')
const Feedback = require('../models/Feedback')

function toFrontendFeedback(f){
  return {
    id: f.feedbackId,
    message: f.message,
    rating: f.rating || 3,
    tag: f.tag || 'Suggestion',
    createdAt: new Date(f.createdAt).toISOString().slice(0,10)
  }
}

// List user's feedback
router.get('/user/feedback', verifyToken, async (req,res)=>{
  try{
    const feedback = await Feedback.find({ user: req.user.userID }).sort({ createdAt: -1 })
    return res.json(feedback.map(toFrontendFeedback))
  }catch(err){
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Create feedback
router.post('/user/feedback', verifyToken, async (req,res)=>{
  try{
    const { message, rating, tag } = req.body || {}
    if(!message) return res.status(400).json({ error: 'message required' })
    console.log('Creating feedback for user:', req.user.userID, 'message:', message, 'rating:', rating, 'tag:', tag)
    const f = await Feedback.create({ 
      user: req.user.userID, 
      message, 
      rating: rating || 3, 
      tag: tag || 'Suggestion' 
    })
    console.log('Feedback created:', f.feedbackId)
    return res.status(201).json(toFrontendFeedback(f))
  }catch(err){
    console.error('Feedback creation error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
