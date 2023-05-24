const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jsw = require('jsonwebtoken')



const requestSchema = mongoose.Schema({
    weight: {
        type: String,
        required: true,
        trimmed: true
    },
    pickUp: [{
        streetNo: {
            type: String,
        },
        area: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        }
    }],
    destination: [{
        streetNo: {
            type: String,
            required: true
        },
        area: {
            type: String
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String
        }
    }],
    price: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    acceptStatus: {
        type: Boolean,
        default: false
    },
    paymentStatus: {
        type: Boolean,
        default: false
    },
    pickUpStatus: {
        type: Boolean,
        default: false
    },
    pickUpStatusLogistic: {
        type: Boolean,
        default: false
    },
    deliveryStatus: {
        type: Boolean,
        default: false
    },
    deliveryStatusLogistic: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    },
    owner2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver'
    }
})

const Request = mongoose.model('Request', requestSchema)

module.exports = Request