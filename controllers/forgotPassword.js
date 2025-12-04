const User = require('../models/User')
const sendEmail = require('../utils/sendEmail')

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
        const otp = Math.floor(100000 + Math.random() * 900000)

        // 4. Save OTP + expiry in DB
        user.resetOtp = otp
        user.resetOtpExpire = Date.now() + 10 * 60 * 1000 // valid for 10 minutes
        await user.save()

        // 5. Send OTP to email
        await sendEmail({
            to: user.email,
            subject: "Your Password Reset OTP",
            text: `Your OTP is: ${otp}`
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
