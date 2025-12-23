const User = require('../models/User')
const Otp = require('../models/otpModel') // New: Import Otp model
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto') // New: Import crypto for hashing

exports.forgotPassword = async(req, res) => {
    try {
        const { email } = req.body

        // 1. Check if email is provided
        if(!email){
            return res.status(400).json({ message:"Email is required" })
        }

        // 2. Check if user exists
        const user = await User.findOne({ email })
        if(!user){
            return res.status(404).json({ message:"User not found" })
        }

        // 3. Generate 6-digit OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString()

        // 4. Hash OTP and Save/Update OTP in DB
        const hashedOtp = crypto.createHash('sha256').update(code).digest('hex')
        
        await Otp.deleteMany({email}) // Clear any previous OTPs

        await Otp.create({
            email,
            otp: hashedOtp,
            expireAt: Date.now() + 10 * 60 * 1000 // valid for 10 minutes
        })

        // 5. Send OTP to email
        await sendEmail({
            to: user.email,
            subject: "Your Password Reset OTP",
            text: `Your OTP is: ${code}`
        })

        // 6. Response
        res.json({ message:"OTP sent successfully" })

    } catch (err) {
        res.status(500).json({
            message:"Server error",
            error: err.message
        })
    }
}