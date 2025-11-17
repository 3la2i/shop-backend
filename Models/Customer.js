const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  address: String,
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
