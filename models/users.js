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
        minlength: 6, // Adjust the minimum length as needed
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
        ref: 'Plan',
    }],
});


const User = mongoose.model('User', userSchema);


module.exports = User;
