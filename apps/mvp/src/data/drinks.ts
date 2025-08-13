// Centralized drinks data
export interface Drink {
  id: number;
  name: string;
  description: string;
  category: 'Beer' | 'Wine' | 'Cocktail' | 'Spirits' | 'Shots' | 'Non-Alcoholic';
  image?: string;
  alcoholContent?: string;
  volume?: string;
  originalPrice?: string;
  barId: number; // Reference to which bar serves this drink
  isAvailable: boolean;
  ingredients?: string[];
  tags?: string[];
}

export const allDrinks: Drink[] = [
  // Control Club (Bar ID: 1) - Bucharest
  {
    id: 1,
    name: 'House Beer',
    description: 'Local draft beer - Ursus or Ciuc',
    category: 'Beer',
    image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '4.4%',
    volume: '500ml',
    originalPrice: '45 RON',
    barId: 1,
    isAvailable: true,
    tags: ['local', 'draft']
  },
  {
    id: 2,
    name: 'House Wine',
    description: 'Romanian red or white wine',
    category: 'Wine',
    image: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '12.5%',
    volume: '150ml',
    originalPrice: '35 RON',
    barId: 1,
    isAvailable: true,
    tags: ['romanian', 'house wine']
  },
  {
    id: 3,
    name: 'Vodka Tonic',
    description: 'Premium vodka with tonic water and lime',
    category: 'Cocktail',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '40%',
    volume: '300ml',
    originalPrice: '55 RON',
    barId: 1,
    isAvailable: true,
    ingredients: ['vodka', 'tonic water', 'lime'],
    tags: ['premium', 'classic']
  },
  {
    id: 4,
    name: 'Jägermeister Shot',
    description: 'Traditional German herbal liqueur',
    category: 'Shots',
    image: 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '35%',
    volume: '40ml',
    originalPrice: '25 RON',
    barId: 1,
    isAvailable: true,
    tags: ['herbal', 'german']
  },
  {
    id: 5,
    name: 'Long Island Iced Tea',
    description: 'Classic cocktail with multiple spirits',
    category: 'Cocktail',
    image: 'https://images.pexels.com/photos/1983046/pexels-photo-1983046.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '22%',
    volume: '350ml',
    originalPrice: '75 RON',
    barId: 1,
    isAvailable: true,
    ingredients: ['vodka', 'rum', 'gin', 'tequila', 'triple sec', 'cola'],
    tags: ['strong', 'popular']
  },

  // Old Town (Bar ID: 2) - Bucharest
  {
    id: 6,
    name: 'Craft IPA',
    description: 'Local craft India Pale Ale',
    category: 'Beer',
    image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '5.8%',
    volume: '400ml',
    originalPrice: '38 RON',
    barId: 2,
    isAvailable: true,
    tags: ['craft', 'ipa', 'hoppy']
  },
  {
    id: 7,
    name: 'Romanian Merlot',
    description: 'Local Merlot from Dealu Mare region',
    category: 'Wine',
    image: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '13.5%',
    volume: '150ml',
    originalPrice: '42 RON',
    barId: 2,
    isAvailable: true,
    tags: ['romanian', 'merlot', 'dealu mare']
  },
  {
    id: 8,
    name: 'Old Fashioned',
    description: 'Classic whiskey cocktail with bitters and orange',
    category: 'Cocktail',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '35%',
    volume: '200ml',
    originalPrice: '68 RON',
    barId: 2,
    isAvailable: true,
    ingredients: ['whiskey', 'sugar', 'angostura bitters', 'orange peel'],
    tags: ['classic', 'whiskey', 'sophisticated']
  },
  {
    id: 9,
    name: 'Tuica Shot',
    description: 'Traditional Romanian plum brandy',
    category: 'Shots',
    image: 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '45%',
    volume: '50ml',
    originalPrice: '20 RON',
    barId: 2,
    isAvailable: true,
    tags: ['traditional', 'romanian', 'plum brandy']
  },

  // Add more drinks for other bars...
  // Dublin bars
  {
    id: 10,
    name: 'Guinness Pint',
    description: 'Authentic Irish stout on draft',
    category: 'Beer',
    image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '4.2%',
    volume: '568ml',
    originalPrice: '€6.50',
    barId: 3, // Temple Bar
    isAvailable: true,
    tags: ['irish', 'stout', 'authentic']
  },
  {
    id: 11,
    name: 'Irish Coffee',
    description: 'Coffee with Irish whiskey and cream',
    category: 'Cocktail',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '8%',
    volume: '200ml',
    originalPrice: '€8.00',
    barId: 3,
    isAvailable: true,
    ingredients: ['irish whiskey', 'coffee', 'cream', 'sugar'],
    tags: ['irish', 'coffee', 'traditional']
  },
  {
    id: 12,
    name: 'Jameson Whiskey',
    description: 'Premium Irish whiskey neat or on rocks',
    category: 'Spirits',
    image: 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '40%',
    volume: '35ml',
    originalPrice: '€7.50',
    barId: 3,
    isAvailable: true,
    tags: ['premium', 'irish', 'whiskey']
  }
];

// Helper functions for drinks data
export const getDrinksByBarId = (barId: number): Drink[] => {
  return allDrinks.filter(drink => drink.barId === barId && drink.isAvailable);
};

export const getDrinksByCategory = (category: Drink['category']): Drink[] => {
  return allDrinks.filter(drink => drink.category === category && drink.isAvailable);
};

export const getDrinkById = (id: number): Drink | undefined => {
  return allDrinks.find(drink => drink.id === id);
};

export const getAvailableDrinksCount = (barId: number): number => {
  return getDrinksByBarId(barId).length;
};