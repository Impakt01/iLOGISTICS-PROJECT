const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { findById } = require('../models/customerModel')
const Customer = require('../models/customerModel')
const Driver = require('../models/driverModel')
const Request = require('../models/requestModel')
const {auth, auth2} = require('../middleware/auth')


router.post('/signup', async (req, res) => {
    const customer = new Customer(req.body)

    try {
        await customer.save()
        const token = await customer.generateAuthToken()
        res.status(201).send({customer, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/login', async (req, res) => {
    try {
        const customer = await Customer.findCredentials(req.body.email, req.body.password)
        const token = await customer.generateAuthToken()
        res.status(200).send({customer, token})
    } catch(e) {
        res.status(400).send({
            error: 'error occured. Please try again'
        })
    }
})


router.get('/profile', auth, async (req, res) => {
   try {
    res.status(200).send(req.user)
   } catch (e) {
    res.status(404).send(e)
   }
})


router.patch('/profile/update', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['fName', 'lName', 'email', 'password', 'phoneNumber']
    const isValid = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValid) {
        return res.status(400).send({
            error: 'invalid operation'
        })
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        const customer = await req.user.save()
        res.status(201).send(customer)
    } catch(e) {
        res.status(400).send(e)
    }
})


router.post('/logout', auth, async (req, res) => {
    
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })

        await req.user.save()
        res.send('act logged out.')
    } catch(e) {
        res.status(501).send(e)
    }
})


router.post('/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('user logged out')
    } catch (e) {
        res.status(501).send(e)
    }
})

router.delete('/profile/delete', auth, async (req, res) => {
    try {
        req.user.remove()
        res.status(200).send()
    } catch(e) {
        res.status(501).send(e)
    }
})

router.post('/accept/discount/:id', auth, async (req, res) => {
    try {
        const availableDriver = await Driver.find({
            owner: req.params.id,
            isActive: true
        })

        if (!availableDriver || availableDriver === []) {
            return res.status(404).send({
                response: 'no driver available'
            })
        }

        const random = Math.floor(Math.random() * availableDriver.length)
        const choosenDriver = availableDriver[random]

        const requestObject = {
            ...req.body,
            owner: req.user._id,
            owner2: choosenDriver._id
        }

        const request = new Request(requestObject)

        await request.save()
        res.status(201).send(request)
    } catch (e) {
        res.status(501).send(e)
    }
})




module.exports = router