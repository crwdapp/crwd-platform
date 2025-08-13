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
  drinksServedToday: number;
  totalTokensRedeemed: number;
  lastUpdated: string;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  barId: number;
  barName: string;
  barLocation: string;
  barLat: number;
  barLng: number;
  dj?: string;
  genre?: string;
  price: number;
  ticketPrice?: number;
  image: string;
  images: string[];
  category: EventCategory;
  tags: string[];
  capacity: number;
  attendees: number;
  interestedCount: number;
  goingCount: number;
  isTicketed: boolean;
  ticketUrl?: string;
  status: EventStatus;
  ageRestriction?: string;
  dressCode?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  isPublic: boolean;
  canGuestsInviteFriends: boolean;
  hostMessage?: string;
  discussionEnabled: boolean;
  photosEnabled: boolean;
  lastUpdate?: string;
  views: number;
  shares: number;
  createdBy: string;
  coHosts?: string[];
  createdAt: string;
  updatedAt: string;
}

export enum EventCategory {
  PARTY = 'party',
  CONCERT = 'concert',
  SPORTS = 'sports',
  CULTURAL = 'cultural',
  BUSINESS = 'business',
  OTHER = 'other'
}

export enum EventStatus {
  DRAFT = 'draft',
  UPCOMING = 'upcoming',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Campaign {
  id: number;
  name: string;
  description: string;
  barId: number;
  barName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  drinks: CampaignDrink[];
  totalTokens: number;
  redeemedTokens: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignDrink {
  id: number;
  name: string;
  quantity: number;
  category: string;
  originalPrice: string;
  discountedPrice?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  location?: {
    lat: number;
    lng: number;
  };
  city?: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Token {
  id: string;
  type: 'daily' | 'weekly';
  isUsed: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface AdminStats {
  totalBars: number;
  activeEvents: number;
  totalUsers: number;
  tokenRedemptions: number;
  totalRevenue: number;
  activeCampaigns: number;
}
