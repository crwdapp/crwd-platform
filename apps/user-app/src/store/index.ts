import { create } from 'zustand';
import { allBars } from '../data/barsData';
import { Event, EventBookmark, EventAttendance } from '../types/event';

// Helper function to calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

// Helper function to sort bars by city first, then by distance within each city
const sortBarsByCityAndDistance = (bars: Bar[], userLocation: { lat: number; lng: number } | null): Bar[] => {
  if (!userLocation) return bars;
  
  // First, calculate distances and update distance display
  const barsWithDistance = [...bars].map(bar => {
    const distance = calculateDistance(userLocation.lat, userLocation.lng, bar.lat, bar.lng);
    const distanceText = distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
    
    return {
      ...bar,
      distance: distanceText,
      distanceKm: distance, // Keep the numeric distance for sorting
    };
  });
  
  // Group bars by city
  const barsByCity: { [city: string]: Bar[] } = {};
  barsWithDistance.forEach(bar => {
    const city = bar.location;
    if (!barsByCity[city]) {
      barsByCity[city] = [];
    }
    barsByCity[city].push(bar);
  });
  
  // Sort bars within each city by distance
  Object.keys(barsByCity).forEach(city => {
    barsByCity[city].sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  });
  
  // Sort cities by the distance of their closest bar
  const citiesWithClosestDistance = Object.keys(barsByCity).map(city => ({
    city,
    closestDistance: barsByCity[city][0]?.distanceKm || 0
  }));
  
  citiesWithClosestDistance.sort((a, b) => a.closestDistance - b.closestDistance);
  
  // Flatten the sorted cities back into a single array
  const sortedBars: Bar[] = [];
  citiesWithClosestDistance.forEach(({ city }) => {
    sortedBars.push(...barsByCity[city]);
  });
  
  return sortedBars;
};

interface Bar {
  id: number;
  name: string;
  type: string;
  description: string;
  image: string;
  rating: number;
  distance: string;
  distanceKm?: number;
  location: string;
  address: string;
  phone: string;
  priceRange: string;
  isOpen: boolean;
  openUntil: string;
  lat: number;
  lng: number;
  availableDrinks?: number;
}

interface User {
  id: number | null;
  name: string | null;
  avatar: string | null;
  location: { lat: number; lng: number } | null;
  preferences: {
    selectedLocation: string;
    activeFilters: string[];
    viewMode: string;
    barFilterMode: string;
  };
  subscription: {
    status: string;
    plan: string;
    startDate: string;
    nextBilling: string;
  };
  tokens: {
    daily: any[];
    weekly: any[];
    lastDailyReset: string;
    lastWeeklyReset: string;
  };
}

interface UIState {
  searchQuery: string;
  selectedBarId: number | null;
  mapCenter: { lat: number; lng: number } | null;
  isLocationLoading: boolean;
  showLocationPrompt: boolean;
  mapExpanded: boolean;
  currentBarIndex: number;
  activeDrinkFilter: string | null;
}

interface BarsState {
  items: Bar[];
  loading: boolean;
  error: string | null;
  lastFetch: number;
  all: Bar[];
  filtered: Bar[];
}

interface EventsState {
  items: Event[];
  loading: boolean;
  error: string | null;
  bookmarks: EventBookmark[];
  attendance: EventAttendance[];
  viewMode: 'list' | 'map' | 'calendar';
}

interface AppState {
  user: User;
  bars: BarsState;
  events: EventsState;
  ui: UIState;
  getTokenCount: () => { daily: number; weekly: number };
  checkAndResetTokens: () => void;
  useToken: (type: 'daily' | 'weekly') => boolean;
  upgradeToPremium: () => void;
  cancelSubscription: () => void;
  toggleSubscriptionForTesting: () => void;
  initializeTokensForTesting: () => void;
  setBars: (bars: Bar[]) => void;
  setEvents: (events: Event[]) => void;
  setEventsLoading: (loading: boolean) => void;
  setEventsError: (error: string | null) => void;
  setSelectedEvent: (eventId: number | null) => void;
  setEventsViewMode: (mode: 'list' | 'map' | 'calendar') => void;
  updateBarsByDistance: () => void;
  updateBarsByCity: (selectedCity: string) => void;
  updateUserLocation: (location: { lat: number; lng: number }) => void;
  
