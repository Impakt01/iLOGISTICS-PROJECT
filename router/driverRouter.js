const Driver = require('../models/driverModel')
const Request = require('../models/requestModel')
const express = require('express')
const router = express.Router()
const {auth, auth2, auth3} = require('../middleware/auth')
const { findOne, findById } = require('../models/driverModel')


router.post('/register/driver', auth2, async (req, res) => {
    const driver = new Driver({
        ...req.body,
        password: "driver012345.",
        owner: req.user._id
    })

    try {
        await driver.save()
        const token = await driver.generateAuthToken()
        res.status(200).send(driver)
    } catch (e) {
        res.status(501).send(e)
    }
})

router.post('/driver/login', async (req, res) => {
    try {
        const driver = await Driver.findCredentials(req.body.email, req.body.password)
        const token = await driver.generateAuthToken()

        res.status(200).send({
            driver,
            token
        })
    } catch (e) {
        res.status(501).send(e)
    }
})

router.patch('/accept/request/:id', auth3, async (req, res) => {
    const id = req.params.id

    try {
        const checkStatus = await Request.findById(id)
        if (checkStatus.acceptStatus === true) {
            return res.status(400).send({
                response: 'request accepted already'
            })
        }

        const updatedRequest = await Request.findByIdAndUpdate(id, {
            acceptStatus: true,
            owner2: req.user._id
        }, {
            returnDocument: 'after'
        })

        if (updatedRequest === {} || !updatedRequest) {
           return res.status(501).send({
                response: 'no request found'
            })
        }
        res.status(200).send(updatedRequest)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/driver/update/delivery/:id', auth3, async (req, res) => {
    const _id = req.params.id
    const owner2 = req.user._id

    try {
        const updatedRequest = await Request.findOneAndUpdate({_id, owner2}, {
            deliveryStatusLogistic: true
        }, {
            returnDocument: 'after'
        })
        res.status(200).send(updatedRequest)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/driver/update/pickup/:id', auth3, async (req, res) => {
    const _id = req.params.id
    const owner2 = req.user._id

    try {
        const updatedRequest = await Request.findOneAndUpdate({_id, owner2}, {
            pickUpStatusLogistic: true
        }, {
            returnDocument: 'after'
        })
        res.status(200).send(updatedRequest)
    } catch (e) {
        res.status(500).send(e)
    }
})



router.patch('/driver/update/profile', auth3, async (req, res) => {

    const updates = Object.keys(req.body)
    const validUpdate = ['isActive', 'phoneNumber', 'email', 'password']

    const isValidOperation = updates.every((update) => {
        return validUpdate.includes(update)
    })

    if (!isValidOperation) {
        return res.status(501).send('invalid Operation')
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        const updatedDriver = await req.user.save()
        res.status(200).send(updatedDriver)

    } catch (e) {
        res.status(500).send(e)
    }

})



// company on driver

router.get('/drivers', auth2, async (req, res) => {
    try {
        const drivers = await Driver.find({
            owner: req.user._id
        })

        res.status(201).send(drivers)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/driver/:id', auth2, async (req, res) => {
    try {
        const driver = await Driver.findOne({
            _id: req.params.id,
            owner: req.user._id
        })

        res.status(201).send(driver)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/driver/update/profile/:id', auth2, async (req, res) => {

    const updates = Object.keys(req.body)
    const validUpdate = ['phoneNumber', 'email', 'driverName', 'vehicleRegNo', ]

    const isValidOperation = updates.every((update) => {
        return validUpdate.includes(update)
    })

    if (!isValidOperation) {
        return res.status(501).send('invalid Operation')
    }

    try {
        const driverToUpdate = await Driver.findOne({
            _id: req.params.id,
            owner: req.user._id
        })


        updates.forEach((update) => {
            driverToUpdate[update] = req.body[update]
        })

        const updatedDriver = await driverToUpdate.save()
        res.status(200).send(updatedDriver)

    } catch (e) {
        res.status(500).send(e)
    }

})

router.delete('/driver/delete/:id', auth2, async (req, res) => {
    try {
        const driverToDelete = await Driver.findOne({
            _id: req.params.id,
            owner: req.user._id
        })

        await driverToDelete.remove()
        res.status(200).send({
            response: 'driver deleted'
        })
    } catch(e) {
        res.status(500).send(e)
    }
})



module.exports = router