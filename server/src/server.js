import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import memoryRoutes from './routes/memoryRoutes.js'
import recapRoutes from './routes/recapRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/memories', memoryRoutes)
app.use('/api/recap', recapRoutes)

// Error handler
app.use(errorHandler)

// Connect DB and start server
const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})
