const mongoose = require('mongoose');


const planSchema = new mongoose.Schema({
    planCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    planName: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    validity: {
        type: Number,
        required: true,
    },
    dataLimit: {
        type: Number,
    },
    talktimeLimit: {
        type: Number,
    },
    smsLimit: {
        type: Number,
    },
    price: {
        type: Number,
        required: true,
    },
});


const Plans = mongoose.model('Plan', planSchema);


module.exports = Plans;


