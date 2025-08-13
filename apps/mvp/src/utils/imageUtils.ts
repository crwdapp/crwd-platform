// Centralized image utilities for consistent fallback handling

interface ImageCategory {
  [key: string]: string;
}

// High-quality placeholder images for different categories
const PLACEHOLDER_IMAGES: ImageCategory = {
  // Bar placeholders
  'bar_default': 'https://images.unsplash.com/photo-1574096079513-d8259312b785?w=400&h=300&fit=crop&auto=format',
  'bar_lounge': 'https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=300&fit=crop&auto=format',
  'bar_pub': 'https://images.unsplash.com/photo-1572116469687-8ad915a2555f?w=400&h=300&fit=crop&auto=format',
  'bar_cocktail': 'https://images.unsplash.com/photo-1574096079513-d8259312b785?w=400&h=300&fit=crop&auto=format',
  'bar_nightclub': 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=400&h=300&fit=crop&auto=format',
  
  // Event placeholders
  'event_music': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&auto=format',
  'event_party': 'https://images.unsplash.com/photo-1571266028243-d220c9c9d70c?w=400&h=300&fit=crop&auto=format',
  'event_happy_hour': 'https://images.unsplash.com/photo-1574096079513-d8259312b785?w=400&h=300&fit=crop&auto=format',
  'event_live_show': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&auto=format',
  'event_karaoke': 'https://images.unsplash.com/photo-1519874179391-3ebc752241dd?w=400&h=300&fit=crop&auto=format',
  'event_trivia': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format',
  'event_sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop&auto=format',
  'event_networking': 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop&auto=format',
  'event_special': 'https://images.unsplash.com/photo-1571266028243-d220c9c9d70c?w=400&h=300&fit=crop&auto=format',
  'event_default': 'https://images.unsplash.com/photo-1571266028243-d220c9c9d70c?w=400&h=300&fit=crop&auto=format',
  
  // Drink placeholders
  'drink_beer': 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop&auto=format',
  'drink_cocktail': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1c?w=400&h=300&fit=crop&auto=format',
  'drink_wine': 'https://images.unsplash.com/photo-1566479179817-0df3d89bfecd?w=400&h=300&fit=crop&auto=format',
  'drink_spirits': 'https://images.unsplash.com/photo-1582821375516-b8b43d5cf1e7?w=400&h=300&fit=crop&auto=format',
  'drink_shots': 'https://images.unsplash.com/photo-1570197708879-7e63b2b9bb01?w=400&h=300&fit=crop&auto=format',
  'drink_default': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1c?w=400&h=300&fit=crop&auto=format'
};

/**
 * Get a fallback image for bars based on bar type
 */
export const getBarImage = (image: string | undefined, barType?: string): string => {
  if (image && image.trim() !== '') {
    return image;
  }
  
  const type = barType?.toLowerCase() || 'default';
  return PLACEHOLDER_IMAGES[`bar_${type}`] || PLACEHOLDER_IMAGES['bar_default'];
};

/**
 * Get a fallback image for events based on event category
 */
export const getEventImage = (image: string | undefined, eventCategory?: string): string => {
  if (image && image.trim() !== '') {
    return image;
  }
  
  const category = eventCategory?.toLowerCase() || 'default';
  return PLACEHOLDER_IMAGES[`event_${category}`] || PLACEHOLDER_IMAGES['event_default'];
};

/**
 * Get a fallback image for drinks based on drink category
 */
export const getDrinkImage = (image: string | undefined, drinkCategory?: string): string => {
  if (image && image.trim() !== '') {
    return image;
  }
  
  const category = drinkCategory?.toLowerCase() || 'default';
  return PLACEHOLDER_IMAGES[`drink_${category}`] || PLACEHOLDER_IMAGES['drink_default'];
};

/**
 * Handle image loading errors by setting a fallback image
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement>, 
  fallbackUrl: string
) => {
  const target = event.currentTarget;
  if (target.src !== fallbackUrl) {
    target.src = fallbackUrl;
  }
};