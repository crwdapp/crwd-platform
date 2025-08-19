import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe',
      avatar: 'https://via.placeholder.com/150',
      phone: '+1234567890'
    }
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      avatar: 'https://via.placeholder.com/150',
      phone: '+0987654321'
    }
  })

  // Create sample bars
  const bar1 = await prisma.bar.create({
    data: {
      name: 'The Blue Moon',
      description: 'A trendy cocktail bar with live music',
      address: '123 Main St, Downtown',
      lat: 40.7128,
      lng: -74.0060,
      phone: '+1234567890',
      priceRange: '$$',
      rating: 4.5,
      reviewCount: 150,
      isOpen: true,
      crowdLevel: 'Medium',
      openUntil: '02:00',
      images: [
        'https://via.placeholder.com/400x300',
        'https://via.placeholder.com/400x300'
      ],
      tags: ['cocktails', 'live-music', 'downtown'],
      type: 'Cocktail Bar',
      availableDrinks: 45,
      drinksServedToday: 120,
      totalTokensRedeemed: 850
    }
  })

  const bar2 = await prisma.bar.create({
    data: {
      name: 'The Rustic Pub',
      description: 'Cozy pub with craft beers and comfort food',
      address: '456 Oak Ave, Midtown',
      lat: 40.7589,
      lng: -73.9851,
      phone: '+1234567891',
      priceRange: '$',
      rating: 4.2,
      reviewCount: 89,
      isOpen: true,
      crowdLevel: 'Low',
      openUntil: '01:00',
      images: [
        'https://via.placeholder.com/400x300'
      ],
      tags: ['craft-beer', 'pub-food', 'cozy'],
      type: 'Pub',
      availableDrinks: 30,
      drinksServedToday: 85,
      totalTokensRedeemed: 420
    }
  })

  // Create bar hours
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  
  for (const day of days) {
    await prisma.barHours.create({
      data: {
        barId: bar1.id,
        day,
        open: '17:00',
        close: '02:00'
      }
    })

    await prisma.barHours.create({
      data: {
        barId: bar2.id,
        day,
        open: '16:00',
        close: '01:00'
      }
    })
  }

  // Create sample drinks
  const drink1 = await prisma.drink.create({
    data: {
      name: 'Blue Moon Martini',
      description: 'A refreshing blue cocktail with vodka and blue curacao',
      category: 'Cocktail',
      image: 'https://via.placeholder.com/200x200',
      alcoholContent: '15%',
      volume: '200ml',
      originalPrice: '$12.00',
      tokenCost: 3,
      isAvailable: true,
      barId: bar1.id
    }
  })

  const drink2 = await prisma.drink.create({
    data: {
      name: 'Craft IPA',
      description: 'Local craft beer with hoppy flavor',
      category: 'Beer',
      image: 'https://via.placeholder.com/200x200',
      alcoholContent: '6.5%',
      volume: '330ml',
      originalPrice: '$8.00',
      tokenCost: 2,
      isAvailable: true,
      barId: bar2.id
    }
  })

  // Create sample events
  const event1 = await prisma.event.create({
    data: {
      name: 'Live Jazz Night',
      description: 'Enjoy smooth jazz with local musicians',
      date: new Date('2024-02-15'),
      startTime: '20:00',
      endTime: '23:00',
      dj: 'The Jazz Trio',
      genre: 'Jazz',
      price: 15,
      ticketPrice: 15,
      image: 'https://via.placeholder.com/400x300',
      images: [
        'https://via.placeholder.com/400x300',
        'https://via.placeholder.com/400x300'
      ],
      category: 'LIVE_SHOW',
      tags: ['jazz', 'live-music', 'sophisticated'],
      capacity: 100,
      attendees: 45,
      interestedCount: 23,
      goingCount: 45,
      isTicketed: true,
      ticketUrl: 'https://tickets.example.com/jazz-night',
      ageRestriction: '21+',
      dressCode: 'Smart Casual',
      isPublic: true,
      canGuestsInviteFriends: true,
      hostMessage: 'Join us for an unforgettable evening of jazz!',
      discussionEnabled: true,
      photosEnabled: true,
      views: 156,
      shares: 12,
      createdBy: user1.id,
      coHosts: [user2.id],
      barId: bar1.id
    }
  })

  const event2 = await prisma.event.create({
    data: {
      name: 'Trivia Night',
      description: 'Test your knowledge and win prizes!',
      date: new Date('2024-02-20'),
      startTime: '19:00',
      endTime: '21:00',
      genre: 'Entertainment',
      price: 0,
      image: 'https://via.placeholder.com/400x300',
      images: [
        'https://via.placeholder.com/400x300'
      ],
      category: 'TRIVIA',
      tags: ['trivia', 'fun', 'prizes'],
      capacity: 50,
      attendees: 28,
      interestedCount: 15,
      goingCount: 28,
      isTicketed: false,
      ageRestriction: '18+',
      isPublic: true,
      canGuestsInviteFriends: true,
      hostMessage: 'Come test your knowledge and have fun!',
      discussionEnabled: true,
      photosEnabled: false,
      views: 89,
      shares: 5,
      createdBy: user2.id,
      coHosts: [],
      barId: bar2.id
    }
  })

  // Create event drinks
  await prisma.eventDrink.create({
    data: {
      eventId: event1.id,
      drinkId: drink1.id,
      tokenCost: 2,
      totalQuantity: 50,
      maxTokensPerUser: 3,
      remainingQuantity: 50,
      specialOffer: 'Happy Hour Special'
    }
  })

  await prisma.eventDrink.create({
    data: {
      eventId: event2.id,
      drinkId: drink2.id,
      tokenCost: 1,
      totalQuantity: 100,
      maxTokensPerUser: 5,
      remainingQuantity: 100,
      specialOffer: 'Trivia Night Discount'
    }
  })

  // Create sample reviews
  await prisma.review.create({
    data: {
      userId: user1.id,
      barId: bar1.id,
      rating: 5,
      comment: 'Amazing cocktails and great atmosphere!'
    }
  })

  await prisma.review.create({
    data: {
      userId: user2.id,
      barId: bar2.id,
      rating: 4,
      comment: 'Cozy place with good beer selection.'
    }
  })

  // Create user tokens
  await prisma.token.create({
    data: {
      userId: user1.id,
      amount: 25
    }
  })

  await prisma.token.create({
    data: {
      userId: user2.id,
      amount: 15
    }
  })

  // Create event attendances
  await prisma.eventAttendance.create({
    data: {
      userId: user1.id,
      eventId: event1.id,
      status: 'GOING'
    }
  })

  await prisma.eventAttendance.create({
    data: {
      userId: user2.id,
      eventId: event2.id,
      status: 'INTERESTED'
    }
  })

  // Create event bookmarks
  await prisma.eventBookmark.create({
    data: {
      userId: user1.id,
      eventId: event2.id
    }
  })

  // Create event comments
  await prisma.eventComment.create({
    data: {
      userId: user1.id,
      eventId: event1.id,
      content: 'Can\'t wait for this jazz night!'
    }
  })

  await prisma.eventComment.create({
    data: {
      userId: user2.id,
      eventId: event1.id,
      content: 'Will there be food available?'
    }
  })

  // Create event updates
  await prisma.eventUpdate.create({
    data: {
      eventId: event1.id,
      title: 'Special Guest Added',
      content: 'We\'re excited to announce that Sarah Johnson will be joining us on saxophone!',
      type: 'ANNOUNCEMENT',
      isFromHost: true
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log(`👥 Created ${2} users`)
  console.log(`🍺 Created ${2} bars`)
  console.log(`🍹 Created ${2} drinks`)
  console.log(`🎉 Created ${2} events`)
  console.log(`⭐ Created ${2} reviews`)
  console.log(`💬 Created ${2} comments`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
