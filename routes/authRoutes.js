const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const { loginUser } = require('../controllers/authController')
const auth = require('../middleware/authMiddleware')
const role = require('../middleware/roleMiddleware')

const router = express.Router()

// PROTECTED ROUTES

// Admin-only route (role-based access)
router.get('/admin-only', auth, role(['owner','admin']), (req,res)=>{
  res.json({
    message:'Admin route accessed',
    user:req.user
  })
})

// Profile route (any authenticated user)
router.get('/profile', auth, (req,res)=>{
  res.json({
    message:'Protected route accessed',
    user:req.user
  })
})

// REGISTER
router.post('/register', async(req,res)=>{
  try{
    const { name,email,password,role } = req.body

    const exist = await User.findOne({ email })
    if(exist){
      return res.status(400).json({ message:'Email already in use' })
    }

    console.log("REQ BODY:", req.body)
    console.log("PASSWORD RECEIVED:", password)

    const hashed = await bcrypt.hash(password,10)
    const newUser = new User({ name,email,password:hashed,role })
    await newUser.save()

    res.status(201).json({
      message:'User registered successfully',
      user:newUser
    })

  }catch(err){
    res.status(500).json({ message:'Server error', error:err.message })
  }
})

// LOGIN
router.post('/login', loginUser)

module.exports = router
