// const dbName = 'MyAirtel';
// const db = client.db(dbName);

// const usersCollection = db.collection('users');

// const plansCollection = db.collection('plans');

// const transactionsCollection = db.collection('transactions');

// db.usersCollections.insertOne({
//     "_id": "65aea68ff91f79500a706487", 
//     "username": "ria",
//     "email": "ria12@gmail.com",
//     "password": "ria12",
//     "firstname": "Riya",
//     "lastname": "Singh",
//     "address": "GK2, New Delhi",
//     "coupons": "abc"
//   });

//   db.plansCollection.insertOne({
//     "_id": ObjectId("5f8d036f10e13b84358f3c42"),
//     "user_id": ObjectId("5f8d036f10e13b84358f3c40"),
//     "service_id": ObjectId("5f8d036f10e13b84358f3c41"),
//     "subscription_date": ISODate("2022-01-01T12:00:00Z"),
//     "expiry_date": ISODate("2022-02-01T12:00:00Z"),
//     "auto_renewal": true
//    });
   

// const mongoose = require('mongoose');

// // User Schema
// const userSchema = new mongoose.Schema({

//   username: { type: String, required: true },
//   email: { type: String, required: true },
//   password: { type: String, required: true },
//   // Add other user-related fields
// });

// // Plan Schema
// const planSchema = new mongoose.Schema({
//   planCode: { type: String, required: true, unique: true },
//   planName: { type: String, required: true },
//   description: { type: String },
//   price: { type: Number, required: true },
//   validityDays: { type: Number, required: true },
//   // Add other plan-related fields
// });

// // Transaction Schema
// const transactionSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
//   transactionDate: { type: Date, default: Date.now },
//   // Add other transaction-related fields
// });

// // Expiry Notification Schema
// const expiryNotificationSchema = new mongoose.Schema({
//   planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
//   expiryDate: { type: Date, required: true },
//   // Add other expiry notification-related fields
// });

// // Create models
// const User = mongoose.model('User', userSchema);
// const Plan = mongoose.model('Plan', planSchema);
// const Transaction = mongoose.model('Transaction', transactionSchema);

// module.exports = {
//   User,
//   Plan,
//   Transaction,
//   ExpiryNotification,
// };

const mongoose = require('mongoose');
 
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6, 
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    plansAssociated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'plans',
    }],
});
 
const User = mongoose.model('User', userSchema);
 
module.exports = User;
 