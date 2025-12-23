const User = require('../models/User')
const Otp = require('../models/otpModel')
const bcrypt = require('bcrypt')

exports.resetPassword = async(req, res) => {
    try{
        // FIX 1: Removed the premature res.json() which stopped function execution

        const{ email, newPassword } = req.body
        
        // Find the verified OTP record
        const otpRecord = await Otp.findOne({ email })
        
        // FIX 2: Added a check for expiration time
        if(!otpRecord || !otpRecord.verified || otpRecord.expiresAt < Date.now()){
             // Delete expired/invalid record to prevent misuse
            await Otp.deleteMany({ email }) 
            return res.status(400).json({ message: 'Invalid or expired verification attempt'})
        }

        // Hash and update the user's password
        const hashed = await bcrypt.hash(newPassword, 10)
        
        // Find the user and update their password
        const updatedUser = await User.findOneAndUpdate(
            { email }, 
            { password: hashed },
            { new: true } // Return the updated document
        )

        // Ensure user was actually found and updated
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Delete the OTP record as the reset is complete
        await Otp.deleteMany({ email })

        return res.json({ message: 'Password reset successful' })
    } catch (err){
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}