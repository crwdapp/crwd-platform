// Enhanced state management with Supabase integration
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Event, EventFilter, EventBookmark, EventAttendance } from '../types/event';
import { supabase } from '../lib/supabase';
import { authService, tokenService, eventService, barService } from '../services/api';

export interface Review {
  id: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  barId: number;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  isHelpful?: boolean;
}

export interface Token {
  id: string;
  type: 'daily' | 'weekly';
  used: boolean;
  usedAt?: string;
  usedAtBarId?: number;
  expiresAt: string;
  createdAt: string;
}

export interface AppState {
  // User state
  user: {
    id: string | null;
    name: string | null;
    avatar: string | null;
    location: { lat: number; lng: number } | null;
    preferences: {
      selectedLocation: string;
      activeFilters: string[];
      viewMode: 'map' | 'list';
      barFilterMode: 'open_now' | 'all_bars' | 'events_today'; // Bar filtering mode
    };
    subscription: {
      status: 'free' | 'premium';
      plan: string;
      startDate: string;
      nextBilling: string;
    };
    tokens: {
      daily: Token[];
      weekly: Token[];
      lastDailyReset: string;
      lastWeeklyReset: string;
    };
  };
  
  // Data state
  bars: {
    items: any[];
    loading: boolean;
    error: string | null;
    lastFetch: number;
    cache: Map<string, any>;
  };

  // Reviews state
  reviews: {
    items: Review[];
    loading: boolean;
    error: string | null;
  };

  // Events state
  events: {
    items: Event[];
    loading: boolean;
    error: string | null;
    filters: EventFilter;
    selectedEventId: number | null;
    bookmarks: EventBookmark[];
    attendance: EventAttendance[];
    viewMode: 'list' | 'map' | 'calendar';
  };
  
  // UI state
  ui: {
    mapExpanded: boolean;
    searchQuery: string;
    selectedBarId: number | null;
    currentBarIndex: number;
    mapCenter: { lat: number; lng: number } | null;
    showReviewModal: boolean;
    isLocationLoading: boolean;
    showLocationPrompt: boolean;
    isMapAnimating: boolean;
  };

  // Actions
  setUserLocation: (location: { lat: number; lng: number }) => void;
  setBars: (bars: any[]) => void;
  setMapCenter: (center: { lat: number; lng: number }) => void;
  setSelectedBar: (barId: number | null) => void;
  setMapExpanded: (expanded: boolean) => void;
  setSearchQuery: (query: string) => void;
  setCurrentBarIndex: (index: number) => void;
  setShowReviewModal: (show: boolean) => void;
  addReview: (review: Review) => void;
  toggleReviewHelpful: (reviewId: number) => void;
  
  // Token actions
  initializeTokens: () => void;
  useToken: (tokenId: string, barId: number) => void;
  getAvailableTokens: () => { daily: Token[]; weekly: Token[] };
  getTokenCount: () => { daily: number; weekly: number };
  checkAndResetTokens: () => void;
  upgradeToPremium: () => void;
  cancelSubscription: () => void;
  
  // Testing functions for development
  toggleSubscriptionForTesting: () => void;
  initializeTokensForTesting: () => void;
  
  // Supabase integration methods
  initializeUser: (userId: string) => Promise<void>;
      generateTokenCode: (barId: string, userLocation: { lat: number; lng: number }) => Promise<string>;
  loadEvents: (city?: string, filters?: any) => Promise<void>;
  interactWithEvent: (eventId: string, interactionType: 'bookmark' | 'interested' | 'going') => Promise<void>;
  loadUserEvents: () => Promise<void>;
  loadTrendingEvents: () => Promise<void>;
  
  // Event actions
  setEvents: (events: Event[]) => void;
  setEventsLoading: (loading: boolean) => void;
  setEventsError: (error: string | null) => void;
  setEventFilters: (filters: Partial<EventFilter>) => void;
  setSelectedEvent: (eventId: number | null) => void;
  setEventsViewMode: (mode: 'list' | 'map' | 'calendar') => void;
  bookmarkEvent: (eventId: number) => void;
  unbookmarkEvent: (eventId: number) => void;
  setEventAttendance: (eventId: number, status: 'going' | 'interested' | 'not_going') => void;
  
