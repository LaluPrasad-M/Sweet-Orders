const mongoose = require('mongoose');

const CustomerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    amountPaid: {type: Number, required: true},
    address: {type: String, required: true},
    totalAmount: {type:Number,default:0},
    orderDelivered: {type: String, default: "No"},
    phone: String,
});

module.exports = mongoose.model('Customer', CustomerSchema);