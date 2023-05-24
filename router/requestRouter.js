const express = require('express')
const router = express.Router()
const Request = require('../models/requestModel')
const {auth, auth2, auth3} = require('../middleware/auth')

router.post('/upload/request', auth, async (req, res) => {
    try {
        const request = new Request({
            ...req.body,
            owner: req.user._id
        })

        await request.save()
        res.status(201).send(request)

    } catch (e) {
        res.status(501).send(e)
    }
})

router.get('/requests', async (req, res) => {
    try {
        const requests = await Request.find({})
        res.status(200).send(requests)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/myrequest', auth, async (req, res) => {
    try {
        const myRequest = await Request.find({
            owner: req.user._id
        })
        
        if (myRequest === [] || myRequest === {}) {
            res.send({
                noRequest: 'No request found'
            })
        }

        res.status(200).send(myRequest)
    } catch (e) {
        res.status(500).send(e)
    }
})


router.patch('/request/update/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const validUpdate = ['paymentStatus', 'pickUpStatus', 'deliveryStatus', 'weight', 'price', 'time', 'description',]

    const isValidOperation = updates.every((update) => {
        return validUpdate.includes(update)
    })

    if (!isValidOperation) {
        return res.status(501).send('invalid Operation')
    }

    try {
        const requestToUpdate = await Request.findOne({
            _id: req.params.id,
            owner: req.user_id
        })

        updates.forEach((update) => {
            requestToUpdate[update] = req.body[update]
        })

        await requestToUpdate.save()
        res.status(200).send(requestToUpdate)

    } catch (e) {
        res.status(500).send(e)
    }

})

router.delete('/request/delete/:id', auth, async (req, res) => {

    try {

        const requestToDelete = await Request.findOneAndDelete({
            _id: req.params.id, owner: req.user._id
        })

        if (!requestToDelete) {
            return res.status(500).send({
                noRequest: 'No request Found'
            })
        }

        await requestToDelete.remove()
        res.status(201).send({
            response: 'request deleted'
        })
    } catch (e) {
        res.status(501).send(e)
    }

})


module.exports = router