  // Bar owner event actions
  createEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (eventId: number, updates: Partial<Event>) => void;
  deleteEvent: (eventId: number) => void;
  getBarEvents: (barId: number) => Event[];
}

export const useAppStore = create<AppState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      user: {
        id: 'user_123', // Set a default user ID so bookmark functionality works
        name: 'John Doe',
        avatar: null,
        location: null,
        preferences: {
          selectedLocation: 'NEAR_ME',
          activeFilters: ['open_now'],
          viewMode: 'map',
          barFilterMode: 'open_now' // Default to open now
        },
        subscription: {
          status: 'free',
          plan: 'Free Plan',
          startDate: '',
          nextBilling: ''
        },
        tokens: {
          daily: [],
          weekly: [],
          lastDailyReset: '',
          lastWeeklyReset: ''
        }
      },
      bars: {
        items: [],
        loading: false,
        error: null,
        lastFetch: 0,
        cache: new Map()
      },
      reviews: {
        items: [
          // Mock reviews data
          {
            id: 1,
            userId: 'user_456',
            userName: 'Alex M.',
            barId: 1,
            rating: 5,
            comment: 'Amazing electronic music venue! The sound system is incredible and the atmosphere is electric. Perfect for a night out with friends.',
            date: '2024-01-15',
            helpful: 12,
            isHelpful: false
          },
          {
            id: 2,
            userId: 'user_789',
            userName: 'Maria S.',
            barId: 1,
            rating: 4,
            comment: 'Great club with excellent DJs. Can get quite crowded on weekends but that adds to the energy. Drinks are reasonably priced.',
            date: '2024-01-10',
            helpful: 8,
            isHelpful: false
          },
          {
            id: 3,
            userId: 'user_101',
            userName: 'David R.',
            barId: 2,
            rating: 5,
            comment: 'Stunning rooftop views of Bucharest! The cocktails are expertly crafted and the service is top-notch. Perfect for special occasions.',
            date: '2024-01-12',
            helpful: 15,
            isHelpful: false
          }
        ],
        loading: false,
        error: null
      },

      events: {
        items: [],
        loading: false,
        error: null,
        filters: {},
        selectedEventId: null,
        bookmarks: [],
        attendance: [],
        viewMode: 'list'
      },
      ui: {
        mapExpanded: false,
        searchQuery: '',
        selectedBarId: null,
        currentBarIndex: 0,
        mapCenter: null,
        showReviewModal: false,
        isLocationLoading: false,
        showLocationPrompt: false,
        isMapAnimating: false
      },

      // Actions
      setUserLocation: (location) => set((state) => {
        state.user.location = location;
        state.ui.mapCenter = location; // This is key - set map center to user location
        
        console.log('User location updated in store:', location);
      }),

      setBars: (bars) => set((state) => {
        state.bars.items = bars;
        state.bars.lastFetch = Date.now();
      }),

      setMapCenter: (center) => set((state) => {
        state.ui.mapCenter = center;
      }),

      setSelectedBar: (barId) => set((state) => {
        state.ui.selectedBarId = barId;
      }),

      setMapExpanded: (expanded) => set((state) => {
        state.ui.mapExpanded = expanded;
      }),

      setSearchQuery: (query) => set((state) => {
        state.ui.searchQuery = query;
      }),

      setCurrentBarIndex: (index) => set((state) => {
        state.ui.currentBarIndex = index;
      }),

      setShowReviewModal: (show) => set((state) => {
        state.ui.showReviewModal = show;
      }),

      addReview: (review) => set((state) => {
        state.reviews.items.unshift(review);
      }),

      toggleReviewHelpful: (reviewId) => set((state) => {
        const review = state.reviews.items.find(r => r.id === reviewId);
        if (review) {
          if (review.isHelpful) {
            review.helpful -= 1;
            review.isHelpful = false;
          } else {
            review.helpful += 1;
            review.isHelpful = true;
          }
        }
      }),

      // Token actions
      initializeTokens: () => set((state) => {
        const now = new Date();
        
        // Only initialize tokens if user has premium subscription
        if (state.user.subscription.status !== 'premium') {
          console.log('🎫 No tokens available for free user');
          state.user.tokens.daily = [];
          state.user.tokens.weekly = [];
          state.user.tokens.lastDailyReset = now.toISOString();
          state.user.tokens.lastWeeklyReset = now.toISOString();
          return;
        }

        // Generate 4 daily tokens that expire at midday tomorrow
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0); // Reset at midday (noon)

        const dailyTokens: Token[] = [];
        for (let i = 0; i < 4; i++) {
          dailyTokens.push({
            id: `daily_${Date.now()}_${i}`,
            type: 'daily',
            used: false,
            expiresAt: tomorrow.toISOString(),
            createdAt: now.toISOString()
          });
        }

        // Generate 1 weekly token that expires next Monday at midday
        const nextMonday = new Date(now);
        const daysUntilMonday = (8 - nextMonday.getDay()) % 7;
        nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
        nextMonday.setHours(12, 0, 0, 0); // Reset at midday (noon)

        const weeklyTokens: Token[] = [{
          id: `weekly_${Date.now()}`,
          type: 'weekly',
          used: false,
          expiresAt: nextMonday.toISOString(),
          createdAt: now.toISOString()
        }];

        state.user.tokens.daily = dailyTokens;
        state.user.tokens.weekly = weeklyTokens;
        state.user.tokens.lastDailyReset = now.toISOString();
        state.user.tokens.lastWeeklyReset = now.toISOString();

        console.log('🎫 Tokens initialized for premium user:', {
          daily: dailyTokens.length,
          weekly: weeklyTokens.length,
          dailyExpires: tomorrow.toISOString(),
          weeklyExpires: nextMonday.toISOString()
        });
      }),

      useToken: (tokenId, barId) => set((state) => {
        // Find token in both daily and weekly arrays
        let token = state.user.tokens.daily.find(t => t.id === tokenId);
        if (!token) {
          token = state.user.tokens.weekly.find(t => t.id === tokenId);
        }
        
        if (token && !token.used) {
          token.used = true;
          token.usedAt = new Date().toISOString();
          token.usedAtBarId = barId;
          console.log(`✅ Token ${tokenId} (${token.type}) used at bar ${barId}`);
        } else if (token && token.used) {
          console.log(`❌ Token ${tokenId} already used`);
        } else {
          console.log(`❌ Token ${tokenId} not found`);
        }
      }),

      getAvailableTokens: () => ({
        daily: get().user.tokens.daily.filter(t => !t.used),
        weekly: get().user.tokens.weekly.filter(t => !t.used)
      }),

      getTokenCount: () => ({
        daily: get().user.tokens.daily.filter(t => !t.used).length,
        weekly: get().user.tokens.weekly.filter(t => !t.used).length
      }),

      checkAndResetTokens: () => set((state) => {
        // Only reset tokens if user has premium subscription
        if (state.user.subscription.status !== 'premium') {
          return;
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayMidday = new Date(today);
        todayMidday.setHours(12, 0, 0, 0);

        // Check if daily tokens need reset (every day at midday)
        const lastDailyReset = new Date(state.user.tokens.lastDailyReset);
        const lastDailyResetDate = new Date(lastDailyReset.getFullYear(), lastDailyReset.getMonth(), lastDailyReset.getDate());
        const lastDailyResetMidday = new Date(lastDailyResetDate);
        lastDailyResetMidday.setHours(12, 0, 0, 0);

        if (todayMidday > lastDailyResetMidday) {
          // Reset daily tokens
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(12, 0, 0, 0);

          const dailyTokens: Token[] = [];
          for (let i = 0; i < 4; i++) {
            dailyTokens.push({
              id: `daily_${Date.now()}_${i}`,
              type: 'daily',
              used: false,
              expiresAt: tomorrow.toISOString(),
              createdAt: now.toISOString()
            });
          }

          state.user.tokens.daily = dailyTokens;
          state.user.tokens.lastDailyReset = now.toISOString();
          console.log('🔄 Daily tokens reset');
        }

        // Check if weekly tokens need reset (every Monday at midday)
        const lastWeeklyReset = new Date(state.user.tokens.lastWeeklyReset);
        const lastWeeklyResetDate = new Date(lastWeeklyReset.getFullYear(), lastWeeklyReset.getMonth(), lastWeeklyReset.getDate());
        const lastWeeklyResetMidday = new Date(lastWeeklyResetDate);
        lastWeeklyResetMidday.setHours(12, 0, 0, 0);

        const daysSinceLastWeeklyReset = Math.floor((todayMidday.getTime() - lastWeeklyResetMidday.getTime()) / (1000 * 60 * 60 * 24));
        const shouldResetWeekly = daysSinceLastWeeklyReset >= 7;

        if (shouldResetWeekly) {
          // Reset weekly tokens
          const nextMonday = new Date(now);
          const daysUntilMonday = (8 - nextMonday.getDay()) % 7;
          nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
          nextMonday.setHours(12, 0, 0, 0);

          const weeklyTokens: Token[] = [{
            id: `weekly_${Date.now()}`,
            type: 'weekly',
            used: false,
            expiresAt: nextMonday.toISOString(),
            createdAt: now.toISOString()
          }];

          state.user.tokens.weekly = weeklyTokens;
          state.user.tokens.lastWeeklyReset = now.toISOString();
          console.log('🔄 Weekly tokens reset');
        }
      }),

      upgradeToPremium: () => set((state) => {
        state.user.subscription.status = 'premium';
        state.user.subscription.plan = 'premium';
        state.user.subscription.startDate = new Date().toISOString();
        state.user.subscription.nextBilling = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now
        
        // Initialize tokens for the new premium user
        const now = new Date();
        
        // Generate 4 daily tokens that expire at midday tomorrow
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0);

        const dailyTokens: Token[] = [];
        for (let i = 0; i < 4; i++) {
          dailyTokens.push({
            id: `daily_${Date.now()}_${i}`,
            type: 'daily',
            used: false,
            expiresAt: tomorrow.toISOString(),
            createdAt: now.toISOString()
          });
        }

        // Generate 1 weekly token that expires next Monday at midday
        const nextMonday = new Date(now);
        const daysUntilMonday = (8 - nextMonday.getDay()) % 7;
        nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
        nextMonday.setHours(12, 0, 0, 0);

        const weeklyTokens: Token[] = [{
          id: `weekly_${Date.now()}`,
          type: 'weekly',
          used: false,
          expiresAt: nextMonday.toISOString(),
          createdAt: now.toISOString()
        }];

        state.user.tokens.daily = dailyTokens;
        state.user.tokens.weekly = weeklyTokens;
        state.user.tokens.lastDailyReset = now.toISOString();
        state.user.tokens.lastWeeklyReset = now.toISOString();

        console.log('🎉 User upgraded to premium with tokens:', {
          daily: dailyTokens.length,
          weekly: weeklyTokens.length
        });
      }),

      cancelSubscription: () => set((state) => {
        state.user.subscription.status = 'free';
        state.user.subscription.plan = 'free';
        state.user.tokens.daily = [];
        state.user.tokens.weekly = [];
        console.log('❌ Subscription cancelled, tokens removed');
      }),

      // Testing functions for development
      toggleSubscriptionForTesting: () => set((state) => {
        if (state.user.subscription.status === 'free') {
          state.user.subscription.status = 'premium';
          state.user.subscription.plan = 'premium';
          state.user.subscription.startDate = new Date().toISOString();
          state.user.subscription.nextBilling = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          
          // Initialize tokens
          const now = new Date();
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(12, 0, 0, 0);

          const dailyTokens: Token[] = [];
          for (let i = 0; i < 4; i++) {
            dailyTokens.push({
              id: `daily_${Date.now()}_${i}`,
              type: 'daily',
              used: false,
              expiresAt: tomorrow.toISOString(),
              createdAt: now.toISOString()
            });
          }

          const nextMonday = new Date(now);
          const daysUntilMonday = (8 - nextMonday.getDay()) % 7;
          nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
          nextMonday.setHours(12, 0, 0, 0);

          const weeklyTokens: Token[] = [{
            id: `weekly_${Date.now()}`,
            type: 'weekly',
            used: false,
            expiresAt: nextMonday.toISOString(),
            createdAt: now.toISOString()
          }];

          state.user.tokens.daily = dailyTokens;
          state.user.tokens.weekly = weeklyTokens;
          state.user.tokens.lastDailyReset = now.toISOString();
          state.user.tokens.lastWeeklyReset = now.toISOString();

          console.log('🎉 Switched to premium with tokens:', {
            daily: dailyTokens.length,
            weekly: weeklyTokens.length
          });
        } else {
          state.user.subscription.status = 'free';
          state.user.subscription.plan = 'free';
          state.user.tokens.daily = [];
          state.user.tokens.weekly = [];
          console.log('❌ Switched to free, tokens removed');
        }
      }),

      initializeTokensForTesting: () => set((state) => {
        if (state.user.subscription.status !== 'premium') {
          console.log('❌ Cannot initialize tokens for free user');
          return;
        }

        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0);

        const dailyTokens: Token[] = [];
        for (let i = 0; i < 4; i++) {
          dailyTokens.push({
            id: `daily_${Date.now()}_${i}`,
            type: 'daily',
            used: false,
            expiresAt: tomorrow.toISOString(),
            createdAt: now.toISOString()
          });
        }

        const nextMonday = new Date(now);
        const daysUntilMonday = (8 - nextMonday.getDay()) % 7;
        nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
        nextMonday.setHours(12, 0, 0, 0);

        const weeklyTokens: Token[] = [{
          id: `weekly_${Date.now()}`,
          type: 'weekly',
          used: false,
          expiresAt: nextMonday.toISOString(),
          createdAt: now.toISOString()
        }];

        state.user.tokens.daily = dailyTokens;
        state.user.tokens.weekly = weeklyTokens;
        state.user.tokens.lastDailyReset = now.toISOString();
        state.user.tokens.lastWeeklyReset = now.toISOString();

        console.log('🎫 Tokens initialized for testing:', {
          daily: dailyTokens.length,
          weekly: weeklyTokens.length
        });
      }),

      // Event actions
      setEvents: (events) => set((state) => {
        state.events.items = events;
        state.events.loading = false;
        state.events.error = null;
      }),

      setEventsLoading: (loading) => set((state) => {
        state.events.loading = loading;
      }),

      setEventsError: (error) => set((state) => {
        state.events.error = error;
        state.events.loading = false;
      }),

      setEventFilters: (filters) => set((state) => {
        state.events.filters = { ...state.events.filters, ...filters };
      }),

      setSelectedEvent: (eventId) => set((state) => {
        state.events.selectedEventId = eventId;
      }),

      setEventsViewMode: (mode) => set((state) => {
        state.events.viewMode = mode;
      }),

      bookmarkEvent: (eventId) => set((state) => {
        const userId = state.user.id;
        if (userId && !state.events.bookmarks.find(b => b.eventId === eventId && b.userId === userId)) {
          state.events.bookmarks.push({
            id: Date.now(),
            userId,
            eventId,
            createdAt: new Date().toISOString()
          });
        }
      }),

      unbookmarkEvent: (eventId) => set((state) => {
        const userId = state.user.id;
        if (userId) {
          state.events.bookmarks = state.events.bookmarks.filter(
            b => !(b.eventId === eventId && b.userId === userId)
          );
        }
      }),

      setEventAttendance: (eventId, status) => set((state) => {
        const userId = state.user.id;
        if (userId) {
          const existingAttendance = state.events.attendance.find(
            a => a.eventId === eventId && a.userId === userId
          );
          
          if (existingAttendance) {
            existingAttendance.status = status;
          } else {
            state.events.attendance.push({
              id: Date.now(),
              userId,
              eventId,
              status,
              createdAt: new Date().toISOString()
            });
          }
        }
      }),

      // Bar owner event actions
      createEvent: (eventData) => set((state) => {
        const newEvent: Event = {
          ...eventData,
          id: Date.now(),
          attendees: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        state.events.items.push(newEvent);
      }),

      updateEvent: (eventId, updates) => set((state) => {
        const eventIndex = state.events.items.findIndex(e => e.id === eventId);
        if (eventIndex !== -1) {
          state.events.items[eventIndex] = {
            ...state.events.items[eventIndex],
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
      }),

      deleteEvent: (eventId) => set((state) => {
        state.events.items = state.events.items.filter(e => e.id !== eventId);
        // Also remove related bookmarks and attendance
        state.events.bookmarks = state.events.bookmarks.filter(b => b.eventId !== eventId);
        state.events.attendance = state.events.attendance.filter(a => a.eventId !== eventId);
      }),

      getBarEvents: (barId) => get().events.items.filter(event => event.barId === barId),

      // Supabase integration methods
      async initializeUser(userId: string) {
        try {
          // Get user profile
          const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single()
          
          // Get user tokens
          const tokens = await tokenService.getUserTokens(userId)
          
          set((state) => {
            state.user.id = userId
            state.user.name = user?.name || null
            state.user.avatar = user?.avatar_url || null
            state.user.subscription.status = user?.subscription_status || 'free'
            
            // Organize tokens
            state.user.tokens.daily = tokens.filter(t => t.token_type === 'daily')
            state.user.tokens.weekly = tokens.filter(t => t.token_type === 'weekly')
          })
        } catch (error) {
          console.error('Failed to initialize user:', error)
        }
      },

      async checkAndResetTokensSupabase() {
        const userId = get().user.id
        if (!userId) return
        
        try {
          await tokenService.checkAndResetTokens(userId)
          // Refresh tokens
          const tokens = await tokenService.getUserTokens(userId)
          
          set((state) => {
            state.user.tokens.daily = tokens.filter(t => t.token_type === 'daily')
            state.user.tokens.weekly = tokens.filter(t => t.token_type === 'weekly')
          })
        } catch (error) {
          console.error('Failed to check and reset tokens:', error)
        }
      },

      async generateTokenCode(barId: string, userLocation: { lat: number; lng: number }) {
        const userId = get().user.id
        if (!userId) throw new Error('User not authenticated')
        
        try {
          const code = await tokenService.generateTokenCode(userId, barId, userLocation)
          return code
        } catch (error) {
          console.error('Failed to generate token code:', error)
          throw error
        }
      },

      async loadEvents(city?: string, filters?: any) {
        try {
          set((state) => { state.events.loading = true })
          const events = await eventService.getEvents(city, filters)
          set((state) => {
            state.events.items = events
            state.events.loading = false
          })
        } catch (error) {
          console.error('Failed to load events:', error)
          set((state) => {
            state.events.error = 'Failed to load events'
            state.events.loading = false
          })
        }
      },

      async interactWithEvent(eventId: string, interactionType: 'bookmark' | 'interested' | 'going') {
        const userId = get().user.id
        if (!userId) return
        
        try {
          await eventService.interactWithEvent(userId, eventId, interactionType)
          
          // Update local state
          if (interactionType === 'bookmark') {
            get().bookmarkEvent(parseInt(eventId))
          } else {
            get().setEventAttendance(parseInt(eventId), interactionType)
          }
        } catch (error) {
          console.error('Failed to interact with event:', error)
        }
      },

      async loadUserEvents() {
        const userId = get().user.id
        if (!userId) return
        
        try {
          const userEvents = await eventService.getUserEvents(userId)
          set((state) => {
            state.events.items = userEvents.map(ue => ue.events as unknown as Event)
          })
        } catch (error) {
          console.error('Failed to load user events:', error)
        }
      },

      async loadTrendingEvents() {
        try {
          const trendingEvents = await eventService.getTrendingEvents()
          set((state) => {
            state.events.items = trendingEvents
          })
        } catch (error) {
          console.error('Failed to load trending events:', error)
        }
      }
    }))
  )
);