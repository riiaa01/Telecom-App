const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  transactionDate: { type: Date, default: Date.now },
  modeOfPayment: { type: String, required: true },
  amountPaid: { type: Number, required: true },
  
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
