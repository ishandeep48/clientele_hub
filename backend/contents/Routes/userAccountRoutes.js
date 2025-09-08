const express = require('express')
const router = express.Router()
const { verifyToken } = require('../functions/verifyToken')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const hashPassword = require('../functions/hashing')

// Get user profile
router.get('/user/profile', verifyToken, async (req,res)=>{
  try{
    const user = await User.findById(req.user.userID).select('name email company phone')
    if(!user) return res.status(404).json({ error: 'User not found' })
    return res.json({
      name: user.name || '',
      email: user.email || '',
      company: user.company || '',
      phone: user.phone || ''
    })
  }catch(err){
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Update user profile
router.put('/user/profile', verifyToken, async (req,res)=>{
  try{
    const { name, company, phone,email } = req.body || {}
    const user = await User.findById(req.user.userID)
    if(!user) return res.status(404).json({ error: 'User not found' })
    console.log(req.body)
    if(name) user.name = name
    if(company) user.company = company
    if(phone) user.phone = phone
    if(email) user.email = email
    
    await user.save()
    return res.json({ message: 'Profile updated' })
  }catch(err){
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Change password
router.put('/user/password', verifyToken, async (req,res)=>{
  try{
    const { currentPassword, newPassword } = req.body || {}
    if(!currentPassword || !newPassword) return res.status(400).json({ error: 'Current and new password required' })
    
    const user = await User.findById(req.user.userID)
    if(!user || !user.password) return res.status(404).json({ error: 'User not found' })
    
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if(!isMatch) return res.status(400).json({ error: 'Current password incorrect' })
    
    user.password = await hashPassword(newPassword)
    await user.save()
    return res.json({ message: 'Password updated' })
  }catch(err){
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
