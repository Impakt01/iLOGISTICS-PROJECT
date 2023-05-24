const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jsw = require('jsonwebtoken')


const customerSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true,
        trim: true
    },
    lName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(val) {
            const isEmail = validator.isEmail(val)
            if (!isEmail) {
                throw new Error('Please enter a Valid Email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(val) {
            if (val.length < 8) {
                throw new Error('Password should be more than 8 Characters')
            }
        }
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    tokens: [ {
        token: {
            type: String,
            required: true
        }
    }
    ]
})

customerSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}


customerSchema.methods.generateAuthToken = async function () {
    user = this

    const token = jsw.sign({_id: user._id.toString()}, 'logisticsTokeIt')
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

customerSchema.statics.findCredentials = async (email, password) => {
    const customer = await Customer.findOne({ email })

    if (!customer) {
        throw new Error({
            errror: 'invalid Credentials, please try again'
        })
    }

    const compare = await bcrypt.compare(password, customer.password)

    if (!compare) {
        throw new Error({
            errror: 'invalid Credentials, please try again'
        })
    }

    return customer
}


customerSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})



const Customer = mongoose.model('customer', customerSchema)


module.exports = Customer