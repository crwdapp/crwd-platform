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
    name: 'Romanian Red Wine',
    description: 'Local Romanian red wine',
    category: 'Wine',
    image: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '13%',
    volume: '150ml',
    originalPrice: '42 RON',
    barId: 2,
    isAvailable: true,
    tags: ['romanian', 'red wine']
  },
  {
    id: 8,
    name: 'Old Fashioned',
    description: 'Classic whiskey cocktail',
    category: 'Cocktail',
    image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '35%',
    volume: '250ml',
    originalPrice: '65 RON',
    barId: 2,
    isAvailable: true,
    ingredients: ['whiskey', 'bitters', 'sugar', 'orange'],
    tags: ['classic', 'whiskey']
  },

  // Sky Bar (Bar ID: 3) - Bucharest
  {
    id: 9,
    name: 'Sky Martini',
    description: 'Premium vodka martini with city views',
    category: 'Cocktail',
    image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '40%',
    volume: '250ml',
    originalPrice: '85 RON',
    barId: 3,
    isAvailable: true,
    ingredients: ['vodka', 'vermouth', 'olive'],
    tags: ['premium', 'martini']
  },
  {
    id: 10,
    name: 'Champagne',
    description: 'Premium French champagne',
    category: 'Wine',
    image: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '12%',
    volume: '150ml',
    originalPrice: '120 RON',
    barId: 3,
    isAvailable: true,
    tags: ['premium', 'champagne']
  },
  {
    id: 11,
    name: 'Negroni',
    description: 'Italian classic cocktail',
    category: 'Cocktail',
    image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '35%',
    volume: '250ml',
    originalPrice: '95 RON',
    barId: 3,
    isAvailable: true,
    ingredients: ['gin', 'campari', 'vermouth'],
    tags: ['italian', 'classic']
  },

  // Jazz Corner (Bar ID: 4) - Bucharest
  {
    id: 12,
    name: 'Whiskey Sour',
    description: 'Classic whiskey sour with jazz vibes',
    category: 'Cocktail',
    image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '35%',
    volume: '300ml',
    originalPrice: '55 RON',
    barId: 4,
    isAvailable: true,
    ingredients: ['whiskey', 'lemon juice', 'sugar'],
    tags: ['classic', 'whiskey']
  },
  {
    id: 13,
    name: 'Single Malt',
    description: 'Premium single malt whiskey',
    category: 'Spirits',
    image: 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '43%',
    volume: '50ml',
    originalPrice: '75 RON',
    barId: 4,
    isAvailable: true,
    tags: ['premium', 'whiskey']
  },
  {
    id: 14,
    name: 'Manhattan',
    description: 'Classic whiskey and vermouth cocktail',
    category: 'Cocktail',
    image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '35%',
    volume: '250ml',
    originalPrice: '65 RON',
    barId: 4,
    isAvailable: true,
    ingredients: ['whiskey', 'vermouth', 'bitters'],
    tags: ['classic', 'whiskey']
  },

  // Beer Garden (Bar ID: 5) - Bucharest
  {
    id: 15,
    name: 'Craft IPA',
    description: 'Local craft India Pale Ale',
    category: 'Beer',
    image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '5.8%',
    volume: '400ml',
    originalPrice: '28 RON',
    barId: 5,
    isAvailable: true,
    tags: ['craft', 'ipa']
  },
  {
    id: 16,
    name: 'Wheat Beer',
    description: 'German-style wheat beer',
    category: 'Beer',
    image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '5.2%',
    volume: '500ml',
    originalPrice: '32 RON',
    barId: 5,
    isAvailable: true,
    tags: ['german', 'wheat']
  },
  {
    id: 17,
    name: 'Stout',
    description: 'Dark Irish stout',
    category: 'Beer',
    image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '4.2%',
    volume: '500ml',
    originalPrice: '30 RON',
    barId: 5,
    isAvailable: true,
    tags: ['dark', 'stout']
  },

  // Seaside Lounge (Bar ID: 6) - Constanta
  {
    id: 18,
    name: 'Seaside Mojito',
    description: 'Fresh mint mojito with sea breeze',
    category: 'Cocktail',
    image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '35%',
    volume: '350ml',
    originalPrice: '45 RON',
    barId: 6,
    isAvailable: true,
    ingredients: ['rum', 'mint', 'lime', 'soda'],
    tags: ['fresh', 'tropical']
  },
  {
    id: 19,
    name: 'Beach Beer',
    description: 'Local beer perfect for beach vibes',
    category: 'Beer',
    image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '4.4%',
    volume: '500ml',
    originalPrice: '35 RON',
    barId: 6,
    isAvailable: true,
    tags: ['local', 'beach']
  },
  {
    id: 20,
    name: 'Pina Colada',
    description: 'Tropical coconut and pineapple cocktail',
    category: 'Cocktail',
    image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '25%',
    volume: '400ml',
    originalPrice: '55 RON',
    barId: 6,
    isAvailable: true,
    ingredients: ['rum', 'coconut cream', 'pineapple juice'],
    tags: ['tropical', 'sweet']
  },

  // Port Club (Bar ID: 7) - Constanta
  {
    id: 21,
    name: 'Premium Vodka',
    description: 'Premium vodka with mixers',
    category: 'Spirits',
    image: 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '40%',
    volume: '50ml',
    originalPrice: '65 RON',
    barId: 7,
    isAvailable: true,
    tags: ['premium', 'vodka']
  },
  {
    id: 22,
    name: 'Champagne Bottle',
    description: 'Premium champagne for celebrations',
    category: 'Wine',
    image: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '12%',
    volume: '750ml',
    originalPrice: '280 RON',
    barId: 7,
    isAvailable: true,
    tags: ['premium', 'champagne']
  },
  {
    id: 23,
    name: 'Energy Drink Mix',
    description: 'Vodka with energy drink',
    category: 'Cocktail',
    image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '35%',
    volume: '300ml',
    originalPrice: '75 RON',
    barId: 7,
    isAvailable: true,
    ingredients: ['vodka', 'energy drink'],
    tags: ['energy', 'popular']
  },

  // Marina Bar (Bar ID: 8) - Constanta
  {
    id: 24,
    name: 'Marina Martini',
    description: 'Premium gin martini with yacht views',
    category: 'Cocktail',
    image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '40%',
    volume: '250ml',
    originalPrice: '75 RON',
    barId: 8,
    isAvailable: true,
    ingredients: ['gin', 'vermouth', 'olive'],
    tags: ['premium', 'martini']
  },
  {
    id: 25,
    name: 'Premium Rum',
    description: 'Aged rum with tropical vibes',
    category: 'Spirits',
    image: 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '40%',
    volume: '50ml',
    originalPrice: '85 RON',
    barId: 8,
    isAvailable: true,
    tags: ['premium', 'rum']
  },
  {
    id: 26,
    name: 'Mai Tai',
    description: 'Classic tropical cocktail',
    category: 'Cocktail',
    image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '30%',
    volume: '350ml',
    originalPrice: '65 RON',
    barId: 8,
    isAvailable: true,
    ingredients: ['rum', 'orange liqueur', 'lime', 'almond syrup'],
    tags: ['tropical', 'classic']
  },

  // Fisherman's Pub (Bar ID: 9) - Constanta
  {
    id: 27,
    name: 'Local Beer',
    description: 'Traditional Romanian beer',
    category: 'Beer',
    image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '4.4%',
    volume: '500ml',
    originalPrice: '25 RON',
    barId: 9,
    isAvailable: true,
    tags: ['local', 'traditional']
  },
  {
    id: 28,
    name: 'Palinca',
    description: 'Traditional Romanian spirit',
    category: 'Spirits',
    image: 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '45%',
    volume: '50ml',
    originalPrice: '35 RON',
    barId: 9,
    isAvailable: true,
    tags: ['traditional', 'romanian']
  },
  {
    id: 29,
    name: 'Local Wine',
    description: 'Romanian local wine',
    category: 'Wine',
    image: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '12.5%',
    volume: '150ml',
    originalPrice: '30 RON',
    barId: 9,
    isAvailable: true,
    tags: ['local', 'romanian']
  },

  // Summer Garden (Bar ID: 10) - Constanta
  {
    id: 30,
    name: 'Garden Spritz',
    description: 'Fresh spritz with garden herbs',
    category: 'Cocktail',
    image: 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '35%',
    volume: '300ml',
    originalPrice: '48 RON',
    barId: 10,
    isAvailable: true,
    ingredients: ['prosecco', 'aperol', 'soda'],
    tags: ['fresh', 'herbal']
  },
  {
    id: 31,
    name: 'Rosé Wine',
    description: 'Light rosé wine for garden vibes',
    category: 'Wine',
    image: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=400',
    alcoholContent: '12%',
    volume: '150ml',
    originalPrice: '42 RON',
    barId: 10,
    isAvailable: true,
    tags: ['light', 'rosé']
  },
  {
    id: 32,
    name: 'Garden Lemonade',
    description: 'Fresh lemonade with herbs',
    category: 'Non-Alcoholic',
    image: 'https://images.pexels.com/photos/1983046/pexels-photo-1983046.jpeg?auto=compress&cs=tinysrgb&w=400',
    volume: '400ml',
    originalPrice: '25 RON',
    barId: 10,
    isAvailable: true,
    ingredients: ['lemon', 'mint', 'honey'],
    tags: ['fresh', 'non-alcoholic']
  }
];

// Helper functions
export const getDrinksByBarId = (barId: number): Drink[] => {
  return allDrinks.filter(drink => drink.barId === barId);
};

export const getDrinksByCategory = (category: Drink['category']): Drink[] => {
  return allDrinks.filter(drink => drink.category === category);
};

export const getDrinkById = (id: number): Drink | undefined => {
  return allDrinks.find(drink => drink.id === id);
};

export const getAvailableDrinksCount = (barId: number): number => {
  return allDrinks.filter(drink => drink.barId === barId && drink.isAvailable).length;
};

