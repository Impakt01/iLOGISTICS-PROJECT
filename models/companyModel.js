const mongoose = require('mongoose')
const { default: isEmail } = require('validator/lib/isEmail')
const jsw = require('jsonwebtoken')
const bcrypt = require('bcryptjs')



const companySchema = mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        validatte(val) {
            const isEmail = validator.isEmail(val)
            if (!isEmail) {
                throw new Error('email invalid')
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
    cacNo: {
        type: String,
        required: true
    },
    vehicleRegNo: [{
        type: String,
        required: true
    }],
    businessVerification: {
        type: Boolean,
        default: false
    },
    tokens: [ {
        token: {
            type: String,
            required: true
        }
    }
    ]
})

companySchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

companySchema.methods.generateAuthToken = async function () {
    user = this

    const token = jsw.sign({_id: user._id.toString()}, 'logisticsTokeIt')
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

companySchema.statics.findCredentials = async (email, password) => {
    const company = await Company.findOne({ email })

    if (!company) {
        throw new Error({
            errror: 'invalid Credentials, please try again'
        })
    }

    const compare = await bcrypt.compare(password, company.password)

    if (!compare) {
        throw new Error({
            errror: 'invalid Credentials, please try again'
        })
    }

    return company
}

companySchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const Company = mongoose.model('company', companySchema)

module.exports = Company