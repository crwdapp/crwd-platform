import { Router } from 'express'
import { UserController } from '../controllers/userController'
import { auth } from '../middleware/auth'
import { validate } from '../middleware/validation'
import { CreateUserSchema, UpdateUserSchema, UpdateTokenSchema } from '../types'

const router = Router()
const userController = new UserController()

// Public routes
router.post('/', validate(CreateUserSchema), userController.createUser)

// Protected routes
router.get('/profile', auth, userController.getUserProfile)
router.put('/profile', auth, validate(UpdateUserSchema), userController.updateUser)
router.delete('/profile', auth, userController.deleteUser)
router.get('/tokens', auth, userController.getUserTokenBalance)
router.put('/tokens', auth, validate(UpdateTokenSchema), userController.updateUserTokens)

export default router
