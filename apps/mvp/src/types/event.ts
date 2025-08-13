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
  // Facebook-like features
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

export interface EventComment {
  id: number;
  eventId: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  replies?: EventComment[];
  likes: number;
  isLikedByUser: boolean;
}

export interface EventUpdate {
  id: number;
  eventId: number;
  title: string;
  content: string;
  timestamp: string;
  isFromHost: boolean;
  type: 'announcement' | 'reminder' | 'change' | 'cancellation';
}

export enum EventCategory {
  MUSIC = 'music',
  PARTY = 'party',
  HAPPY_HOUR = 'happy_hour',
  LIVE_SHOW = 'live_show',
  KARAOKE = 'karaoke',
  TRIVIA = 'trivia',
  SPORTS = 'sports',
  NETWORKING = 'networking',
  SPECIAL = 'special'
}

export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  SOLD_OUT = 'sold_out'
}

export interface EventFilter {
  category?: EventCategory[];
  date?: {
    start: string;
    end: string;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  location?: {
    lat: number;
    lng: number;
    radius: number; // in km
  };
  tags?: string[];
  isTicketed?: boolean;
  status?: EventStatus[];
}

export interface EventBookmark {
  id: number;
  userId: string;
  eventId: number;
  createdAt: string;
}

export interface EventAttendance {
  id: number;
  userId: string;
  eventId: number;
  status: 'going' | 'interested' | 'not_going';
  createdAt: string;
}