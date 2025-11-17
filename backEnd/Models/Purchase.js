const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      unitPrice: Number, // السعر عند البيع
    }
  ],
  totalAmount: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  remainingDebt: Number,
  paymentStatus: {
    type: String,
    enum: ['paid', 'partial', 'unpaid'],
    default: 'unpaid'
  },
  notes: String,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

// تحديث الحقول تلقائيًا قبل الحفظ
purchaseSchema.pre('save', function (next) {
  this.remainingDebt = this.totalAmount - this.amountPaid;
  this.paymentStatus =
    this.remainingDebt === 0 ? 'paid' :
    this.amountPaid === 0 ? 'unpaid' :
    'partial';
  next();
});

module.exports = mongoose.model('Purchase', purchaseSchema);
