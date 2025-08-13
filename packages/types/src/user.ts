export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  preferences: UserPreferences;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  role: UserRole;
}

export type UserRole = 'user' | 'bar-owner' | 'admin' | 'super-admin';

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    locationSharing: boolean;
    activityVisibility: 'public' | 'friends' | 'private';
  };
  interests: string[];
  favoriteBars: string[];
  favoriteDrinks: string[];
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  badges: UserBadge[];
  stats: UserStats;
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface UserStats {
  totalVisits: number;
  totalReviews: number;
  totalEvents: number;
  totalCheckins: number;
  memberSince: Date;
  lastVisit?: Date;
}

export interface UserActivity {
  id: string;
  userId: string;
  type: 'visit' | 'review' | 'event' | 'checkin' | 'favorite';
  targetId: string; // barId, eventId, etc.
  targetType: 'bar' | 'event' | 'drink';
  metadata?: Record<string, any>;
  createdAt: Date;
}
