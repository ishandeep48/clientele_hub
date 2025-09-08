const express = require('express')
const router = express.Router()
const { verifyToken } = require('../functions/verifyToken')
const Ticket = require('../models/Ticket')

function toFrontendTicket(t){
  return {
    id: t.ticketId,
    subject: t.subject,
    description: t.description,
    status: t.status,
    updatedAt: new Date(t.updatedAt).toISOString().slice(0,10),
    responses: (t.responses||[]).map(r=>({ from: r.from, message: r.message, time: r.time })),
    feedback: t.feedback ? { rating: t.feedback.rating||0, comment: t.feedback.comment||'' } : undefined,
  }
}

// List user's tickets
router.get('/user/support/tickets', verifyToken, async (req,res)=>{
  try{
    const tickets = await Ticket.find({ user: req.user.userID }).sort({ updatedAt: -1 })
    return res.json(tickets.map(toFrontendTicket))
  }catch(err){
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Create ticket
router.post('/user/support/tickets', verifyToken, async (req,res)=>{
  try{
    const { subject, description, attachment } = req.body || {}
    if(!subject || !description) return res.status(400).json({ error: 'subject and description required' })
    const t = await Ticket.create({ user: req.user.userID, subject, description, attachment, status: 'Open' })
    return res.status(201).json(toFrontendTicket(t))
  }catch(err){
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Add client response
router.post('/user/support/tickets/:ticketId/respond', verifyToken, async (req,res)=>{
  try{
    const { ticketId } = req.params
    const { message } = req.body || {}
    if(!message) return res.status(400).json({ error: 'message required' })
    const t = await Ticket.findOne({ ticketId, user: req.user.userID })
    if(!t) return res.status(404).json({ error: 'Ticket not found' })
    t.responses.push({ from: 'Client', message, time: new Date().toLocaleString() })
    t.updatedAt = Date.now()
    await t.save()
    return res.json(toFrontendTicket(t))
  }catch(err){
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Submit feedback and optionally close
router.post('/user/support/tickets/:ticketId/feedback', verifyToken, async (req,res)=>{
  try{
    const { ticketId } = req.params
    const { rating, comment, close } = req.body || {}
    const t = await Ticket.findOne({ ticketId, user: req.user.userID })
    if(!t) return res.status(404).json({ error: 'Ticket not found' })
    t.feedback = { rating: Number(rating)||0, comment: comment||'' }
    if(close) t.status = 'Closed'
    t.updatedAt = Date.now()
    await t.save()
    return res.json(toFrontendTicket(t))
  }catch(err){
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router


