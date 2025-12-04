const express=require('express')
const router=express.Router()
const{initPayment,verifyPay}=require('../controllers/paymentController')

router.post('/init',initPayment)
router.get('/verify/:reference',verifyPay)

module.exports=router
