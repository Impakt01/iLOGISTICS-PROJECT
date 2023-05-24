const jwt = require('jsonwebtoken')
const Customer = require('../models/customerModel')
const Company = require('../models/companyModel')
const Driver = require('../models/driverModel')

const auth = async (req, res, next) => {

    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, 'logisticsTokeIt')

        const user = await Customer.findOne({id: decode._id, 'tokens.token': token})

        if (!user) {
            throw new Error('authentication error')
        }

        req.user = user
        req.token = token
        next()
    } catch (e) {
        res.status(400).send({
            error: 'Authentication error'
        })
    }
    

}

const auth2 = async (req, res, next) => {

    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, 'logisticsTokeIt')

        const user = await Company.findOne({id: decode._id, 'tokens.token': token})

        if (!user) {
            throw new Error('authentication error')
        }

        req.user = user
        req.token = token
        next()
    } catch (e) {
        res.status(400).send({
            error: 'Authentication error'
        })
    }
}

const auth3 = async (req, res, next) => {

    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, 'logisticsTokeIt')
        

        const user = await Driver.findOne({id: decode._id, 'tokens.token': token})

        if (!user) {
            throw new Error('authentication error')
        }

        req.user = user
        req.token = token
        next()
    } catch (e) {
        res.status(400).send({
            error: 'Authentication error'
        })
    }
}


module.exports = {auth, auth2, auth3}