const express = require('express')
const connectDB = require('./config/db')
const userRoutes = require('./routes/authRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const cors = require('cors')
require('dotenv').config()

const mongoose = require('mongoose')
const app = express()

mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log("Connected to MongoDB Atlas!"))
.catch(err => console.error("Cloud DB Connection Error:", err))

// Updated CORS methods
app.use(cors({
  origin:'https://farm-app-backend-eh3r.onrender.com/',
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
  'https://farm-app-iota-livid.vercel.app'
]

app.use(cors({
  origin: function (origin, callback) {
   if (!origin) return callback(null, true)
   if (allowedOrigins.indexOf(origin) === -1) {
     const msg = 'The CORS policy for this site does not allow access from the specified Origin.'
     return callback(new Error(msg), false)
   }
   return callback(null, true)
  },
  credentials: true
}))