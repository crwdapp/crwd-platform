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
