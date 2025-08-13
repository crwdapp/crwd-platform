// Simplified bars data - imports drinks and events from separate files
import { allDrinks, getDrinksByBarId, getAvailableDrinksCount } from './drinks';
import { allEvents, getEventsByBarId } from './events';

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
  // These will be populated dynamically from separate data files
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

// Core bar data without embedded drinks/events
const baseBars: Omit<Bar, 'availableDrinks' | 'events' | 'availableDrinksMenu'>[] = [
  // Bucharest bars (2)
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
    isOpen: true,
    tags: ['Electronic', 'Dancing', 'Late Night'],
    openUntil: '3:00 AM',
    crowdLevel: 'High',
    filters: ['live-music', 'late-night', 'groups', 'dancing'],
    description: 'Bucharest\'s premier underground electronic music venue featuring world-class DJs, state-of-the-art sound system, and an unforgettable atmosphere. Dance the night away with the city\'s most vibrant crowd.',
    address: 'Strada Blanari 14, Bucharest 030167, Romania',
    phone: '+40 21 314 0158',
    priceRange: '$$$',
    images: [
      'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    hours: {
      'Monday': 'Closed',
      'Tuesday': 'Closed',
      'Wednesday': '10:00 PM - 3:00 AM',
      'Thursday': '10:00 PM - 3:00 AM',
      'Friday': '10:00 PM - 4:00 AM',
      'Saturday': '10:00 PM - 4:00 AM',
      'Sunday': '10:00 PM - 2:00 AM',
    }
  },
  {
    id: 2,
    name: 'Old Town',
    type: 'Historic Pub',
    rating: 4.6,
    reviews: 287,
    lat: 44.4310,
    lng: 26.1005,
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'BUCHAREST',
    isOpen: true,
    tags: ['Historic', 'Cozy', 'Local'],
    openUntil: '1:00 AM',
    crowdLevel: 'Medium',
    filters: ['quiet', 'historic', 'local'],
    description: 'A charming historic pub in the heart of Bucharest\'s old town. Featuring traditional Romanian cuisine, local wines, and a cozy atmosphere perfect for intimate conversations.',
    address: 'Strada Lipscani 12, Bucharest 030029, Romania',
    phone: '+40 21 315 8924',
    priceRange: '$$',
    images: [
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    hours: {
      'Monday': '5:00 PM - 12:00 AM',
      'Tuesday': '5:00 PM - 12:00 AM',
      'Wednesday': '5:00 PM - 1:00 AM',
      'Thursday': '5:00 PM - 1:00 AM',
      'Friday': '5:00 PM - 2:00 AM',
      'Saturday': '3:00 PM - 2:00 AM',
      'Sunday': '3:00 PM - 12:00 AM',
    }
  },
  
  // Dublin bars (2)
  {
    id: 3,
    name: 'Temple Bar',
    type: 'Traditional Pub',
    rating: 4.9,
    reviews: 1542,
    lat: 53.3454,
    lng: -6.2654,
    image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'DUBLIN',
    isOpen: true,
    tags: ['Irish', 'Historic', 'Touristy'],
    openUntil: '12:30 AM',
    crowdLevel: 'High',
    filters: ['live-music', 'historic', 'touristy'],
    description: 'Dublin\'s most famous pub in the heart of the Temple Bar district. Experience authentic Irish culture with traditional music, Guinness on tap, and a lively atmosphere that embodies the spirit of Ireland.',
    address: '47-48 Temple Bar, Dublin 2, D02 N725, Ireland',
    phone: '+353 1 672 5287',
    priceRange: '$$$',
    images: [
      'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    hours: {
      'Monday': '12:00 PM - 11:30 PM',
      'Tuesday': '12:00 PM - 11:30 PM',
      'Wednesday': '12:00 PM - 11:30 PM',
      'Thursday': '12:00 PM - 12:30 AM',
      'Friday': '12:00 PM - 12:30 AM',
      'Saturday': '12:00 PM - 12:30 AM',
      'Sunday': '12:00 PM - 11:30 PM',
    }
  },
  {
    id: 4,
    name: 'Molly Malone\'s',
    type: 'Gastropub',
    rating: 4.7,
    reviews: 892,
    lat: 53.3434,
    lng: -6.2675,
    image: 'https://images.pexels.com/photos/1983046/pexels-photo-1983046.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'DUBLIN',
    isOpen: true,
    tags: ['Gastropub', 'Modern', 'Food'],
    openUntil: '1:00 AM',
    crowdLevel: 'Medium',
    filters: ['food', 'modern', 'groups'],
    description: 'A modern gastropub offering innovative Irish cuisine alongside craft beers and creative cocktails. Perfect blend of traditional Irish hospitality with contemporary dining experience.',
    address: '15 Suffolk Street, Dublin 2, D02 R285, Ireland',
    phone: '+353 1 679 2777',
    priceRange: '$$',
    images: [
      'https://images.pexels.com/photos/1983046/pexels-photo-1983046.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    hours: {
      'Monday': '4:00 PM - 11:00 PM',
      'Tuesday': '4:00 PM - 11:00 PM',
      'Wednesday': '4:00 PM - 12:00 AM',
      'Thursday': '4:00 PM - 12:00 AM',
      'Friday': '2:00 PM - 1:00 AM',
      'Saturday': '12:00 PM - 1:00 AM',
      'Sunday': '12:00 PM - 11:00 PM',
    }
  }
];

// Dynamically populate bars with drinks and events data
export const allBars: Bar[] = baseBars.map(bar => ({
  ...bar,
  availableDrinks: getAvailableDrinksCount(bar.id),
  availableDrinksMenu: getDrinksByBarId(bar.id).map(drink => ({
    id: drink.id,
    name: drink.name,
    description: drink.description,
    category: drink.category,
    image: drink.image,
    alcoholContent: drink.alcoholContent,
    volume: drink.volume,
    originalPrice: drink.originalPrice
  })),
  events: getEventsByBarId(bar.id).map(event => ({
    id: event.id,
    name: event.name,
    date: event.date,
    dj: event.dj || 'TBA',
    image: event.image
  }))
}));

// Helper functions
export const getBarById = (id: number): Bar | undefined => {
  return allBars.find(bar => bar.id === id);
};

export const getBarsByLocation = (location: string): Bar[] => {
  return allBars.filter(bar => bar.location.toLowerCase() === location.toLowerCase());
};