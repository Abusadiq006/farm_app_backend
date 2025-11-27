const User = require('../models/User')
const Otp = require('../models/otpModel')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

exports.forgotpassword = async (req, res) => {
    try{
        const{email} = req.body

        const user = await User.findOne({ email })
        if(!user) return res.status(404).json({ message: 'Email not found '})

            const code = Math.floor( 100000 + Math.random() * 900000 ).toString()

            const hashedOtp = crypto.createHash('sha256').update(code).digest('hex')

            await Otp.deleteMany({email})

            await Otp.create({
                email,
                otp: hashedOtp,
                expireAt: Data.now() + 5 * 60 * 1000
            })

            await sendEmail ({
                to: email,
                subject: 'Your OTP Code',
                text: `Your password reset OTP is: ${code}`
            })

            return res.json({ message: 'OTP sent successfully' })
    } catch(err) {
        return res.status(500).json({ message: 'Server error'})
    }
}