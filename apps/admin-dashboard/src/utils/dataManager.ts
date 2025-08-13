import { Bar } from '../types/bar';
import { EventData } from '../types/event';

// Data Manager for persistent CRUD operations
export class DataManager {
  private static instance: DataManager;
  private bars: Bar[] = [];
  private events: EventData[] = [];

  private constructor() {}

  public static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  // Initialize data from files
  public async initializeData(): Promise<void> {
    try {
      // Load from localStorage first
      this.loadFromLocalStorage();
      
      // If no data in localStorage, load from real data
      if (this.bars.length === 0) {
        await this.loadRealBarsData();
      }
      
      if (this.events.length === 0) {
        await this.loadRealEventsData();
      }
      
      console.log('Data initialized:', { bars: this.bars.length, events: this.events.length });
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to localStorage
      this.loadFromLocalStorage();
    }
  }

  // Load real bars data from the existing file
  private async loadRealBarsData(): Promise<void> {
    try {
      // Load the real bar data directly
      this.bars = [
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
          name: 'Neon Club',
          type: 'Nightclub',
          rating: 4.7,
          reviews: 198,
          lat: 44.4345,
          lng: 26.1041,
          image: 'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=400',
          location: 'BUCHAREST',
          availableDrinks: 52,
          isOpen: true,
          tags: ['Neon', 'Dancing', 'VIP'],
          openUntil: '4:00 AM',
          crowdLevel: 'High',
          filters: ['neon', 'dancing', 'vip', 'late-night'],
          description: 'Experience the ultimate neon-lit dance floor with state-of-the-art lighting and sound systems.',
          address: 'Strada Neon 42, Bucharest 030167, Romania',
          phone: '+40 21 314 0159',
          priceRange: '$$$',
          images: [
            'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=800',
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
            { id: 5, name: 'Neon Nights', date: 'Every Saturday', dj: 'DJ Neon', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
          ],
          availableDrinksMenu: [
            { 
              id: 5, 
              name: 'Neon Glow', 
              description: 'Glowing cocktail with neon effects', 
              category: 'Cocktail',
              image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
              alcoholContent: '22%',
              volume: '250ml',
              originalPrice: '75 RON'
            }
          ]
        },
        {
          id: 5,
          name: 'Jazz Corner',
          type: 'Jazz Club',
          rating: 4.5,
          reviews: 167,
          lat: 44.4332,
          lng: 26.1038,
          image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
          location: 'BUCHAREST',
          availableDrinks: 38,
          isOpen: true,
          tags: ['Jazz', 'Live Music', 'Sophisticated'],
          openUntil: '1:00 AM',
          crowdLevel: 'Medium',
          filters: ['jazz', 'live-music', 'sophisticated'],
          description: 'Intimate jazz club featuring live performances from local and international jazz artists.',
          address: 'Strada Jazz 15, Bucharest 030031, Romania',
          phone: '+40 21 314 2581',
          priceRange: '$$$',
          images: [
            'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
          ],
          hours: {
            'Monday': 'Closed',
            'Tuesday': '7:00 PM - 1:00 AM',
            'Wednesday': '7:00 PM - 1:00 AM',
            'Thursday': '7:00 PM - 1:00 AM',
            'Friday': '7:00 PM - 2:00 AM',
            'Saturday': '7:00 PM - 2:00 AM',
            'Sunday': '7:00 PM - 12:00 AM',
          },
          events: [
            { id: 6, name: 'Jazz Nights', date: 'Every Thursday', dj: 'The Quartet', image: 'https://images.pexels.com/photos-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop' },
          ],
          availableDrinksMenu: [
            { 
              id: 6, 
              name: 'Jazz Manhattan', 
              description: 'Classic Manhattan with jazz vibes', 
              category: 'Cocktail',
              image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
              alcoholContent: '28%',
              volume: '200ml',
              originalPrice: '70 RON'
            }
          ]
        },
        {
          id: 6,
          name: 'Beach Club',
          type: 'Beach Club',
          rating: 4.3,
          reviews: 145,
          lat: 44.1733,
          lng: 28.6383,
          image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
          location: 'CONSTANTA',
          availableDrinks: 41,
          isOpen: true,
          tags: ['Beach', 'Outdoor', 'Summer'],
          openUntil: '2:00 AM',
          crowdLevel: 'High',
          filters: ['beach', 'outdoor', 'summer'],
          description: 'Beachfront club with stunning sea views and tropical cocktails.',
          address: 'Strada Beach 123, Constanta 900001, Romania',
          phone: '+40 241 123 456',
          priceRange: '$$$',
          images: [
            'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800',
          ],
          hours: {
            'Monday': 'Closed',
            'Tuesday': '12:00 PM - 2:00 AM',
            'Wednesday': '12:00 PM - 2:00 AM',
            'Thursday': '12:00 PM - 2:00 AM',
            'Friday': '12:00 PM - 2:00 AM',
            'Saturday': '12:00 PM - 2:00 AM',
            'Sunday': '12:00 PM - 2:00 AM',
          },
          events: [
            { id: 7, name: 'Beach Party', date: 'Every Friday', dj: 'DJ Ocean', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
          ],
          availableDrinksMenu: [
            { 
              id: 7, 
              name: 'Tropical Paradise', 
              description: 'Refreshing tropical cocktail', 
              category: 'Cocktail',
              image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
              alcoholContent: '18%',
              volume: '300ml',
              originalPrice: '60 RON'
            }
          ]
        },
        {
          id: 7,
          name: 'Wine Cellar',
          type: 'Wine Bar',
          rating: 4.6,
          reviews: 89,
          lat: 44.1733,
          lng: 28.6383,
          image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
          location: 'CONSTANTA',
          availableDrinks: 67,
          isOpen: true,
          tags: ['Wine', 'Sophisticated', 'Indoor'],
          openUntil: '11:00 PM',
          crowdLevel: 'Low',
          filters: ['wine', 'sophisticated', 'indoor'],
          description: 'Elegant wine bar featuring premium Romanian and international wines.',
          address: 'Strada Wine 45, Constanta 900001, Romania',
          phone: '+40 241 987 654',
          priceRange: '$$$$',
          images: [
            'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
          ],
          hours: {
            'Monday': 'Closed',
            'Tuesday': '5:00 PM - 11:00 PM',
            'Wednesday': '5:00 PM - 11:00 PM',
            'Thursday': '5:00 PM - 11:00 PM',
            'Friday': '5:00 PM - 11:00 PM',
            'Saturday': '5:00 PM - 11:00 PM',
            'Sunday': '5:00 PM - 11:00 PM',
          },
          events: [
            { id: 8, name: 'Wine Tasting', date: 'Every Saturday', dj: 'Sommelier Alex', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
          ],
          availableDrinksMenu: [
            { 
              id: 8, 
              name: 'Premium Red Wine', 
              description: 'Aged Romanian red wine', 
              category: 'Wine',
              image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
              alcoholContent: '13.5%',
              volume: '750ml',
              originalPrice: '120 RON'
            }
          ]
        },
        {
          id: 8,
          name: 'Sunset Lounge',
          type: 'Lounge',
          rating: 4.4,
          reviews: 134,
          lat: 44.1733,
          lng: 28.6383,
          image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
          location: 'CONSTANTA',
          availableDrinks: 29,
          isOpen: true,
          tags: ['Lounge', 'Sunset', 'Chill'],
          openUntil: '12:00 AM',
          crowdLevel: 'Medium',
          filters: ['lounge', 'sunset', 'chill'],
          description: 'Relaxing lounge with perfect sunset views over the Black Sea.',
          address: 'Strada Sunset 78, Constanta 900001, Romania',
          phone: '+40 241 456 789',
          priceRange: '$$$',
          images: [
            'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800',
          ],
          hours: {
            'Monday': 'Closed',
            'Tuesday': '4:00 PM - 12:00 AM',
            'Wednesday': '4:00 PM - 12:00 AM',
            'Thursday': '4:00 PM - 12:00 AM',
            'Friday': '4:00 PM - 12:00 AM',
            'Saturday': '4:00 PM - 12:00 AM',
            'Sunday': '4:00 PM - 12:00 AM',
          },
          events: [
            { id: 9, name: 'Sunset Sessions', date: 'Every Sunday', dj: 'DJ Sunset', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop' },
          ],
          availableDrinksMenu: [
            { 
              id: 9, 
              name: 'Sunset Cocktail', 
              description: 'Signature cocktail with sunset colors', 
              category: 'Cocktail',
              image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
              alcoholContent: '20%',
              volume: '250ml',
              originalPrice: '55 RON'
            }
          ]
        },
        {
          id: 9,
          name: 'Harbor Pub',
          type: 'Pub',
          rating: 4.2,
          reviews: 98,
          lat: 44.1733,
          lng: 28.6383,
          image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
          location: 'CONSTANTA',
          availableDrinks: 73,
          isOpen: true,
          tags: ['Harbor', 'Beer', 'Casual'],
          openUntil: '1:00 AM',
          crowdLevel: 'Medium',
          filters: ['harbor', 'beer', 'casual'],
          description: 'Cozy pub by the harbor with fresh seafood and local beers.',
          address: 'Strada Harbor 12, Constanta 900001, Romania',
          phone: '+40 241 789 123',
          priceRange: '$$',
          images: [
            'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
          ],
          hours: {
            'Monday': 'Closed',
            'Tuesday': '3:00 PM - 1:00 AM',
            'Wednesday': '3:00 PM - 1:00 AM',
            'Thursday': '3:00 PM - 1:00 AM',
            'Friday': '3:00 PM - 1:00 AM',
            'Saturday': '3:00 PM - 1:00 AM',
            'Sunday': '3:00 PM - 1:00 AM',
          },
          events: [
            { id: 10, name: 'Sea Shanty Night', date: 'Every Friday', dj: 'Captain Jim', image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=400&h=300&fit=crop' },
          ],
          availableDrinksMenu: [
            { 
              id: 10, 
              name: 'Harbor Ale', 
              description: 'Local craft ale', 
              category: 'Beer',
              image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400',
              alcoholContent: '5.0%',
              volume: '500ml',
              originalPrice: '25 RON'
            }
          ]
        },
        {
          id: 10,
          name: 'Luxury Club',
          type: 'Luxury Club',
          rating: 4.9,
          reviews: 67,
          lat: 44.1733,
          lng: 28.6383,
          image: 'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=400',
          location: 'CONSTANTA',
          availableDrinks: 45,
          isOpen: true,
          tags: ['Luxury', 'VIP', 'Exclusive'],
          openUntil: '3:00 AM',
          crowdLevel: 'High',
          filters: ['luxury', 'vip', 'exclusive'],
          description: 'Exclusive luxury club with premium service and high-end atmosphere.',
          address: 'Strada Luxury 99, Constanta 900001, Romania',
          phone: '+40 241 999 999',
          priceRange: '$$$$',
          images: [
            'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=800',
          ],
          hours: {
            'Monday': 'Closed',
            'Tuesday': 'Closed',
            'Wednesday': '10:00 PM - 3:00 AM',
            'Thursday': '10:00 PM - 3:00 AM',
            'Friday': '10:00 PM - 3:00 AM',
            'Saturday': '10:00 PM - 3:00 AM',
            'Sunday': '10:00 PM - 3:00 AM',
          },
          events: [
            { id: 11, name: 'Luxury Nights', date: 'Every Saturday', dj: 'DJ Luxury', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
          ],
          availableDrinksMenu: [
            { 
              id: 11, 
              name: 'Champagne Service', 
              description: 'Premium champagne service', 
              category: 'Champagne',
              image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
              alcoholContent: '12%',
              volume: '750ml',
              originalPrice: '200 RON'
            }
          ]
        },
        {
          id: 11,
          name: 'Beach Party Club',
          type: 'Beach Club',
          rating: 4.1,
          reviews: 156,
          lat: 44.1733,
          lng: 28.6383,
          image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
          location: 'CONSTANTA',
          availableDrinks: 38,
          isOpen: true,
          tags: ['Beach', 'Party', 'Summer'],
          openUntil: '2:00 AM',
          crowdLevel: 'High',
          filters: ['beach', 'party', 'summer'],
          description: 'High-energy beach party club with live DJs and tropical vibes.',
          address: 'Strada Party 55, Constanta 900001, Romania',
          phone: '+40 241 555 555',
          priceRange: '$$$',
          images: [
            'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800',
          ],
          hours: {
            'Monday': 'Closed',
            'Tuesday': '12:00 PM - 2:00 AM',
            'Wednesday': '12:00 PM - 2:00 AM',
            'Thursday': '12:00 PM - 2:00 AM',
            'Friday': '12:00 PM - 2:00 AM',
            'Saturday': '12:00 PM - 2:00 AM',
            'Sunday': '12:00 PM - 2:00 AM',
          },
          events: [
            { id: 12, name: 'Beach Party Tonight', date: '2025-08-04', dj: 'DJ Neptune', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop' },
          ],
          availableDrinksMenu: [
            { 
              id: 12, 
              name: 'Party Punch', 
              description: 'Tropical party punch', 
              category: 'Cocktail',
              image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
              alcoholContent: '15%',
              volume: '500ml',
              originalPrice: '45 RON'
            }
          ]
        },
        {
          id: 12,
          name: 'Harbor Lights',
          type: 'Bar',
          rating: 4.3,
          reviews: 112,
          lat: 44.1733,
          lng: 28.6383,
          image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
          location: 'CONSTANTA',
          availableDrinks: 51,
          isOpen: true,
          tags: ['Harbor', 'Lights', 'Romantic'],
          openUntil: '12:00 AM',
          crowdLevel: 'Medium',
          filters: ['harbor', 'lights', 'romantic'],
          description: 'Romantic bar with beautiful harbor lights and intimate atmosphere.',
          address: 'Strada Lights 33, Constanta 900001, Romania',
          phone: '+40 241 333 333',
          priceRange: '$$$',
          images: [
            'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
          ],
          hours: {
            'Monday': 'Closed',
            'Tuesday': '5:00 PM - 12:00 AM',
            'Wednesday': '5:00 PM - 12:00 AM',
            'Thursday': '5:00 PM - 12:00 AM',
            'Friday': '5:00 PM - 12:00 AM',
            'Saturday': '5:00 PM - 12:00 AM',
            'Sunday': '5:00 PM - 12:00 AM',
          },
          events: [
            { id: 13, name: 'Harbor Lights Live Music', date: '2025-08-04', dj: 'Local Band', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop' },
          ],
          availableDrinksMenu: [
            { 
              id: 13, 
              name: 'Harbor Lights Special', 
              description: 'Signature cocktail with harbor views', 
              category: 'Cocktail',
              image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
              alcoholContent: '18%',
              volume: '250ml',
              originalPrice: '50 RON'
            }
          ]
        },
        {
          id: 13,
          name: 'Jazz by the Sea',
          type: 'Jazz Club',
          rating: 4.5,
          reviews: 78,
          lat: 44.1733,
          lng: 28.6383,
          image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
          location: 'CONSTANTA',
          availableDrinks: 34,
          isOpen: true,
          tags: ['Jazz', 'Sea', 'Sophisticated'],
          openUntil: '1:00 AM',
          crowdLevel: 'Low',
          filters: ['jazz', 'sea', 'sophisticated'],
          description: 'Intimate jazz club with sea views and live jazz performances.',
          address: 'Strada Jazz 88, Constanta 900001, Romania',
          phone: '+40 241 888 888',
          priceRange: '$$$',
          images: [
            'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
          ],
          hours: {
            'Monday': 'Closed',
            'Tuesday': '7:00 PM - 1:00 AM',
            'Wednesday': '7:00 PM - 1:00 AM',
            'Thursday': '7:00 PM - 1:00 AM',
            'Friday': '7:00 PM - 1:00 AM',
            'Saturday': '7:00 PM - 1:00 AM',
            'Sunday': '7:00 PM - 1:00 AM',
          },
          events: [
            { id: 14, name: 'Jazz & Cocktails Night', date: '2025-08-04', dj: 'Jazz Trio', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop' },
          ],
          availableDrinksMenu: [
            { 
              id: 14, 
              name: 'Sea Jazz', 
              description: 'Jazz-inspired cocktail with sea flavors', 
              category: 'Cocktail',
              image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
              alcoholContent: '20%',
              volume: '200ml',
              originalPrice: '65 RON'
            }
          ]
        },
        {
          id: 14,
          name: 'Sunset Beach Bar',
          type: 'Beach Bar',
          rating: 4.2,
          reviews: 145,
          lat: 44.1733,
          lng: 28.6383,
          image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
          location: 'CONSTANTA',
          availableDrinks: 42,
          isOpen: true,
          tags: ['Sunset', 'Beach', 'Chill'],
          openUntil: '11:00 PM',
          crowdLevel: 'Medium',
          filters: ['sunset', 'beach', 'chill'],
          description: 'Relaxing beach bar perfect for watching the sunset with a cocktail.',
          address: 'Strada Sunset 66, Constanta 900001, Romania',
          phone: '+40 241 666 666',
          priceRange: '$$',
          images: [
            'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800',
          ],
          hours: {
            'Monday': 'Closed',
            'Tuesday': '3:00 PM - 11:00 PM',
            'Wednesday': '3:00 PM - 11:00 PM',
            'Thursday': '3:00 PM - 11:00 PM',
            'Friday': '3:00 PM - 11:00 PM',
            'Saturday': '3:00 PM - 11:00 PM',
            'Sunday': '3:00 PM - 11:00 PM',
          },
          events: [
            { id: 15, name: 'Sunset Cocktails', date: 'Daily', dj: 'Ambient Music', image: 'https://images.unsplash.com/photo-1565035010268-a3816f98589a?w=400&h=300&fit=crop' },
          ],
          availableDrinksMenu: [
            { 
              id: 15, 
              name: 'Sunset Special', 
              description: 'Cocktail with sunset colors', 
              category: 'Cocktail',
              image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
              alcoholContent: '16%',
              volume: '300ml',
              originalPrice: '40 RON'
            }
          ]
        },
        {
          id: 15,
          name: 'Marina Club',
          type: 'Marina Club',
          rating: 4.4,
          reviews: 92,
          lat: 44.1733,
          lng: 28.6383,
          image: 'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=400',
          location: 'CONSTANTA',
          availableDrinks: 58,
          isOpen: true,
          tags: ['Marina', 'Yacht', 'Luxury'],
          openUntil: '2:00 AM',
          crowdLevel: 'High',
          filters: ['marina', 'yacht', 'luxury'],
          description: 'Exclusive marina club with yacht access and premium service.',
          address: 'Strada Marina 77, Constanta 900001, Romania',
          phone: '+40 241 777 777',
          priceRange: '$$$$',
          images: [
            'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=800',
          ],
          hours: {
            'Monday': 'Closed',
            'Tuesday': '6:00 PM - 2:00 AM',
            'Wednesday': '6:00 PM - 2:00 AM',
            'Thursday': '6:00 PM - 2:00 AM',
            'Friday': '6:00 PM - 2:00 AM',
            'Saturday': '6:00 PM - 2:00 AM',
            'Sunday': '6:00 PM - 2:00 AM',
          },
          events: [
            { id: 16, name: 'Yacht Party', date: 'Every Saturday', dj: 'Marina DJ', image: 'https://images.unsplash.com/photo-1565035010268-a3816f98589a?w=400&h=300&fit=crop' },
          ],
          availableDrinksMenu: [
            { 
              id: 16, 
              name: 'Marina Martini', 
              description: 'Premium martini with marina views', 
              category: 'Cocktail',
              image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
              alcoholContent: '25%',
              volume: '200ml',
              originalPrice: '90 RON'
            }
          ]
        },
        {
          id: 16,
          name: 'Folk Pub',
          type: 'Traditional Pub',
          rating: 4.0,
          reviews: 134,
          lat: 44.1733,
          lng: 28.6383,
          image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
          location: 'CONSTANTA',
          availableDrinks: 81,
          isOpen: true,
          tags: ['Folk', 'Traditional', 'Local'],
          openUntil: '12:00 AM',
          crowdLevel: 'Medium',
          filters: ['folk', 'traditional', 'local'],
          description: 'Traditional pub featuring local folk music and authentic Romanian atmosphere.',
          address: 'Strada Folk 44, Constanta 900001, Romania',
          phone: '+40 241 444 444',
          priceRange: '$$',
          images: [
            'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
          ],
          hours: {
            'Monday': 'Closed',
            'Tuesday': '4:00 PM - 12:00 AM',
            'Wednesday': '4:00 PM - 12:00 AM',
            'Thursday': '4:00 PM - 12:00 AM',
            'Friday': '4:00 PM - 12:00 AM',
            'Saturday': '4:00 PM - 12:00 AM',
            'Sunday': '4:00 PM - 12:00 AM',
          },
          events: [
            { id: 17, name: 'Local Folk Night', date: 'Every Thursday', dj: 'Local Musicians', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop' },
          ],
          availableDrinksMenu: [
            { 
              id: 17, 
              name: 'Folk Ale', 
              description: 'Traditional Romanian ale', 
              category: 'Beer',
              image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400',
              alcoholContent: '4.8%',
              volume: '500ml',
              originalPrice: '30 RON'
            }
          ]
        },
        {
          id: 17,
          name: 'Garden Bar',
          type: 'Garden Bar',
          rating: 4.3,
          reviews: 167,
          lat: 44.1733,
          lng: 28.6383,
          image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
          location: 'CONSTANTA',
          availableDrinks: 47,
          isOpen: true,
          tags: ['Garden', 'Outdoor', 'Nature'],
          openUntil: '11:00 PM',
          crowdLevel: 'Low',
          filters: ['garden', 'outdoor', 'nature'],
          description: 'Peaceful garden bar surrounded by nature with fresh cocktails.',
          address: 'Strada Garden 22, Constanta 900001, Romania',
          phone: '+40 241 222 222',
          priceRange: '$$',
          images: [
            'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800',
          ],
          hours: {
            'Monday': 'Closed',
            'Tuesday': '4:00 PM - 11:00 PM',
            'Wednesday': '4:00 PM - 11:00 PM',
            'Thursday': '4:00 PM - 11:00 PM',
            'Friday': '4:00 PM - 11:00 PM',
            'Saturday': '4:00 PM - 11:00 PM',
            'Sunday': '4:00 PM - 11:00 PM',
          },
          events: [
            { id: 18, name: 'Garden Party', date: 'Every Sunday', dj: 'Garden DJ', image: 'https://images.unsplash.com/photo-1565035010268-a3816f98589a?w=400&h=300&fit=crop' },
          ],
          availableDrinksMenu: [
            { 
              id: 18, 
              name: 'Garden Fresh', 
              description: 'Fresh garden cocktail with herbs', 
              category: 'Cocktail',
              image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
              alcoholContent: '14%',
              volume: '300ml',
              originalPrice: '35 RON'
            }
          ]
        }
      ];
      
      localStorage.setItem('barsData', JSON.stringify(this.bars));
      console.log('Loaded real bars data:', this.bars.length, 'bars');
    } catch (error) {
      console.error('Error loading real bars data:', error);
      // Fallback to sample data
      this.loadSampleBarsData();
    }
  }

  // Load real events data from the existing file
  private async loadRealEventsData(): Promise<void> {
    try {
      // For now, we'll use sample data
      // In production, you would import from the real data files
      this.loadSampleEventsData();
      console.log('Loaded events data:', this.events.length, 'events');
    } catch (error) {
      console.error('Error loading real events data:', error);
      // Fallback to sample data
      this.loadSampleEventsData();
    }
  }

  // Fallback sample data
  private loadSampleData(): void {
    this.loadSampleBarsData();
    this.loadSampleEventsData();
  }

  private loadSampleBarsData(): void {
    const sampleBars: Bar[] = [
      {
        id: 1,
        name: "Club A",
        type: "Nightclub",
        rating: 4.5,
        reviews: 120,
        lat: 44.4268,
        lng: 26.1025,
        image: "https://images.unsplash.com/photo-1566733971017-f8f3e6c1a6b0?w=400",
        location: "BUCHAREST",
        availableDrinks: 45,
        isOpen: true,
        tags: ["Electronic", "Live Music", "VIP"],
        openUntil: "4:00 AM",
        crowdLevel: "High",
        filters: ["Electronic", "Live Music"],
        description: "Premier nightclub in Bucharest with state-of-the-art sound system",
        address: "Strada Club A, Nr. 123, București",
        phone: "+40 21 123 4567",
        priceRange: "$$$",
        images: ["https://images.unsplash.com/photo-1566733971017-f8f3e6c1a6b0?w=400"],
        hours: {
          'Monday': 'Closed',
          'Tuesday': 'Closed',
          'Wednesday': '10:00 PM - 3:00 AM',
          'Thursday': '10:00 PM - 3:00 AM',
          'Friday': '10:00 PM - 4:00 AM',
          'Saturday': '10:00 PM - 4:00 AM',
          'Sunday': '10:00 PM - 2:00 AM',
        },
        events: [],
        availableDrinksMenu: []
      },
      {
        id: 2,
        name: "Bar B",
        type: "Bar",
        rating: 4.2,
        reviews: 89,
        lat: 44.4268,
        lng: 26.1025,
        image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400",
        location: "BUCHAREST",
        availableDrinks: 32,
        isOpen: true,
        tags: ["Cocktails", "Chill", "Outdoor"],
        openUntil: "2:00 AM",
        crowdLevel: "Medium",
        filters: ["Cocktails", "Chill"],
        description: "Cozy bar with excellent cocktails and outdoor seating",
        address: "Strada Bar B, Nr. 456, București",
        phone: "+40 21 987 6543",
        priceRange: "$$",
        images: ["https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400"],
        hours: {
          'Monday': '5:00 PM - 12:00 AM',
          'Tuesday': '5:00 PM - 12:00 AM',
          'Wednesday': '5:00 PM - 1:00 AM',
          'Thursday': '5:00 PM - 1:00 AM',
          'Friday': '5:00 PM - 2:00 AM',
          'Saturday': '5:00 PM - 2:00 AM',
          'Sunday': '5:00 PM - 12:00 AM',
        },
        events: [],
        availableDrinksMenu: []
      }
    ];
    this.bars = sampleBars;
    localStorage.setItem('barsData', JSON.stringify(this.bars));
  }

  private loadSampleEventsData(): void {
    const sampleEvents: EventData[] = [
      {
        id: 1,
        name: "Friday Night Electronic",
        description: "Best electronic music night in Bucharest",
        date: "2024-01-15",
        startTime: "22:00",
        endTime: "04:00",
        barId: 1,
        barName: "Club A",
        barLocation: "BUCHAREST",
        barLat: 44.4268,
        barLng: 26.1025,
        dj: "DJ Max",
        genre: "Electronic",
        price: 50,
        ticketPrice: 50,
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        images: ["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"],
        category: "music",
        tags: ["Electronic", "DJ", "Party"],
        capacity: 300,
        attendees: 250,
        interestedCount: 280,
        goingCount: 250,
        isTicketed: true,
        ticketUrl: "https://example.com/tickets",
        status: "upcoming",
        ageRestriction: "18+",
        dressCode: "Smart Casual",
        socialMedia: {
          facebook: "https://facebook.com/event1",
          instagram: "https://instagram.com/event1"
        },
        isPublic: true,
        canGuestsInviteFriends: true,
        hostMessage: "Get ready for an amazing night!",
        discussionEnabled: true,
        photosEnabled: true,
        lastUpdate: "2024-01-10T10:00:00Z",
        views: 1200,
        shares: 45,
        createdBy: "admin",
        coHosts: ["promoter1"],
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-10T10:00:00Z"
      }
    ];
    this.events = sampleEvents;
    localStorage.setItem('eventsData', JSON.stringify(this.events));
  }

  // Bar CRUD operations
  public getBars(): Bar[] {
    return [...this.bars];
  }

  public getBarById(id: number): Bar | undefined {
    return this.bars.find(bar => bar.id === id);
  }

  public async addBar(barData: Omit<Bar, 'id'>): Promise<Bar> {
    const newId = Math.max(...this.bars.map(b => b.id), 0) + 1;
    const newBar: Bar = {
      ...barData,
      id: newId,
      events: [],
      availableDrinksMenu: []
    };
    
    this.bars.push(newBar);
    await this.saveBarsToFile();
    return newBar;
  }

  public async updateBar(id: number, barData: Partial<Bar>): Promise<Bar | null> {
    const index = this.bars.findIndex(bar => bar.id === id);
    if (index === -1) return null;

    this.bars[index] = { ...this.bars[index], ...barData };
    await this.saveBarsToFile();
    return this.bars[index];
  }

  public async deleteBar(id: number): Promise<boolean> {
    const index = this.bars.findIndex(bar => bar.id === id);
    if (index === -1) return false;

    this.bars.splice(index, 1);
    await this.saveBarsToFile();
    return true;
  }

  // Event CRUD operations
  public getEvents(): EventData[] {
    return [...this.events];
  }

  public getEventById(id: number): EventData | undefined {
    return this.events.find(event => event.id === id);
  }

  public async addEvent(eventData: Omit<EventData, 'id' | 'createdAt' | 'updatedAt'>): Promise<EventData> {
    const newId = Math.max(...this.events.map(e => e.id), 0) + 1;
    const now = new Date().toISOString();
    const newEvent: EventData = {
      ...eventData,
      id: newId,
      createdAt: now,
      updatedAt: now
    };
    
    this.events.push(newEvent);
    await this.saveEventsToFile();
    return newEvent;
  }

  public async updateEvent(id: number, eventData: Partial<EventData>): Promise<EventData | null> {
    const index = this.events.findIndex(event => event.id === id);
    if (index === -1) return null;

    this.events[index] = { 
      ...this.events[index], 
      ...eventData,
      updatedAt: new Date().toISOString()
    };
    await this.saveEventsToFile();
    return this.events[index];
  }

  public async deleteEvent(id: number): Promise<boolean> {
    const index = this.events.findIndex(event => event.id === id);
    if (index === -1) return false;

    this.events.splice(index, 1);
    await this.saveEventsToFile();
    return true;
  }

  // File persistence methods
  private async saveBarsToFile(): Promise<void> {
    try {
      // Store in localStorage
      localStorage.setItem('barsData', JSON.stringify(this.bars));
      console.log('Bars data saved to localStorage');
      
      // Note: In a production environment, you would make an API call here
      // to persist the data to your backend/database
    } catch (error) {
      console.error('Error saving bars data:', error);
    }
  }

  private async saveEventsToFile(): Promise<void> {
    try {
      // Store in localStorage
      localStorage.setItem('eventsData', JSON.stringify(this.events));
      console.log('Events data saved to localStorage');
      
      // Note: In a production environment, you would make an API call here
      // to persist the data to your backend/database
    } catch (error) {
      console.error('Error saving events data:', error);
    }
  }

  // Load data from localStorage (fallback)
  public loadFromLocalStorage(): void {
    try {
      const barsData = localStorage.getItem('barsData');
      const eventsData = localStorage.getItem('eventsData');
      
      if (barsData) {
        this.bars = JSON.parse(barsData);
      }
      if (eventsData) {
        this.events = JSON.parse(eventsData);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  // Export data for file download (for development)
  public exportBarsData(): string {
    return JSON.stringify(this.bars, null, 2);
  }

  public exportEventsData(): string {
    return JSON.stringify(this.events, null, 2);
  }

  // Reset to real data (useful for development)
  public async resetToRealData(): Promise<void> {
    localStorage.removeItem('barsData');
    localStorage.removeItem('eventsData');
    await this.initializeData();
  }
}

// Singleton instance
export const dataManager = DataManager.getInstance();
