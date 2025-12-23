const express = require('express')
const router = express.Router()
const paymentController = require('../controllers/paymentController')

router.post('/init', paymentController.initPayment)
router.get('/verify/:reference', paymentController.verifyPay)

module.exports = router