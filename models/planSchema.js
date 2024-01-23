const mongoose = require('mongoose');

// Plan Schema
const planSchema = new mongoose.Schema({
  planId: { type: String, unique: true, required: true },
  subscriptionName: { type: String, required: true },
  description: { type: String },
  validity: { type: String, required: true },
  dataLimit: { type: String },
  talktimeLimit: { type: String },
  price: { type: Number, required: true },
});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
