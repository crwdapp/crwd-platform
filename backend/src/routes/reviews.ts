import { Router } from 'express'
import { ReviewController } from '../controllers/reviewController'
import { auth } from '../middleware/auth'
import { validate, validateQuery } from '../middleware/validation'
import { CreateReviewSchema, UpdateReviewSchema, ReviewQuerySchema } from '../types'

const router = Router()
const reviewController = new ReviewController()

// Public routes
router.get('/', validateQuery(ReviewQuerySchema), reviewController.getReviews)
router.get('/:id', reviewController.getReview)

// Protected routes
router.post('/', auth, validate(CreateReviewSchema), reviewController.createReview)
router.put('/:id', auth, validate(UpdateReviewSchema), reviewController.updateReview)
router.delete('/:id', auth, reviewController.deleteReview)

export default router

