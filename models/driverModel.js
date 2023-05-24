const mongoose = require('mongoose')
const { default: isEmail } = require('validator/lib/isEmail')
const jsw = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const driverSchema = mongoose.Schema({
    driverName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
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
    vehicleRegNo: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Company'
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

driverSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

driverSchema.methods.generateAuthToken = async function () {
    user = this

    const token = jsw.sign({_id: user._id.toString()}, 'logisticsTokeIt')
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

driverSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

driverSchema.statics.findCredentials = async (email, password) => {
    const driver = await Driver.findOne({ email })

    if (!driver) {
        throw new Error({
            errror: 'invalid Credentials, please try again'
        })
    }

    const compare = await bcrypt.compare(password, driver.password)

    if (!compare) {
        throw new Error({
            errror: 'invalid Credentials, please try again'
        })
    }

    return driver
}

const Driver = mongoose.model('driver', driverSchema)

module.exports = Driver