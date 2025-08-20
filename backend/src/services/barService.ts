import { prisma } from '../utils/database'
import { CreateBarInput, UpdateBarInput, BarQueryInput } from '../types'

export class BarService {
  async createBar(data: CreateBarInput) {
    const bar = await prisma.bar.create({
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        lat: data.lat,
        lng: data.lng,
        phone: data.phone,
        priceRange: data.priceRange,
        images: data.images || [],
        tags: data.tags || [],
        type: data.type,
      }
    })

    return bar
  }

  async getBarById(id: string) {
    const bar = await prisma.bar.findUnique({
      where: { id },
      include: {
        hours: true,
        drinks: true,
        events: {
          where: {
            date: {
              gte: new Date()
            }
          },
          orderBy: {
            date: 'asc'
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!bar) {
      throw new Error('Bar not found')
    }

    return bar
  }

  async updateBar(id: string, data: UpdateBarInput) {
    const bar = await prisma.bar.update({
      where: { id },
      data
    })

    return bar
  }

  async deleteBar(id: string) {
    await prisma.bar.delete({
      where: { id }
    })
  }

  async getBars(query: BarQueryInput) {
    const { lat, lng, radius, tags, isOpen, priceRange, limit = 20, offset = 0 } = query

    const where: any = {}

    // Filter by tags
    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags
      }
    }

    // Filter by open status
    if (isOpen !== undefined) {
      where.isOpen = isOpen
    }

    // Filter by price range
    if (priceRange) {
      where.priceRange = priceRange
    }

    // Filter by location if coordinates provided
    if (lat && lng && radius) {
      // This is a simplified distance calculation
      // In production, you might want to use PostGIS or similar
      where.AND = [
        { lat: { gte: lat - radius * 0.01 } },
        { lat: { lte: lat + radius * 0.01 } },
        { lng: { gte: lng - radius * 0.01 } },
        { lng: { lte: lng + radius * 0.01 } }
      ]
    }

    const bars = await prisma.bar.findMany({
      where,
      include: {
        hours: true,
        events: {
          where: {
            date: {
              gte: new Date()
            }
          },
          take: 3,
          orderBy: {
            date: 'asc'
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      },
      take: limit,
      skip: offset,
      orderBy: {
        rating: 'desc'
      }
    })

    return bars
  }

  async updateBarHours(barId: string, hours: Array<{ day: string; open: string; close: string }>) {
    // Delete existing hours
    await prisma.barHours.deleteMany({
      where: { barId }
    })

    // Create new hours
    const barHours = await prisma.barHours.createMany({
      data: hours.map(hour => ({
        barId,
        day: hour.day,
        open: hour.open,
        close: hour.close
      }))
    })

    return barHours
  }

  async getBarAnalytics(barId: string) {
    const bar = await prisma.bar.findUnique({
      where: { id: barId },
      include: {
        _count: {
          select: {
            reviews: true,
            events: true,
            drinks: true,
            visits: true
          }
        },
        events: {
          where: {
            date: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30))
            }
          }
        }
      }
    })

    if (!bar) {
      throw new Error('Bar not found')
    }

    return {
      totalReviews: bar._count.reviews,
      totalEvents: bar._count.events,
      totalDrinks: bar._count.drinks,
      totalVisits: bar._count.visits,
      recentEvents: bar.events.length,
      drinksServedToday: bar.drinksServedToday,
      totalTokensRedeemed: bar.totalTokensRedeemed,
      lastUpdated: bar.lastUpdated
    }
  }

  // Bar Drinks Management
  async getBarDrinks(barId: string, query: any) {
    const { search, category, limit = 20, offset = 0 } = query

    const where: any = {
      barId
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      }
    }

    if (category) {
      where.category = category
    }

    const drinks = await prisma.drink.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: {
        name: 'asc'
      }
    })

    return drinks
  }

  async addDrinkToBar(barId: string, data: any) {
    const drink = await prisma.drink.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        isAvailable: data.isAvailable ?? true,
        barId
      }
    })

    return drink
  }

  async updateBarDrink(barId: string, drinkId: string, data: any) {
    const drink = await prisma.drink.update({
      where: {
        id: drinkId,
        barId // Ensure the drink belongs to the bar
      },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        isAvailable: data.isAvailable
      }
    })

    return drink
  }

  async deleteBarDrink(barId: string, drinkId: string) {
    await prisma.drink.delete({
      where: {
        id: drinkId,
        barId // Ensure the drink belongs to the bar
      }
    })
  }
}
