export interface Drink {
  id: string;
  name: string;
  description?: string;
  category: DrinkCategory;
  subcategory?: string;
  ingredients: string[];
  alcoholContent?: number; // percentage
  price: number;
  currency: string;
  barId: string;
  barName: string;
  images: string[];
  isAvailable: boolean;
  isPopular: boolean;
  rating: number;
  reviewCount: number;
  allergens?: string[];
  nutritionalInfo?: NutritionalInfo;
  createdAt: Date;
  updatedAt: Date;
}

export type DrinkCategory = 
  | 'beer'
  | 'wine'
  | 'cocktail'
  | 'spirit'
  | 'mocktail'
  | 'soft-drink'
  | 'coffee'
  | 'tea'
  | 'other';

export interface NutritionalInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  sugar?: number;
  sodium?: number;
}

export interface DrinkMenu {
  id: string;
  barId: string;
  name: string;
  description?: string;
  isActive: boolean;
  validFrom: Date;
  validTo?: Date;
  drinks: Drink[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DrinkOrder {
  id: string;
  userId: string;
  barId: string;
  drinkId: string;
  quantity: number;
  totalPrice: number;
  currency: string;
  status: OrderStatus;
  orderDate: Date;
  pickupTime?: Date;
  specialInstructions?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface DrinkReview {
  id: string;
  drinkId: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}
