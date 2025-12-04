const crypto=require('crypto')
const Otp=require('../models/otpModel')

exports.verifyOtp=async(req,res)=>{
 try{
  const{email,otp}=req.body

  const hashedOtp=crypto.createHash('sha256').update(otp).digest('hex')

  const existing=await Otp.findOne({email,otp:hashedOtp})
  if(!existing)return res.status(400).json({message:'Invalid OTP'})

  if(existing.expiresAt<Date.now()){
   return res.status(400).json({message:'OTP expired'})
  }

  existing.verified=true
  await existing.save()

  return res.json({message:'OTP verified'})
 }catch(err){
  return res.status(500).json({message:'Server error', error: err.message})
 }
}
