import { Request, Response } from 'express'
import { BarService } from '../services/barService'
import { CreateBarSchema, UpdateBarSchema, BarQuerySchema } from '../types'
import { AuthRequest } from '../middleware/auth'

const barService = new BarService()

export class BarController {
  async createBar(req: Request, res: Response) {
    try {
      const bar = await barService.createBar(req.body)

      res.status(201).json({ bar })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }

  async getBar(req: Request, res: Response) {
    try {
      const { id } = req.params
      const bar = await barService.getBarById(id)

      res.json({ bar })
    } catch (error) {
      res.status(404).json({ error: (error as Error).message })
    }
  }

  async updateBar(req: Request, res: Response) {
    try {
      const { id } = req.params
      const bar = await barService.updateBar(id, req.body)

      res.json({ bar })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }

  async deleteBar(req: Request, res: Response) {
    try {
      const { id } = req.params
      await barService.deleteBar(id)

      res.json({ message: 'Bar deleted successfully' })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }

  async getBars(req: Request, res: Response) {
    try {
      const bars = await barService.getBars(req.query as any)

      res.json({ bars })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }

  async updateBarHours(req: Request, res: Response) {
    try {
      const { id } = req.params
      const barHours = await barService.updateBarHours(id, req.body.hours)

      res.json({ barHours })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }

  async getBarAnalytics(req: Request, res: Response) {
    try {
      const { id } = req.params
      const analytics = await barService.getBarAnalytics(id)

      res.json({ analytics })
    } catch (error) {
      res.status(404).json({ error: (error as Error).message })
    }
  }

  async addBarVisit(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' })
      }

      const { barId } = req.params
      const visit = await barService.addBarVisit(barId, req.user.id)

      res.json({ visit })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }

  // Bar Drinks Management
  async getBarDrinks(req: Request, res: Response) {
    try {
      const { barId } = req.params
      const drinks = await barService.getBarDrinks(barId, req.query as any)

      res.json({ drinks })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }

  async addDrinkToBar(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' })
      }

      const { barId } = req.params
      const drink = await barService.addDrinkToBar(barId, req.body)

      res.status(201).json({ drink })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }

  async updateBarDrink(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' })
      }

      const { barId, drinkId } = req.params
      const drink = await barService.updateBarDrink(barId, drinkId, req.body)

      res.json({ drink })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }

  async deleteBarDrink(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' })
      }

      const { barId, drinkId } = req.params
      await barService.deleteBarDrink(barId, drinkId)

      res.json({ message: 'Drink deleted successfully' })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }
}
