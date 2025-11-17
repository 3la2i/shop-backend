const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  text: { type: String, required: true },
  type: { type: String, enum: ['note', 'order'], default: 'note' },
  isDone: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
