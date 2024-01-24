const mongoose = require('mongoose');
 
const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: true,
    },
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
    amount: {
        type: Number,
        required: true,
    },
});
 
const Transactions = mongoose.model('Transaction', transactionSchema);
 
module.exports = Transactions;