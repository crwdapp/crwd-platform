import { Request, Response } from 'express'
import { UserService } from '../services/userService'
import { CreateUserSchema, UpdateUserSchema } from '../types'
import { AuthRequest } from '../middleware/auth'

const userService = new UserService()

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body)
      const token = userService.generateToken(user.id)

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          phone: user.phone
        },
        token
      })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }

  async getUserProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' })
      }

      const user = await userService.getUserById(req.user.id)
      const tokenBalance = await userService.getUserTokenBalance(req.user.id)

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          phone: user.phone,
          tokenBalance
        },
        reviews: user.reviews,
        attendances: user.attendances,
        bookmarks: user.bookmarks,
        visits: user.visits
      })
    } catch (error) {
      res.status(404).json({ error: (error as Error).message })
    }
  }

  async updateUser(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' })
      }

      const user = await userService.updateUser(req.user.id, req.body)

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          phone: user.phone
        }
      })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }

  async deleteUser(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' })
      }

      await userService.deleteUser(req.user.id)

      res.json({ message: 'User deleted successfully' })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }

  async getUserTokenBalance(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' })
      }

      const balance = await userService.getUserTokenBalance(req.user.id)

      res.json({ balance })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }

  async updateUserTokens(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' })
      }

      const token = await userService.updateUserTokens(req.user.id, req.body.amount)

      res.json({ token })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  }
}
