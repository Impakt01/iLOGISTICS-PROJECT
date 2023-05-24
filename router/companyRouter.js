const express = require('express')
const router = express.Router()
const Company = require('../models/companyModel')
const {auth, auth2} = require('../middleware/auth')


router.post('/register/company', async (req, res) => {
    const company = new Company(req.body)
    try {
        await company.save()
        const token = await company.generateAuthToken()
        res.status(201).send({company, token})
    } catch(e) {
        res.status(501).send(e)
    }
})

router.post('/company/login', async (req, res) => {
    try {
        const company = await Company.findCredentials(req.body.email, req.body.password)
        const token = await company.generateAuthToken()
        res.status(201).send({
            company,
            token
        })
    } catch(e) {
        res.status(501).send(e)
    }
})

router.get('/company/profile', auth2, async (req, res) => {
    try {
        res.status(200).send(req.user)
    } catch (e) {
        res.status(501).send(e)
    }
})

router.patch('/company/profile/update/:id', auth2, async (req, res) => {

    const updates = Object.keys(req.body)
    const validUpdate = ['companyName', 'cacNo', 'vehicleReg', 
    'businessVerification', 'email', 'password', 'phoneNumber']

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

        const update = await req.user.save()
        res.status(200).send(update)

    } catch (e) {
        res.status(500).send(e)
    }

})


router.post('/company/profile/logout', auth2, async (req, res) => {
    try {
         req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
         })

         await req.user.save()
         res.status(200).send(req.user)
    } catch(e) {
        res.status(501).send(e)
    }
})

router.post('/company/profile/logoutAll', auth2, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send(req.user)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.delete('/company/profile/delete', auth2, async (req, res) => {
    try {
        await req.user.remove()
        res.status(200).send({
            response: 'User deleted'
        })
    } catch (e) {
        res.status(501).send(e)
    }
})

module.exports = router