import { prisma } from '../utils/database'
import { CreateUserInput, UpdateUserInput } from '../types'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export class UserService {
  async createUser(data: CreateUserInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      throw new Error('User already exists with this email')
    }

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        avatar: data.avatar,
        phone: data.phone,
      }
    })

    return user
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        tokens: true,
        reviews: {
          include: {
            bar: true
          }
        },
        attendances: {
          include: {
            event: {
              include: {
                bar: true
              }
            }
          }
        },
        bookmarks: {
          include: {
            event: {
              include: {
                bar: true
              }
            }
          }
        },
        visits: {
          include: {
            bar: true
          }
        }
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    return user
  }

  async updateUser(id: string, data: UpdateUserInput) {
    const user = await prisma.user.update({
      where: { id },
      data
    })

    return user
  }

  async deleteUser(id: string) {
    await prisma.user.delete({
      where: { id }
    })
  }

  async getUserTokenBalance(userId: string) {
    const token = await prisma.token.findUnique({
      where: { userId }
    })

    return token?.amount || 0
  }

  async updateUserTokens(userId: string, amount: number) {
    const token = await prisma.token.upsert({
      where: { userId },
      update: { amount },
      create: { userId, amount }
    })

    return token
  }

  generateToken(userId: string): string {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
      expiresIn: '7d'
    })
  }
}
