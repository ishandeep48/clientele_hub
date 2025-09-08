const mongoose = require('mongoose')
const { nanoid } = require('nanoid')

const responseSchema = new mongoose.Schema({
  from: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: String, required: true },
},{ _id: false })

const feedbackSchema = new mongoose.Schema({
  rating: { type: Number, min: 0, max: 5 },
  comment: { type: String }
},{ _id: false })

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true, default: () => nanoid(12) },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  attachment: { type: String },
  status: { type: String, enum: ['Open','Closed'], default: 'Open' },
  responses: { type: [responseSchema], default: [] },
  feedback: { type: feedbackSchema },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
})

module.exports = mongoose.model('Ticket', ticketSchema)


