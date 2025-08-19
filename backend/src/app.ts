import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import { errorHandler, notFound } from './middleware/errorHandler'
import userRoutes from './routes/users'
import barRoutes from './routes/bars'
import eventRoutes from './routes/events'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Security middleware
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use(limiter)

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8081'],
  credentials: true
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// API Info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'CRWD Bolt API',
    version: '1.0.0',
    description: 'Backend API for CRWD Bolt application',
    endpoints: {
      health: '/health',
      users: '/api/users',
      bars: '/api/bars',
      events: '/api/events',
      drinks: '/api/drinks',
      reviews: '/api/reviews'
    },
    documentation: 'API documentation coming soon...'
  })
})

// API routes
app.use('/api/users', userRoutes)
app.use('/api/bars', barRoutes)
app.use('/api/events', eventRoutes)

// 404 handler
app.use(notFound)

// Error handler
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
})

export default app
