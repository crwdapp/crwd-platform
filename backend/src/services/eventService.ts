import { prisma } from '../utils/database'
import { CreateEventInput, UpdateEventInput, EventQueryInput } from '../types'

export class EventService {
  async createEvent(data: CreateEventInput) {
    const event = await prisma.event.create({
      data: {
        name: data.name,
        description: data.description,
        date: new Date(data.date),
        startTime: data.startTime,
        endTime: data.endTime,
        dj: data.dj,
        genre: data.genre,
        price: data.price,
        ticketPrice: data.ticketPrice,
        image: data.image,
        images: data.images || [],
        category: data.category,
        tags: data.tags || [],
        capacity: data.capacity,
        isTicketed: data.isTicketed || false,
        ticketUrl: data.ticketUrl,
        ageRestriction: data.ageRestriction,
        dressCode: data.dressCode,
        isPublic: data.isPublic || true,
        canGuestsInviteFriends: data.canGuestsInviteFriends || true,
        hostMessage: data.hostMessage,
        discussionEnabled: data.discussionEnabled || true,
        photosEnabled: data.photosEnabled || true,
        createdBy: data.createdBy,
        coHosts: data.coHosts || [],
        barId: data.barId,
      }
    })

    return event
  }

  async getEventById(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        bar: {
          select: {
            id: true,
            name: true,
            address: true,
            lat: true,
            lng: true
          }
        },
        attendances: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        },
        comments: {
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
        },
        updates: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        eventDrinks: {
          include: {
            drink: true
          }
        }
      }
    })

    if (!event) {
      throw new Error('Event not found')
    }

    return event
  }

  async updateEvent(id: string, data: UpdateEventInput) {
    const event = await prisma.event.update({
      where: { id },
      data: {
        ...data,
        ...(data.date && { date: new Date(data.date) })
      }
    })

    return event
  }

  async deleteEvent(id: string) {
    await prisma.event.delete({
      where: { id }
    })
  }

  async getEvents(query: EventQueryInput) {
    const { category, date, barId, isTicketed, status, limit = 20, offset = 0 } = query

    const where: any = {}

    if (category) {
      where.category = category
    }

    if (date) {
      where.date = new Date(date)
    }

    if (barId) {
      where.barId = barId
    }

    if (isTicketed !== undefined) {
      where.isTicketed = isTicketed
    }

    if (status) {
      where.status = status
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        bar: {
          select: {
            id: true,
            name: true,
            address: true,
            lat: true,
            lng: true
          }
        },
        _count: {
          select: {
            attendances: true,
            comments: true,
            bookmarks: true
          }
        }
      },
      take: limit,
      skip: offset,
      orderBy: {
        date: 'asc'
      }
    })

    return events
  }

  async updateEventAttendance(eventId: string, userId: string, status: 'GOING' | 'INTERESTED' | 'NOT_GOING') {
    const attendance = await prisma.eventAttendance.upsert({
      where: {
        userId_eventId: {
          userId,
          eventId
        }
      },
      update: {
        status
      },
      create: {
        userId,
        eventId,
        status
      }
    })

    // Update event counts
    await this.updateEventCounts(eventId)

    return attendance
  }

  async addEventBookmark(eventId: string, userId: string) {
    const bookmark = await prisma.eventBookmark.create({
      data: {
        eventId,
        userId
      }
    })

    return bookmark
  }

  async removeEventBookmark(eventId: string, userId: string) {
    await prisma.eventBookmark.delete({
      where: {
        userId_eventId: {
          userId,
          eventId
        }
      }
    })
  }

  async addEventComment(eventId: string, userId: string, content: string) {
    const comment = await prisma.eventComment.create({
      data: {
        eventId,
        userId,
        content
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    return comment
  }

  async addEventUpdate(eventId: string, title: string, content: string, type: 'ANNOUNCEMENT' | 'REMINDER' | 'CHANGE' | 'CANCELLATION', isFromHost: boolean = false) {
    const update = await prisma.eventUpdate.create({
      data: {
        eventId,
        title,
        content,
        type,
        isFromHost
      }
    })

    return update
  }

  private async updateEventCounts(eventId: string) {
    const attendances = await prisma.eventAttendance.findMany({
      where: { eventId }
    })

    const goingCount = attendances.filter(a => a.status === 'GOING').length
    const interestedCount = attendances.filter(a => a.status === 'INTERESTED').length

    await prisma.event.update({
      where: { id: eventId },
      data: {
        goingCount,
        interestedCount,
        attendees: goingCount
      }
    })
  }

  async incrementEventViews(eventId: string) {
    await prisma.event.update({
      where: { id: eventId },
      data: {
        views: {
          increment: 1
        }
      }
    })
  }

  async incrementEventShares(eventId: string) {
    await prisma.event.update({
      where: { id: eventId },
      data: {
        shares: {
          increment: 1
        }
      }
    })
  }
}
