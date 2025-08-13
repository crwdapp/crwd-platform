export interface Event {
  id: string;
  title: string;
  description: string;
  barId: string;
  barName: string;
  startDate: Date;
  endDate: Date;
  location: string;
  images: string[];
  tags: string[];
  isFree: boolean;
  price?: number;
  currency?: string;
  maxAttendees?: number;
  currentAttendees: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  organizerId: string;
  organizerName: string;
  category: EventCategory;
  status: EventStatus;
}

export type EventCategory = 
  | 'live-music'
  | 'dance-party'
  | 'sports'
  | 'comedy'
  | 'food-tasting'
  | 'cocktail-masterclass'
  | 'networking'
  | 'themed-night'
  | 'other';

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

export interface EventSearchFilters {
  location?: {
    latitude: number;
    longitude: number;
    radius?: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
  category?: EventCategory[];
  isFree?: boolean;
  priceRange?: {
    min?: number;
    max?: number;
  };
  tags?: string[];
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  registeredAt: Date;
  status: 'confirmed' | 'waitlist' | 'cancelled';
  numberOfTickets: number;
}
