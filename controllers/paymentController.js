const Transaction=require('../models/transactionModel')
const{initializePayment,verifyPayment}=require('../utils/paystack')

exports.initPayment=async(req,res)=>{
 try{
  const{email,amount}=req.body

  const data={email,amount:amount*100} // convert to kobo

  const paystackRes=await initializePayment(data)
  if(paystackRes.error)return res.status(400).json(paystackRes.error)

  await Transaction.create({
   email,
   amount,
   reference:paystackRes.data.reference
  })

  return res.json({authorization_url:paystackRes.data.authorization_url})
 }catch(err){
  return res.status(500).json({message:'Server error',error:err.message})
 }
}

exports.verifyPay=async(req,res)=>{
 try{
  const{reference}=req.params

  const paystackRes=await verifyPayment(reference)
  if(paystackRes.error)return res.status(400).json(paystackRes.error)

  const status=paystackRes.data.status

  const trx=await Transaction.findOne({reference})
  if(!trx)return res.status(404).json({message:'Transaction not found'})

  trx.status=status
  await trx.save()

  return res.json({message:'Payment verified',status})
 }catch(err){
  return res.status(500).json({message:'Server error',error:err.message})
 }
}
