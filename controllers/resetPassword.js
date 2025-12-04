const User = require('../models/User')
const Otp = require('../models/otpModel')
const bcrypt = require('bcrypt')

exports.resetPassword = async(req, res) => {
    try{
        res.json({ message: "Reset Password endpoint working" })
        const{ email, newPassword } = req.body

        const otpRecord = await Otp.findOne({ email })
        if(!otpRecord || !otpRecord.verified){
            return res.status(400).json({ message: 'OTP not verified'})
        }

        const hashed = await bcrypt.hash(newPassword, 10)
        await User.findOneAndUpdate({ email }, { password: hashed })

        await Otp.deleteMany({ email })

        return res.json({ message: 'Password reset successful' })
    } catch (err){
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}