  // Event interaction methods
  bookmarkEvent: (eventId: number) => void;
  unbookmarkEvent: (eventId: number) => void;
  setEventAttendance: (eventId: number, status: 'going' | 'interested' | 'not_going') => void;
}

// Convert allBars to the format expected by the store
const realBars: Bar[] = allBars.map(bar => ({
  id: bar.id,
  name: bar.name,
  type: bar.type,
  description: bar.description,
  image: bar.images?.[0] || bar.image || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop',
  rating: bar.rating,
  distance: '0.5km', // Default distance
  location: bar.location,
  address: bar.address,
  phone: bar.phone,
  priceRange: bar.priceRange,
  isOpen: bar.isOpen,
  openUntil: bar.openUntil,
  lat: bar.lat,
  lng: bar.lng,
}));

export const useAppStore = create<AppState>((set, get) => ({
  user: {
    id: 1,
    name: 'John Doe',
    avatar: '/default-avatar.png',
    location: null, // Start with no location, will be set by GPS
    preferences: {
      selectedLocation: 'NEAR_ME',
      activeFilters: [],
      viewMode: 'map',
      barFilterMode: 'open_now',
    },
    subscription: {
      status: 'free',
      plan: 'Free Plan',
      startDate: '2024-01-01',
      nextBilling: '2024-02-01',
    },
    tokens: {
      daily: [],
      weekly: [],
      lastDailyReset: '',
      lastWeeklyReset: '',
    },
  },
  bars: {
    items: realBars, // Start with all bars, will be sorted when location is available
    loading: false,
    error: null,
    lastFetch: Date.now(),
  },
  events: {
    items: [],
    loading: false,
    error: null,
    bookmarks: [],
    attendance: [],
    viewMode: 'list',
  },
  ui: {
    searchQuery: '',
    selectedBarId: null,
    mapCenter: null, // Will be set to user's location when available
    isLocationLoading: false,
    showLocationPrompt: false,
    mapExpanded: false,
    currentBarIndex: 0,
    activeDrinkFilter: null,
  },
  getTokenCount: () => {
    const state = get();
    const dailyCount = state.user.tokens.daily.length;
    const weeklyCount = state.user.tokens.weekly.length;
    return { daily: dailyCount, weekly: weeklyCount };
  },
  checkAndResetTokens: () => {
    const state = get();
    const now = new Date();
    const lastDailyReset = state.user.tokens.lastDailyReset ? new Date(state.user.tokens.lastDailyReset) : new Date(0);
    const lastWeeklyReset = state.user.tokens.lastWeeklyReset ? new Date(state.user.tokens.lastWeeklyReset) : new Date(0);
    
    // Reset daily tokens if it's a new day
    if (now.getDate() !== lastDailyReset.getDate() || now.getMonth() !== lastDailyReset.getMonth() || now.getFullYear() !== lastDailyReset.getFullYear()) {
      set(state => ({
        user: {
          ...state.user,
          tokens: {
            ...state.user.tokens,
            daily: Array(3).fill({ id: Date.now(), used: false }),
            lastDailyReset: now.toISOString(),
          },
        },
      }));
    }
    
    // Reset weekly tokens if it's a new week
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    if (lastWeeklyReset < weekStart) {
      set(state => ({
        user: {
          ...state.user,
          tokens: {
            ...state.user.tokens,
            weekly: Array(2).fill({ id: Date.now(), used: false }),
            lastWeeklyReset: now.toISOString(),
          },
        },
      }));
    }
  },
  useToken: (type: 'daily' | 'weekly') => {
    const state = get();
    const tokens = state.user.tokens[type];
    const availableToken = tokens.find((token: any) => !token.used);
    
    if (availableToken) {
      set(state => ({
        user: {
          ...state.user,
          tokens: {
            ...state.user.tokens,
            [type]: state.user.tokens[type].map((token: any) =>
              token.id === availableToken.id ? { ...token, used: true } : token
            ),
          },
        },
      }));
      return true;
    }
    return false;
  },
  upgradeToPremium: () => {
    set(state => ({
      user: {
        ...state.user,
        subscription: {
          status: 'premium',
          plan: 'Premium Plan',
          startDate: new Date().toISOString(),
          nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      },
    }));
  },
  cancelSubscription: () => {
    set(state => ({
      user: {
        ...state.user,
        subscription: {
          status: 'free',
          plan: 'Free Plan',
          startDate: '',
          nextBilling: '',
        },
      },
    }));
  },
  toggleSubscriptionForTesting: () => {
    const state = get();
    if (state.user.subscription.status === 'premium') {
      get().cancelSubscription();
    } else {
      get().upgradeToPremium();
    }
  },
  initializeTokensForTesting: () => {
    set(state => ({
      user: {
        ...state.user,
        tokens: {
          daily: Array(3).fill({ id: Date.now(), used: false }),
          weekly: Array(2).fill({ id: Date.now(), used: false }),
          lastDailyReset: new Date().toISOString(),
          lastWeeklyReset: new Date().toISOString(),
        },
      },
    }));
  },
  setBars: (bars: Bar[]) => {
    set(state => ({
      bars: {
        ...state.bars,
        items: bars,
        lastFetch: Date.now(),
      },
    }));
  },
  setEvents: (events: any[]) => {
    set(state => ({
      events: {
        ...state.events,
        items: events,
      },
    }));
  },
  setEventsLoading: (loading: boolean) => {
    set(state => ({
      events: {
        ...state.events,
        loading,
      },
    }));
  },
  setEventsError: (error: string | null) => {
    set(state => ({
      events: {
        ...state.events,
        error,
      },
    }));
  },
  setSelectedEvent: (eventId: number | null) => {
    // Implementation for selected event
  },
  setEventsViewMode: (mode: string) => {
    // Implementation for events view mode
  },
  updateBarsByDistance: () => {
    const state = get();
    const sortedBars = sortBarsByCityAndDistance(realBars, state.user.location);
    console.log('📍 Bars sorted by city and distance:', sortedBars.map(bar => `${bar.name} (${bar.location}): ${bar.distance}`));
    set(state => ({
      bars: {
        ...state.bars,
        items: sortedBars,
        lastFetch: Date.now(),
      },
    }));
  },
  updateBarsByCity: (selectedCity: string) => {
    const state = get();
    let filteredBars = [...realBars];
    
    if (selectedCity === 'NEAR_ME') {
      // For "Near you", find the closest city to user's location
      if (state.user.location) {
        const citiesWithDistance = realBars.reduce((acc, bar) => {
          const distance = calculateDistance(
            state.user.location!.lat,
            state.user.location!.lng,
            bar.lat,
            bar.lng
          );
          
          if (!acc[bar.location]) {
            acc[bar.location] = { distance, bars: [] };
          }
          acc[bar.location].bars.push(bar);
          
          return acc;
        }, {} as Record<string, { distance: number; bars: Bar[] }>);
        
        // Find the city with the closest bar
        const closestCity = Object.entries(citiesWithDistance).reduce((closest, [city, data]) => {
          return data.distance < closest.distance ? { city, distance: data.distance } : closest;
        }, { city: '', distance: Infinity });
        
        // Filter bars from the closest city
        if (closestCity.city) {
          filteredBars = realBars.filter(bar => bar.location === closestCity.city);
          console.log('📍 Showing bars from closest city:', closestCity.city, 'Distance:', closestCity.distance.toFixed(1), 'km');
        }
      }
    } else if (selectedCity && selectedCity !== 'ALL') {
      // Filter by specific city
      filteredBars = filteredBars.filter(bar => bar.location === selectedCity);
    }
    // For 'ALL', keep all bars (filteredBars = [...realBars])
    
    // Sort by distance within the selected city
    const sortedBars = sortBarsByCityAndDistance(filteredBars, state.user.location);
    console.log('📍 Bars filtered by city:', selectedCity, 'Count:', sortedBars.length);
    
    set(state => ({
      bars: {
        ...state.bars,
        items: sortedBars,
        lastFetch: Date.now(),
      },
    }));
  },
  updateUserLocation: (location: { lat: number; lng: number }) => {
    const state = get();
    console.log('📍 Updating user location to:', location);
    
    set(state => ({
      user: {
        ...state.user,
        location: location,
      },
      ui: {
        ...state.ui,
        mapCenter: location,
      },
    }));
    
    // Automatically update bars based on current selection
    const currentSelection = state.user.preferences.selectedLocation;
    if (currentSelection === 'NEAR_ME') {
      // Update bars to show closest city
      get().updateBarsByCity('NEAR_ME');
    } else {
      // Re-sort existing bars with new location
      get().updateBarsByDistance();
    }
  },
  
  // Event interaction methods
  bookmarkEvent: (eventId) => set((state) => {
    const userId = state.user.id;
    if (userId && !state.events.bookmarks.find(b => b.eventId === eventId && b.userId === userId.toString())) {
      return {
        events: {
          ...state.events,
          bookmarks: [
            ...state.events.bookmarks,
            {
              id: Date.now(),
              userId: userId.toString(),
              eventId,
              createdAt: new Date().toISOString()
            }
          ]
        }
      };
    }
    return state;
  }),

  unbookmarkEvent: (eventId) => set((state) => {
    const userId = state.user.id;
    if (userId) {
      return {
        events: {
          ...state.events,
          bookmarks: state.events.bookmarks.filter(
            b => !(b.eventId === eventId && b.userId === userId.toString())
          )
        }
      };
    }
    return state;
  }),

  setEventAttendance: (eventId, status) => set((state) => {
    const userId = state.user.id;
    if (userId) {
      const existingAttendanceIndex = state.events.attendance.findIndex(
        a => a.eventId === eventId && a.userId === userId.toString()
      );
      
      if (existingAttendanceIndex !== -1) {
        // Update existing attendance
        const updatedAttendance = [...state.events.attendance];
        updatedAttendance[existingAttendanceIndex] = {
          ...updatedAttendance[existingAttendanceIndex],
          status
        };
        return {
          events: {
            ...state.events,
            attendance: updatedAttendance
          }
        };
      } else {
        // Add new attendance
        return {
          events: {
            ...state.events,
            attendance: [
              ...state.events.attendance,
              {
                id: Date.now(),
                userId: userId.toString(),
                eventId,
                status,
                createdAt: new Date().toISOString()
              }
            ]
          }
        };
      }
    }
    return state;
  }),
}));

// Initialize store and ensure it's ready
export const initializeStore = () => {
  try {
    const store = useAppStore.getState();
    console.log('✅ Store initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Store initialization failed:', error);
    return false;
  }
};

// Auto-initialize store with retry mechanism
let storeReady = false;

const initStore = () => {
  let attempts = 0;
  const maxAttempts = 5;
  
  const tryInit = () => {
    attempts++;
    try {
      const store = useAppStore.getState();
      if (store && typeof store.updateUserLocation === 'function') {
        console.log('✅ Store initialized successfully on attempt', attempts);
        storeReady = true;
        return true;
      } else {
        console.warn(`⚠️ Store not ready on attempt ${attempts}/${maxAttempts}`);
        if (attempts < maxAttempts) {
          setTimeout(tryInit, 200);
        } else {
          console.error('❌ Failed to initialize store after', maxAttempts, 'attempts');
        }
        return false;
      }
    } catch (error) {
      console.error('❌ Store initialization error on attempt', attempts, ':', error);
      if (attempts < maxAttempts) {
        setTimeout(tryInit, 200);
      }
      return false;
    }
  };
  
  tryInit();
};

// Export store readiness check
export const isStoreReady = () => storeReady;

initStore();
