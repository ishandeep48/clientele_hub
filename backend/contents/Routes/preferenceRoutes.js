const express = require('express')
const router = express.Router()
const AdminPreference = require('../models/AdminPreference')

// Get preferences by email
router.get('/admin/prefs/:email', async (req,res)=>{
    try{
        const pref = await AdminPreference.findOne({ email: req.params.email })
        if(!pref) return res.json({ email: req.params.email, darkMode: false })
        return res.json({ email: pref.email, darkMode: pref.darkMode })
    }catch(err){
        console.error(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
})

// Upsert preferences
router.post('/admin/prefs', async (req,res)=>{
    try{
        const { email, darkMode } = req.body
        if(!email) return res.status(400).json({ error: 'email required' })
        const updated = await AdminPreference.findOneAndUpdate(
            { email },
            { darkMode: !!darkMode, email },
            { upsert: true, new: true }
        )
        return res.json({ email: updated.email, darkMode: updated.darkMode })
    }catch(err){
        console.error(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = router


