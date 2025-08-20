import { Router } from 'express'
import { AnalyticsController } from '../controllers/analyticsController'
import { auth } from '../middleware/auth'
import { validateQuery } from '../middleware/validation'
import { AnalyticsQuerySchema } from '../types'

const router = Router()
const analyticsController = new AnalyticsController()

// Protected routes
router.get('/', auth, validateQuery(AnalyticsQuerySchema), analyticsController.getAnalytics)
router.get('/bars/:id', auth, analyticsController.getBarAnalytics)
router.get('/events', auth, analyticsController.getEventAnalytics)
router.get('/users', auth, analyticsController.getUserAnalytics)

export default router

