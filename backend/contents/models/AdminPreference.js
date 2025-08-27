const mongoose = require('mongoose')

const adminPreferenceSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    darkMode: { type: Boolean, default: false },
})

module.exports = mongoose.model('AdminPreference', adminPreferenceSchema)


