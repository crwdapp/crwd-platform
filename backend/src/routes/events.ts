import { Router } from 'express'
import { EventController } from '../controllers/eventController'
import { auth } from '../middleware/auth'
import { validate, validateQuery } from '../middleware/validation'
import { CreateEventSchema, UpdateEventSchema, EventQuerySchema, CreateEventAttendanceSchema, CreateEventCommentSchema } from '../types'

const router = Router()
const eventController = new EventController()

// Public routes
router.get('/', validateQuery(EventQuerySchema), eventController.getEvents)
router.get('/:id', eventController.getEvent)
router.post('/:id/share', eventController.shareEvent)

// Protected routes
router.post('/', auth, validate(CreateEventSchema), eventController.createEvent)
router.put('/:id', auth, validate(UpdateEventSchema), eventController.updateEvent)
router.delete('/:id', auth, eventController.deleteEvent)

// Event interactions
router.post('/:id/attendance', auth, validate(CreateEventAttendanceSchema), eventController.updateEventAttendance)
router.post('/:id/bookmark', auth, eventController.addEventBookmark)
router.delete('/:id/bookmark', auth, eventController.removeEventBookmark)
router.post('/:id/comments', auth, validate(CreateEventCommentSchema), eventController.addEventComment)
router.post('/:id/updates', auth, eventController.addEventUpdate)

export default router
