import { Request, Response } from 'express'
import { EventService } from '../services/eventService'
import { CreateEventSchema, UpdateEventSchema, EventQuerySchema } from '../types'
import { AuthRequest } from '../middleware/auth'

const eventService = new EventService()

export class EventController {
  async createEvent(req: Request, res: Response) {
    try {
      const event = await eventService.createEvent(req.body)

      res.status(201).json({ event })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }

  async getEvent(req: Request, res: Response) {
    try {
      const { id } = req.params
      const event = await eventService.getEventById(id)

      // Increment views
      await eventService.incrementEventViews(id)

      res.json({ event })
    } catch (error) {
      res.status(404).json({ error: (error as Error).message })
    }
  }

  async updateEvent(req: Request, res: Response) {
    try {
      const { id } = req.params
      const event = await eventService.updateEvent(id, req.body)

      res.json({ event })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }

  async deleteEvent(req: Request, res: Response) {
    try {
      const { id } = req.params
      await eventService.deleteEvent(id)

      res.json({ message: 'Event deleted successfully' })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }

  async getEvents(req: Request, res: Response) {
    try {
      const events = await eventService.getEvents(req.query as any)

      res.json({ events })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }

  async updateEventAttendance(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' })
      }

      const { id } = req.params
      const { status } = req.body

      const attendance = await eventService.updateEventAttendance(id, req.user.id, status)

      res.json({ attendance })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }

  async addEventBookmark(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' })
      }

      const { id } = req.params
      const bookmark = await eventService.addEventBookmark(id, req.user.id)

      res.json({ bookmark })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }

  async removeEventBookmark(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' })
      }

      const { id } = req.params
      await eventService.removeEventBookmark(id, req.user.id)

      res.json({ message: 'Bookmark removed successfully' })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }

  async addEventComment(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' })
      }

      const { id } = req.params
      const { content } = req.body

      const comment = await eventService.addEventComment(id, req.user.id, content)

      res.json({ comment })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }

  async addEventUpdate(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { title, content, type, isFromHost } = req.body

      const update = await eventService.addEventUpdate(id, title, content, type, isFromHost)

      res.json({ update })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }

  async shareEvent(req: Request, res: Response) {
    try {
      const { id } = req.params
      await eventService.incrementEventShares(id)

      res.json({ message: 'Event shared successfully' })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }
}
