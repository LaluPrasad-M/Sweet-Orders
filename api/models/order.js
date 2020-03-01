const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    customerId: {type : mongoose.Schema.Types.ObjectId, ref: 'Customer'},
    name: {type : String, required : true},
    pricePerKg: {type : Number, required : true},
    quantityOfEachBox: {type: Number, required: true},
    NumberOfBox: {type: Number, required: true},
    Description: String,
});

module.exports = mongoose.model('Order', orderSchema);