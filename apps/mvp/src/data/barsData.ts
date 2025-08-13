// Simplified bar data with 5 bars in Bucharest and 5 bars in Constanta
export interface Bar {
  id: number;
  name: string;
  type: string;
  rating: number;
  reviews: number;
  lat: number;
  lng: number;
  image: string;
  location: string;
  availableDrinks: number;
  isOpen: boolean;
  tags: string[];
  openUntil: string;
  crowdLevel: string;
  filters: string[];
  distance?: string;
  distanceKm?: number;
  // Additional detailed information
  description: string;
  address: string;
  phone: string;
  priceRange: string;
  images: string[];
  hours: Record<string, string>;
  events: Array<{
    id: number;
    name: string;
    date: string;
    dj: string;
    image?: string;
  }>;
  availableDrinksMenu: Array<{
    id: number;
    name: string;
    description: string;
    category: string;
    image?: string;
    alcoholContent?: string;
    volume?: string;
    originalPrice?: string;
  }>;
}

export const allBars: Bar[] = [
  // Bucharest bars (5)
  {
    id: 1,
    name: 'Control Club',
    type: 'Electronic Music Club',
    rating: 4.8,
    reviews: 324,
    lat: 44.4378,
    lng: 26.0969,
    image: 'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'BUCHAREST',
    availableDrinks: 47,
    isOpen: true,
    tags: ['Electronic', 'Dancing', 'Late Night'],
    openUntil: '3:00 AM',
    crowdLevel: 'High',
    filters: ['live-music', 'late-night', 'groups', 'dancing'],
    description: 'Bucharest\'s premier underground electronic music venue featuring world-class DJs, state-of-the-art sound system, and an unforgettable atmosphere.',
    address: 'Strada Blanari 14, Bucharest 030167, Romania',
    phone: '+40 21 314 0158',
    priceRange: '$$$',
    images: [
      'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    hours: {
      'Monday': 'Closed',
      'Tuesday': 'Closed',
      'Wednesday': '10:00 PM - 3:00 AM',
      'Thursday': '10:00 PM - 3:00 AM',
      'Friday': '10:00 PM - 4:00 AM',
      'Saturday': '10:00 PM - 4:00 AM',
      'Sunday': '10:00 PM - 2:00 AM',
    },
    events: [
      { id: 1, name: 'Electronic Fridays', date: 'Every Friday', dj: 'DJ Pulse', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
    ],
    availableDrinksMenu: [
      { 
        id: 1, 
        name: 'House Beer', 
        description: 'Local draft beer - Ursus or Ciuc', 
        category: 'Beer',
        image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '4.4%',
        volume: '500ml',
        originalPrice: '45 RON'
      },
      { 
        id: 2, 
        name: 'Electronic Martini', 
        description: 'Premium vodka with electronic music vibes', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '25%',
        volume: '200ml',
        originalPrice: '65 RON'
      }
    ]
  },
  {
    id: 2,
    name: 'Sky Bar',
    type: 'Rooftop Bar',
    rating: 4.6,
    reviews: 189,
    lat: 44.4361,
    lng: 26.1027,
    image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'BUCHAREST',
    availableDrinks: 63,
    isOpen: false,
    tags: ['Views', 'Upscale', 'Outdoor'],
    openUntil: 'Closed',
    crowdLevel: 'Low',
    filters: ['rooftop', 'outdoor', 'date-night', 'baller'],
    description: 'Experience breathtaking panoramic views of Bucharest from our sophisticated rooftop terrace.',
    address: 'Calea Victoriei 63-81, Bucharest 010065, Romania',
    phone: '+40 21 302 0000',
    priceRange: '$$$$',
    images: [
      'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    hours: {
      'Monday': 'Closed',
      'Tuesday': '6:00 PM - 1:00 AM',
      'Wednesday': '6:00 PM - 1:00 AM',
      'Thursday': '6:00 PM - 1:00 AM',
      'Friday': '6:00 PM - 2:00 AM',
      'Saturday': '6:00 PM - 2:00 AM',
      'Sunday': '6:00 PM - 12:00 AM',
    },
    events: [
      { id: 3, name: 'Sunset Sessions', date: 'Every Sunday', dj: 'DJ Horizon', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop' },
    ],
    availableDrinksMenu: [
      { 
        id: 3, 
        name: 'Bucharest Sunset', 
        description: 'Premium cocktail with city views', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '20%',
        volume: '250ml',
        originalPrice: '85 RON'
      }
    ]
  },
  {
    id: 3,
    name: 'The Vintage Pub',
    type: 'Traditional Pub',
    rating: 4.4,
    reviews: 256,
    lat: 44.4323,
    lng: 26.1063,
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'BUCHAREST',
    availableDrinks: 89,
    isOpen: true,
    tags: ['Traditional', 'Beer', 'Cozy'],
    openUntil: '12:00 AM',
    crowdLevel: 'Medium',
    filters: ['casual', 'beer', 'traditional'],
    description: 'A cozy traditional pub with the best selection of local and international beers.',
    address: 'Strada Lipscani 25, Bucharest 030031, Romania',
    phone: '+40 21 314 2580',
    priceRange: '$$',
    images: [
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    hours: {
      'Monday': '4:00 PM - 12:00 AM',
      'Tuesday': '4:00 PM - 12:00 AM',
      'Wednesday': '4:00 PM - 12:00 AM',
      'Thursday': '4:00 PM - 1:00 AM',
      'Friday': '4:00 PM - 2:00 AM',
      'Saturday': '2:00 PM - 2:00 AM',
      'Sunday': '2:00 PM - 12:00 AM',
    },
    events: [
      { id: 4, name: 'Quiz Night', date: 'Every Wednesday', dj: 'Host Mike', image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=400&h=300&fit=crop' },
    ],
    availableDrinksMenu: [
      { 
        id: 4, 
        name: 'Local Craft Beer', 
        description: 'Rotating selection of Romanian craft beers', 
        category: 'Beer',
        image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '5.2%',
        volume: '400ml',
        originalPrice: '35 RON'
      }
    ]
  },
  {
    id: 4,
    name: 'Neon Lounge',
    type: 'Cocktail Lounge',
    rating: 4.7,
    reviews: 178,
    lat: 44.4289,
    lng: 26.1011,
    image: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'BUCHAREST',
    availableDrinks: 156,
    isOpen: false,
    tags: ['Cocktails', 'Modern', 'Neon'],
    openUntil: 'Closed',
    crowdLevel: 'High',
    filters: ['cocktails', 'modern', 'date-night'],
    description: 'A sleek modern lounge featuring innovative cocktails and vibrant neon ambiance.',
    address: 'Strada Franceză 62, Bucharest 030106, Romania',
    phone: '+40 21 315 7890',
    priceRange: '$$$',
    images: [
      'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    hours: {
      'Monday': 'Closed',
      'Tuesday': 'Closed',
      'Wednesday': '7:00 PM - 2:00 AM',
      'Thursday': '7:00 PM - 2:00 AM',
      'Friday': '7:00 PM - 3:00 AM',
      'Saturday': '7:00 PM - 3:00 AM',
      'Sunday': '7:00 PM - 1:00 AM',
    },
    events: [
      { id: 5, name: 'Neon Nights', date: 'Every Saturday', dj: 'DJ Neon', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
    ],
    availableDrinksMenu: [
      { 
        id: 5, 
        name: 'Neon Fizz', 
        description: 'Glowing cocktail with premium spirits', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '22%',
        volume: '220ml',
        originalPrice: '75 RON'
      }
    ]
  },
  {
    id: 5,
    name: 'Jazz Corner',
    type: 'Jazz Bar',
    rating: 4.5,
    reviews: 143,
    lat: 44.4356,
    lng: 26.0987,
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'BUCHAREST',
    availableDrinks: 74,
    isOpen: true,
    tags: ['Jazz', 'Live Music', 'Intimate'],
    openUntil: '1:00 AM',
    crowdLevel: 'Low',
    filters: ['live-music', 'jazz', 'intimate'],
    description: 'An intimate jazz venue featuring live performances and classic cocktails.',
    address: 'Strada Arthur Verona 13, Bucharest 010362, Romania',
    phone: '+40 21 311 4567',
    priceRange: '$$$',
    images: [
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    hours: {
      'Monday': 'Closed',
      'Tuesday': 'Closed',
      'Wednesday': '8:00 PM - 1:00 AM',
      'Thursday': '8:00 PM - 1:00 AM',
      'Friday': '8:00 PM - 2:00 AM',
      'Saturday': '8:00 PM - 2:00 AM',
      'Sunday': '8:00 PM - 12:00 AM',
    },
    events: [
      { id: 6, name: 'Jazz Nights', date: 'Every Thursday', dj: 'The Quartet', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop' },
    ],
    availableDrinksMenu: [
      { 
        id: 6, 
        name: 'Smooth Jazz', 
        description: 'Whiskey-based cocktail with smooth notes', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '30%',
        volume: '180ml',
        originalPrice: '95 RON'
      }
    ]
  },

  // Constanta bars (5)
  {
    id: 6,
    name: 'Beach Club Mamaia',
    type: 'Beach Club',
    rating: 4.9,
    reviews: 412,
    lat: 44.1750,
    lng: 28.6350,
    image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'CONSTANTA',
    availableDrinks: 134,
    isOpen: true,
    tags: ['Beach', 'Summer', 'Dancing'],
    openUntil: '4:00 AM',
    crowdLevel: 'High',
    filters: ['beach', 'outdoor', 'dancing', 'summer'],
    description: 'The ultimate beach club experience with stunning sea views and world-class DJs.',
    address: 'Mamaia Beach, Constanta 900001, Romania',
    phone: '+40 241 831 234',
    priceRange: '$$$$',
    images: [
      'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    hours: {
      'Monday': '6:00 PM - 2:00 AM',
      'Tuesday': '6:00 PM - 2:00 AM',
      'Wednesday': '6:00 PM - 3:00 AM',
      'Thursday': '6:00 PM - 3:00 AM',
      'Friday': '6:00 PM - 4:00 AM',
      'Saturday': '6:00 PM - 4:00 AM',
      'Sunday': '6:00 PM - 2:00 AM',
    },
    events: [
      { id: 7, name: 'Beach Party', date: 'Every Friday', dj: 'DJ Ocean', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
    ],
    availableDrinksMenu: [
      { 
        id: 7, 
        name: 'Sea Breeze', 
        description: 'Refreshing cocktail with ocean vibes', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '18%',
        volume: '300ml',
        originalPrice: '55 RON'
      }
    ]
  },
  {
    id: 7,
    name: 'Port Wine Bar',
    type: 'Wine Bar',
    rating: 4.3,
    reviews: 167,
    lat: 44.1765,
    lng: 28.6380,
    image: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'CONSTANTA',
    availableDrinks: 89,
    isOpen: false,
    tags: ['Wine', 'Elegant', 'Harbor'],
    openUntil: 'Closed',
    crowdLevel: 'Low',
    filters: ['wine', 'elegant', 'date-night'],
    description: 'Sophisticated wine bar overlooking the historic port with premium wine selection.',
    address: 'Portul Constanta, Constanta 900663, Romania',
    phone: '+40 241 617 890',
    priceRange: '$$$',
    images: [
      'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    hours: {
      'Monday': 'Closed',
      'Tuesday': 'Closed',
      'Wednesday': '5:00 PM - 11:00 PM',
      'Thursday': '5:00 PM - 11:00 PM',
      'Friday': '5:00 PM - 12:00 AM',
      'Saturday': '5:00 PM - 12:00 AM',
      'Sunday': '5:00 PM - 10:00 PM',
    },
    events: [
      { id: 8, name: 'Wine Tasting', date: 'Every Saturday', dj: 'Sommelier Alex', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
    ],
    availableDrinksMenu: [
      { 
        id: 8, 
        name: 'Romanian Merlot', 
        description: 'Premium local wine from Dobrogea region', 
        category: 'Wine',
        image: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '13%',
        volume: '150ml',
        originalPrice: '45 RON'
      }
    ]
  },
  {
    id: 8,
    name: 'Sunset Terrace',
    type: 'Rooftop Terrace',
    rating: 4.6,
    reviews: 234,
    lat: 44.1720,
    lng: 28.6340,
    image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'CONSTANTA',
    availableDrinks: 112,
    isOpen: true,
    tags: ['Sunset', 'Rooftop', 'Views'],
    openUntil: '11:00 PM',
    crowdLevel: 'Medium',
    filters: ['rooftop', 'sunset', 'views'],
    description: 'Perfect spot to watch the sunset over the Black Sea with craft cocktails.',
    address: 'Bulevardul Mamaia 255, Constanta 900527, Romania',
    phone: '+40 241 583 456',
    priceRange: '$$',
    images: [
      'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    hours: {
      'Monday': '5:00 PM - 11:00 PM',
      'Tuesday': '5:00 PM - 11:00 PM',
      'Wednesday': '5:00 PM - 11:00 PM',
      'Thursday': '5:00 PM - 12:00 AM',
      'Friday': '5:00 PM - 1:00 AM',
      'Saturday': '4:00 PM - 1:00 AM',
      'Sunday': '4:00 PM - 11:00 PM',
    },
    events: [
      { id: 9, name: 'Sunset Sessions', date: 'Every Sunday', dj: 'DJ Sunset', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop' },
    ],
    availableDrinksMenu: [
      { 
        id: 91, 
        name: 'Sunset Spritz', 
        description: 'Light and refreshing aperitif', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '12%',
        volume: '250ml',
        originalPrice: '40 RON'
      },
      { 
        id: 92, 
        name: 'Sea Breeze Martini', 
        description: 'Classic martini with a coastal twist', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '18%',
        volume: '120ml',
        originalPrice: '55 RON'
      },
      { 
        id: 93, 
        name: 'Golden Hour', 
        description: 'Whiskey-based cocktail perfect for sunset', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '22%',
        volume: '150ml',
        originalPrice: '65 RON'
      },
      { 
        id: 94, 
        name: 'Terrace Fizz', 
        description: 'Sparkling cocktail with citrus notes', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '14%',
        volume: '200ml',
        originalPrice: '45 RON'
      },
      { 
        id: 95, 
        name: 'Sunset Passion', 
        description: 'Tropical passion fruit cocktail', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '16%',
        volume: '180ml',
        originalPrice: '50 RON'
      }
    ]
  },
  {
    id: 9,
    name: 'Sailor\'s Pub',
    type: 'Maritime Pub',
    rating: 4.2,
    reviews: 198,
    lat: 44.1735,
    lng: 28.6370,
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'CONSTANTA',
    availableDrinks: 67,
    isOpen: false,
    tags: ['Maritime', 'Traditional', 'Beer'],
    openUntil: 'Closed',
    crowdLevel: 'Medium',
    filters: ['traditional', 'beer', 'nautical'],
    description: 'Authentic maritime-themed pub with local seafood and traditional Romanian beers.',
    address: 'Strada Mircea cel Batran 15, Constanta 900178, Romania',
    phone: '+40 241 639 123',
    priceRange: '$$',
    images: [
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    hours: {
      'Monday': 'Closed',
      'Tuesday': '4:00 PM - 12:00 AM',
      'Wednesday': '4:00 PM - 12:00 AM',
      'Thursday': '4:00 PM - 12:00 AM',
      'Friday': '4:00 PM - 1:00 AM',
      'Saturday': '2:00 PM - 1:00 AM',
      'Sunday': '2:00 PM - 11:00 PM',
    },
    events: [
      { id: 10, name: 'Sea Shanty Night', date: 'Every Friday', dj: 'Captain Jim', image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=400&h=300&fit=crop' },
    ],
    availableDrinksMenu: [
      { 
        id: 101, 
        name: 'Captain\'s Rum Punch', 
        description: 'Traditional maritime rum cocktail', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '20%',
        volume: '200ml',
        originalPrice: '35 RON'
      },
      { 
        id: 102, 
        name: 'Sailor\'s Sangria', 
        description: 'Maritime twist on classic sangria', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '12%',
        volume: '250ml',
        originalPrice: '30 RON'
      },
      { 
        id: 103, 
        name: 'Sea Storm', 
        description: 'Strong whiskey cocktail for stormy nights', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '25%',
        volume: '150ml',
        originalPrice: '45 RON'
      },
      { 
        id: 104, 
        name: 'Anchor Drop', 
        description: 'Gin-based cocktail with sea salt rim', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '18%',
        volume: '120ml',
        originalPrice: '40 RON'
      },
      { 
        id: 105, 
        name: 'Port Authority', 
        description: 'Port wine cocktail with spices', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '16%',
        volume: '180ml',
        originalPrice: '38 RON'
      }
    ]
  },
  {
    id: 10,
    name: 'Black Sea Lounge',
    type: 'Seaside Lounge',
    rating: 4.8,
    reviews: 287,
    lat: 44.1755,
    lng: 28.6355,
    image: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'CONSTANTA',
    availableDrinks: 156,
    isOpen: true,
    tags: ['Seaside', 'Luxury', 'Cocktails'],
    openUntil: '2:00 AM',
    crowdLevel: 'High',
    filters: ['luxury', 'cocktails', 'seaside'],
    description: 'Luxurious seaside lounge with premium cocktails and breathtaking Black Sea views.',
    address: 'Mamaia Resort, Constanta 900001, Romania',
    phone: '+40 241 831 567',
    priceRange: '$$$$',
    images: [
      'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    hours: {
      'Monday': '6:00 PM - 1:00 AM',
      'Tuesday': '6:00 PM - 1:00 AM',
      'Wednesday': '6:00 PM - 2:00 AM',
      'Thursday': '6:00 PM - 2:00 AM',
      'Friday': '6:00 PM - 3:00 AM',
      'Saturday': '6:00 PM - 3:00 AM',
      'Sunday': '6:00 PM - 2:00 AM',
    },
    events: [
      { id: 11, name: 'Luxury Nights', date: 'Every Saturday', dj: 'DJ Luxury', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
    ],
    availableDrinksMenu: [
      { 
        id: 111, 
        name: 'Black Sea Breeze', 
        description: 'Signature cocktail with premium spirits and sea salt', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '24%',
        volume: '200ml',
        originalPrice: '85 RON'
      },
      { 
        id: 112, 
        name: 'Luxury Martini', 
        description: 'Premium gin martini with caviar garnish', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '28%',
        volume: '120ml',
        originalPrice: '120 RON'
      },
      { 
        id: 113, 
        name: 'Seaside Champagne', 
        description: 'Premium champagne cocktail with elderflower', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '12%',
        volume: '150ml',
        originalPrice: '95 RON'
      },
      { 
        id: 114, 
        name: 'Ocean Depth', 
        description: 'Blue cocktail with deep sea flavors', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '22%',
        volume: '180ml',
        originalPrice: '75 RON'
      },
      { 
        id: 115, 
        name: 'Coastal Mist', 
        description: 'Smoky whiskey cocktail with sea mist effect', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '26%',
        volume: '150ml',
        originalPrice: '90 RON'
      }
    ]
  },

  // Additional Constanta bars (5 more to reach 8 total)
  {
    id: 13,
    name: 'Neptun\'s Den',
    type: 'Beach Club',
    rating: 4.3,
    reviews: 156,
    lat: 44.1680,
    lng: 28.6300,
    image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'CONSTANTA',
    availableDrinks: 98,
    isOpen: true,
    tags: ['Beach', 'Club', 'Summer'],
    openUntil: '3:00 AM',
    crowdLevel: 'High',
    filters: ['beach', 'dancing', 'cocktails'],
    description: 'Vibrant beach club with events and dancing right by the sea.',
    address: 'Plaja Neptun, Constanta 905350, Romania',
    phone: '+40 241 701 234',
    priceRange: '$$$',
    images: [
      'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    hours: {
      'Monday': '10:00 AM - 12:00 AM',
      'Tuesday': '10:00 AM - 12:00 AM',
      'Wednesday': '10:00 AM - 1:00 AM',
      'Thursday': '10:00 AM - 2:00 AM',
      'Friday': '10:00 AM - 3:00 AM',
      'Saturday': '10:00 AM - 4:00 AM',
      'Sunday': '10:00 AM - 2:00 AM',
    },
    events: [
      { id: 14, name: 'Beach Party Tonight', date: '2025-08-04', dj: 'DJ Neptune', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop' },
    ],
    availableDrinksMenu: [
      { 
        id: 131, 
        name: 'Neptune\'s Trident', 
        description: 'Blue tropical cocktail with rum and coconut', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '20%',
        volume: '250ml',
        originalPrice: '55 RON'
      },
      { 
        id: 132, 
        name: 'Beach Breeze', 
        description: 'Light and fruity summer cocktail', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '15%',
        volume: '300ml',
        originalPrice: '45 RON'
      },
      { 
        id: 133, 
        name: 'Coral Reef', 
        description: 'Colorful layered cocktail with tropical fruits', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '18%',
        volume: '200ml',
        originalPrice: '50 RON'
      },
      { 
        id: 134, 
        name: 'Sandy Shores', 
        description: 'Vanilla and caramel cocktail with sea salt', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '22%',
        volume: '180ml',
        originalPrice: '60 RON'
      },
      { 
        id: 135, 
        name: 'Ocean Wave', 
        description: 'Refreshing gin cocktail with citrus splash', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '19%',
        volume: '220ml',
        originalPrice: '48 RON'
      }
    ]
  },
  {
    id: 14,
    name: 'Pier 99',
    type: 'Waterfront Bar',
    rating: 4.1,
    reviews: 203,
    lat: 44.1790,
    lng: 28.6380,
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'CONSTANTA',
    availableDrinks: 85,
    isOpen: false,
    tags: ['Waterfront', 'Casual', 'Seafood'],
    openUntil: 'Opens 6:00 PM',
    crowdLevel: 'Medium',
    filters: ['waterfront', 'casual', 'food'],
    description: 'Casual waterfront bar opening at 6 PM with tonight\'s special event.',
    address: 'Portul Constanta, Constanta 900001, Romania',
    phone: '+40 241 650 999',
    priceRange: '$$',
    images: [
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    hours: {
      'Monday': 'Closed',
      'Tuesday': '6:00 PM - 1:00 AM',
      'Wednesday': '6:00 PM - 1:00 AM',
      'Thursday': '6:00 PM - 2:00 AM',
      'Friday': '6:00 PM - 2:00 AM',
      'Saturday': '6:00 PM - 3:00 AM',
      'Sunday': '6:00 PM - 12:00 AM',
    },
    events: [
      { id: 15, name: 'Harbor Lights Live Music', date: '2025-08-04', dj: 'Local Band', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop' },
    ],
    availableDrinksMenu: [
      { 
        id: 141, 
        name: 'Harbor Master', 
        description: 'Strong whiskey cocktail for sailors', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '25%',
        volume: '150ml',
        originalPrice: '42 RON'
      },
      { 
        id: 142, 
        name: 'Pier Punch', 
        description: 'Fruity punch perfect for groups', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '16%',
        volume: '300ml',
        originalPrice: '35 RON'
      },
      { 
        id: 143, 
        name: 'Lighthouse Beam', 
        description: 'Bright yellow citrus vodka cocktail', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '20%',
        volume: '180ml',
        originalPrice: '38 RON'
      },
      { 
        id: 144, 
        name: 'Dockside Delight', 
        description: 'Sweet and sour cocktail with berries', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '17%',
        volume: '200ml',
        originalPrice: '40 RON'
      },
      { 
        id: 145, 
        name: 'Captain\'s Choice', 
        description: 'Premium rum cocktail with spices', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '23%',
        volume: '160ml',
        originalPrice: '45 RON'
      }
    ]
  },
  {
    id: 15,
    name: 'Seashell Lounge',
    type: 'Cocktail Lounge',
    rating: 4.5,
    reviews: 189,
    lat: 44.1825,
    lng: 28.6420,
    image: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'CONSTANTA',
    availableDrinks: 145,
    isOpen: true,
    tags: ['Elegant', 'Cocktails', 'Upscale'],
    openUntil: '1:00 AM',
    crowdLevel: 'Medium',
    filters: ['upscale', 'cocktails', 'quiet'],
    description: 'Elegant cocktail lounge with expertly crafted drinks and sophisticated atmosphere.',
    address: 'Strada Remus Opreanu 12, Constanta 900178, Romania',
    phone: '+40 241 789 456',
    priceRange: '$$$',
    images: [
      'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    hours: {
      'Monday': '7:00 PM - 12:00 AM',
      'Tuesday': '7:00 PM - 12:00 AM',
      'Wednesday': '7:00 PM - 1:00 AM',
      'Thursday': '7:00 PM - 1:00 AM',
      'Friday': '7:00 PM - 2:00 AM',
      'Saturday': '7:00 PM - 2:00 AM',
      'Sunday': '7:00 PM - 12:00 AM',
    },
    events: [
      { id: 16, name: 'Jazz & Cocktails Night', date: '2025-08-04', dj: 'Jazz Trio', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop' },
    ],
    availableDrinksMenu: [
      { 
        id: 151, 
        name: 'Seashell Signature', 
        description: 'House specialty with pearls of caviar', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '24%',
        volume: '120ml',
        originalPrice: '75 RON'
      },
      { 
        id: 152, 
        name: 'Pearl Martini', 
        description: 'Elegant gin martini with pearl garnish', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '26%',
        volume: '110ml',
        originalPrice: '65 RON'
      },
      { 
        id: 153, 
        name: 'Coral Garden', 
        description: 'Floral gin cocktail with rose petals', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '18%',
        volume: '150ml',
        originalPrice: '55 RON'
      },
      { 
        id: 154, 
        name: 'Ocean Mist', 
        description: 'Smoky mezcal cocktail with sea salt', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '22%',
        volume: '140ml',
        originalPrice: '60 RON'
      },
      { 
        id: 155, 
        name: 'Tidal Wave', 
        description: 'Blue layered cocktail with coconut foam', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '20%',
        volume: '170ml',
        originalPrice: '50 RON'
      }
    ]
  },
  {
    id: 16,
    name: 'Anchor\'s Rest',
    type: 'Traditional Tavern',
    rating: 3.9,
    reviews: 145,
    lat: 44.1650,
    lng: 28.6280,
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'CONSTANTA',
    availableDrinks: 72,
    isOpen: false,
    tags: ['Traditional', 'Local', 'Cozy'],
    openUntil: 'Closed',
    crowdLevel: 'Low',
    filters: ['traditional', 'casual', 'quiet'],
    description: 'Traditional tavern closed for renovation, reopens next week.',
    address: 'Strada Traian 45, Constanta 900178, Romania',
    phone: '+40 241 456 789',
    priceRange: '$',
    images: [
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    hours: {
      'Monday': 'Closed',
      'Tuesday': 'Closed',
      'Wednesday': 'Closed',
      'Thursday': 'Closed',
      'Friday': 'Closed',
      'Saturday': 'Closed',
      'Sunday': 'Closed',
    },
    events: [],
    availableDrinksMenu: [
      { 
        id: 161, 
        name: 'Traditional Țuică', 
        description: 'Classic Romanian plum brandy cocktail', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '30%',
        volume: '100ml',
        originalPrice: '25 RON'
      },
      { 
        id: 162, 
        name: 'Fisherman\'s Friend', 
        description: 'Strong local spirits with herbs', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '28%',
        volume: '120ml',
        originalPrice: '30 RON'
      },
      { 
        id: 163, 
        name: 'Tavern Special', 
        description: 'House blend of local wines and spirits', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '18%',
        volume: '200ml',
        originalPrice: '22 RON'
      },
      { 
        id: 164, 
        name: 'Old Port Punch', 
        description: 'Traditional punch recipe from old sailors', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '20%',
        volume: '250ml',
        originalPrice: '28 RON'
      },
      { 
        id: 165, 
        name: 'Anchor Drop', 
        description: 'Local beer cocktail with sea salt', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '12%',
        volume: '300ml',
        originalPrice: '18 RON'
      }
    ]
  },
  {
    id: 17,
    name: 'Marina Vista',
    type: 'Marina Bar',
    rating: 4.4,
    reviews: 167,
    lat: 44.1810,
    lng: 28.6390,
    image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'CONSTANTA',
    availableDrinks: 118,
    isOpen: true,
    tags: ['Marina', 'Views', 'Upscale'],
    openUntil: '2:00 AM',
    crowdLevel: 'High',
    filters: ['upscale', 'views', 'cocktails'],
    description: 'Sophisticated marina bar with stunning yacht views and premium cocktails.',
    address: 'Marina Constanta, Constanta 900001, Romania',
    phone: '+40 241 890 123',
    priceRange: '$$$$',
    images: [
      'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    hours: {
      'Monday': '6:00 PM - 1:00 AM',
      'Tuesday': '6:00 PM - 1:00 AM',
      'Wednesday': '6:00 PM - 2:00 AM',
      'Thursday': '6:00 PM - 2:00 AM',
      'Friday': '6:00 PM - 3:00 AM',
      'Saturday': '5:00 PM - 3:00 AM',
      'Sunday': '5:00 PM - 2:00 AM',
    },
    events: [],
    availableDrinksMenu: [
      { 
        id: 171, 
        name: 'Yacht Club Special', 
        description: 'Premium cocktail for the elite', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '26%',
        volume: '130ml',
        originalPrice: '95 RON'
      },
      { 
        id: 172, 
        name: 'Marina Sunset', 
        description: 'Orange-colored cocktail perfect for sunset views', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '18%',
        volume: '180ml',
        originalPrice: '65 RON'
      },
      { 
        id: 173, 
        name: 'Luxury Breeze', 
        description: 'Champagne cocktail with gold flakes', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '14%',
        volume: '150ml',
        originalPrice: '120 RON'
      },
      { 
        id: 174, 
        name: 'Captain\'s Reserve', 
        description: 'Aged rum cocktail with premium ingredients', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '28%',
        volume: '120ml',
        originalPrice: '85 RON'
      },
      { 
        id: 175, 
        name: 'Harbour Lights', 
        description: 'Glowing cocktail that changes color', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '22%',
        volume: '160ml',
        originalPrice: '75 RON'
      }
    ]
  },

  // Cluj-Napoca bars (2)
  {
    id: 11,
    name: 'Flying Circus',
    type: 'Pub',
    rating: 4.6,
    reviews: 298,
    lat: 46.7712,
    lng: 23.6236,
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'CLUJ',
    availableDrinks: 89,
    isOpen: true,
    tags: ['Craft Beer', 'Student Friendly', 'Live Music'],
    openUntil: '1:00 AM',
    crowdLevel: 'Medium',
    filters: ['beer', 'live-music', 'casual', 'groups'],
    description: 'Popular student pub in the heart of Cluj with great craft beer selection and live music.',
    address: 'Strada Mihail Kogălniceanu 5, Cluj-Napoca 400000, Romania',
    phone: '+40 264 450 123',
    priceRange: '$$',
    images: [
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    hours: {
      'Monday': '4:00 PM - 12:00 AM',
      'Tuesday': '4:00 PM - 12:00 AM',
      'Wednesday': '4:00 PM - 1:00 AM',
      'Thursday': '4:00 PM - 1:00 AM',
      'Friday': '4:00 PM - 2:00 AM',
      'Saturday': '2:00 PM - 2:00 AM',
      'Sunday': '4:00 PM - 12:00 AM',
    },
    events: [
      { id: 12, name: 'Indie Rock Night', date: 'Every Thursday', dj: 'Local Bands', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop' },
    ],
    availableDrinksMenu: [
      { 
        id: 12, 
        name: 'Cluj IPA', 
        description: 'Local craft IPA with citrus notes', 
        category: 'Beer',
        image: 'https://images.pexels.com/photos/1552757/pexels-photo-1552757.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '6.2%',
        volume: '500ml',
        originalPrice: '18 RON'
      }
    ]
  },
  {
    id: 12,
    name: 'Euphoria Music Hall',
    type: 'Nightclub',
    rating: 4.4,
    reviews: 412,
    lat: 46.7665,
    lng: 23.5889,
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'CLUJ',
    availableDrinks: 134,
    isOpen: false,
    tags: ['Electronic Music', 'Dancing', 'Late Night'],
    openUntil: '6:00 AM',
    crowdLevel: 'High',
    filters: ['dancing', 'late-night', 'upscale', 'groups'],
    description: 'Premier nightclub in Cluj featuring international DJs and cutting-edge sound system.',
    address: 'Calea Turzii 48, Cluj-Napoca 400495, Romania',
    phone: '+40 264 598 777',
    priceRange: '$$$',
    images: [
      'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    hours: {
      'Monday': 'Closed',
      'Tuesday': 'Closed',
      'Wednesday': 'Closed',
      'Thursday': '10:00 PM - 5:00 AM',
      'Friday': '10:00 PM - 6:00 AM',
      'Saturday': '10:00 PM - 6:00 AM',
      'Sunday': 'Closed',
    },
    events: [
      { id: 13, name: 'Techno Friday', date: 'Every Friday', dj: 'DJ Andrei X', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
    ],
    availableDrinksMenu: [
      { 
        id: 13, 
        name: 'Euphoria Elixir', 
        description: 'House special cocktail with premium vodka and energy blend', 
        category: 'Cocktail',
        image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
        alcoholContent: '28%',
        volume: '250ml',
        originalPrice: '45 RON'
      }
    ]
  }
];