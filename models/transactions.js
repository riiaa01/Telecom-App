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
    activationDate: {
        type: Date,
        default: Date.now,
    },
    expirationDate:{
        type: Date,
        default: function () {
            if (this.plan && this.activationDate) {
              const Plan = mongoose.model('Plan');
              return Plan.findById(this.plan).then((plan) => {
                if (plan && plan.validity) {
                  return new Date(this.activationDate.getTime() + plan.validity * 24 * 60 * 60 * 1000);
                }
              });
            }
          },  
    },
    amount: {
        type: Number,
        required: true,
    },
});
 
const Transactions = mongoose.model('Transaction', transactionSchema);
 
module.exports = Transactions;