const express = require('express')
const router = express.Router()
const Discount = require('../models/discountModel')
const {auth, auth2} = require('../middleware/auth')


router.post('/create/discount', auth2, async (req, res) => {
    const discount = new Discount({
        ...req.body,
        owner: req.user._id
    })
    try{
        await discount.save()
        res.status(201).send(discount)
    } catch(e) {
        res.status(501).send(e)
    }
})


router.get('/discounts', auth2, async (req, res) => {
    try{
        const discounts = await Discount.find({
            owner: req.user._id
        })

        if (discounts === [] || !discounts) {
            return res.status(200).send({
                Response: 'no discounts'
            })
        }

        res.status(200).send(discounts)

    }catch(e) {
        res.status(501).send(e)
    }
})

router.get('/discount/:id', auth2, async (req, res) => {
    try {
        const discount = await Discount.findOne({
            _id: req.params.id,
            owner: req.user._id
        })

        if (!discount) {
            return res.status(200).send({
                Response:'No discount found'
            })
        }

        res.status(200).send(discount)
    } catch (e) {
        res.status(501).send(e)
    }
})

router.patch('/discount/update/:id', auth2, async (req, res) => {
    const updates = Object.keys(req.body)
    const validUpdate = ['weightLimit', 'distance', 'location', 'price',  
    'description', 'discountPercentage', 'expirationDate',]

    const isValidOperation = updates.every((update) => {
        return validUpdate.includes(update)
    })

    if (!isValidOperation) {
        return res.status(501).send('invalid Operation')
    }

    try {
        const discountToUpdate = await Discount.findOne({
            _id: req.params.id,
            owner: req.user._id
        })

        updates.forEach((update) => {
            discountToUpdate[update] = req.body[update]
        })

        await discountToUpdate.save()
        res.status(200).send(discountToUpdate)

    } catch (e) {
        res.status(500).send(e)
    }

})

router.delete('/discount/delete/:id', auth2, async (req, res) => {
    try {
        const discountToUpdate = await Discount.findOne({
            _id: req.params.id,
            owner: req.user._id
        })

        await discountToUpdate.remove()
        res.status(200).send({
            response: 'deleted'
        })
    } catch (e) {
        res.status(500).send(e)
    }
})






router.get('/discounts/public', async (req, res) => {
    try {
        const publicDiscount = await Discount.find({})

        if (publicDiscount === [] || !publicDiscount) {
            return res.status(200).send({
                Response: 'no discounts'
            })
        }

        res.status(200).send(publicDiscount)

    } catch(e) {
        res.status(501).send(e)
    }
})

module.exports = router