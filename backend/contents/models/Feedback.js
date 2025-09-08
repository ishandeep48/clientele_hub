const mongoose = require('mongoose')
const { nanoid } = require('nanoid')

const feedbackSchema = new mongoose.Schema({
  feedbackId: { type: String, required: true, unique: true, default: () => nanoid(12) },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 3 },
  tag: { type: String, enum: ['Suggestion', 'Bug Report', 'Complaint', 'Praise', 'Question'], default: 'Suggestion' },
  createdAt: { type: Date, default: Date.now, required: true },
})

module.exports = mongoose.model('Feedback', feedbackSchema)
