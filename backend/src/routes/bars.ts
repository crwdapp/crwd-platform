import { Router } from 'express'
import { BarController } from '../controllers/barController'
import { auth, optionalAuth } from '../middleware/auth'
import { validate, validateQuery } from '../middleware/validation'
import { CreateBarSchema, UpdateBarSchema, BarQuerySchema } from '../types'

const router = Router()
const barController = new BarController()

// Public routes
router.get('/', validateQuery(BarQuerySchema), barController.getBars)
router.get('/:id', barController.getBar)
router.get('/:id/analytics', barController.getBarAnalytics)

// Protected routes
router.post('/', auth, validate(CreateBarSchema), barController.createBar)
router.put('/:id', auth, validate(UpdateBarSchema), barController.updateBar)
router.delete('/:id', auth, barController.deleteBar)
router.put('/:id/hours', auth, barController.updateBarHours)
router.post('/:barId/visit', auth, barController.addBarVisit)

// Bar Drinks Management
router.get('/:barId/drinks', barController.getBarDrinks)
router.post('/:barId/drinks', auth, barController.addDrinkToBar)
router.put('/:barId/drinks/:drinkId', auth, barController.updateBarDrink)
router.delete('/:barId/drinks/:drinkId', auth, barController.deleteBarDrink)

export default router
