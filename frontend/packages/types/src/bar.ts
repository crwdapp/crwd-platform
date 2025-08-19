import { Drink } from './drink';
import { Event } from './event';

export interface Bar {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  openingHours: OpeningHours[];
  images: string[];
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  tags: string[];
  features: BarFeature[];
  drinks: Drink[];
  events: Event[];
}

export interface OpeningHours {
  day: number; // 0-6 (Sunday-Saturday)
  open: string; // HH:MM format
  close: string; // HH:MM format
  isClosed: boolean;
}

export interface BarFeature {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface BarLocation {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
}

export interface BarStats {
  totalVisits: number;
  averageRating: number;
  totalReviews: number;
  totalEvents: number;
  totalDrinks: number;
  monthlyRevenue?: number;
}

export interface BarSearchFilters {
  location?: BarLocation;
  radius?: number; // in kilometers
  isOpen?: boolean;
  rating?: number;
  tags?: string[];
  features?: string[];
  priceRange?: 'low' | 'medium' | 'high';
  sortBy?: 'distance' | 'rating' | 'name' | 'popularity';
}
