const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' }, // اختياري
  amount: { type: Number, required: true },
  method: String, // cash, transfer, etc
  note: String,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
