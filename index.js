const express = require('express')
const connectDB = require('./config/db')
const userRoutes = require('./routes/authRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Updated CORS methods
app.use(cors({
  origin:'http://localhost:5173',
  methods:['GET','POST','PUT','DELETE','PATCH'] 
}))
app.use(express.json())
app.use(express.urlencoded({ extended:true }))

app.use('/api/users', userRoutes)
app.use('/api/payment', paymentRoutes)

app.get('/', (req,res) => {
  res.send('API is running...')
})

connectDB()

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const allowedOrigins = [
  'http://localhost:5173',
  'https://farmapp.vercel.app'
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))