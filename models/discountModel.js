const mongoose = require('mongoose')


const discountSchema = mongoose.Schema({
    weightLimit: {
        type: String,
        trim: true,
        required: true
    },
    distance: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    discountPercentage: {
        type: String,
        required: true
    },
    expired: {
        type: Boolean,
        default: false,
        required: true
    },
    expirationDate: {
        type: Date,
    },
    noOfSales: {
        type: Number,
        default: 1
    },
    description: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Company'
    }
})

const Discount = mongoose.model('discount', discountSchema)

module.exports = Discount