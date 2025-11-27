const express = require('express')
const connectDB = require('./config/db')
const userRoutes = require('./routes/authRoutes.js')
require('dotenv').config()


const app = express()


app.use(express.json())
app.use('/api/users', userRoutes)

connectDB()

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})