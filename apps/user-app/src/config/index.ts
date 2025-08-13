// Configuration file for React Native app
export const CONFIG = {
  // App Configuration
  APP_NAME: 'CRWD Mobile',
  APP_VERSION: '1.0.0',
  
  // Google Maps Configuration
  GOOGLE_MAPS_API_KEY: 'AIzaSyBDyU3qJiAwuKiDNhgAmdMbBDJ-jaOkqPc', // Replace with your actual API key
  
  // Default Images
  defaultBarImage: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
  defaultEventImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
  defaultDrinkImage: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400',
  placeholderImage: 'https://via.placeholder.com/400x300/6366f1/ffffff?text=CRWD',
  
  // Map Configuration
  defaultMapCenter: {
    latitude: 44.4268,
    longitude: 26.1025,
  },
  defaultMapZoom: 13,
  
  // UI Configuration
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#0f0f23',
    surface: '#1a1a2e',
    text: '#ffffff',
    textSecondary: '#9ca3af',
    border: '#374151',
  },
  
  // Animation Configuration
  animation: {
    duration: 300,
    easing: 'ease-in-out',
  },
  
  // Gesture Configuration
  gesture: {
    swipeThreshold: 50,
    velocityThreshold: 500,
  },
  
  // Performance Configuration
  performance: {
    imageCacheSize: 100,
    maxConcurrentRequests: 5,
  },
  
  // Location Configuration
  location: {
    accuracy: 'high',
    timeout: 10000,
    maximumAge: 60000,
  },
  
  // Bar Configuration
  bar: {
    maxDistance: 5000, // meters
    defaultRadius: 1000, // meters
    maxResults: 50,
  },
  
  // Event Configuration
  event: {
    maxUpcomingDays: 30,
    maxPastDays: 7,
  },
  
  // User Configuration
  user: {
    defaultTokens: 10,
    maxTokens: 100,
    tokenRefreshInterval: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // Search Configuration
  search: {
    debounceDelay: 300,
    minQueryLength: 2,
    maxResults: 20,
  },
  
  // Filter Configuration
  filter: {
    defaultRadius: 1000,
    maxRadius: 10000,
    radiusStep: 500,
  },
  
  // Notification Configuration
  notification: {
    enabled: true,
    sound: true,
    vibration: true,
  },
  
  // Analytics Configuration
  analytics: {
    enabled: false,
    trackEvents: true,
    trackErrors: true,
  },
  
  // Debug Configuration
  debug: {
    enabled: __DEV__,
    logLevel: 'info',
    showPerformance: false,
  },
};

// Helper functions
export const getGoogleMapsApiKey = (): string => {
  return CONFIG.GOOGLE_MAPS_API_KEY;
};

export const getDefaultMapCenter = () => {
  return CONFIG.defaultMapCenter;
};

export const getDefaultImage = (type: 'bar' | 'event' | 'drink' | 'placeholder'): string => {
  switch (type) {
    case 'bar':
      return CONFIG.defaultBarImage;
    case 'event':
      return CONFIG.defaultEventImage;
    case 'drink':
      return CONFIG.defaultDrinkImage;
    case 'placeholder':
      return CONFIG.placeholderImage;
    default:
      return CONFIG.placeholderImage;
  }
};

export const getColor = (colorName: keyof typeof CONFIG.colors): string => {
  return CONFIG.colors[colorName];
};

export const getAnimationConfig = () => {
  return CONFIG.animation;
};

export const getGestureConfig = () => {
  return CONFIG.gesture;
};

export const getPerformanceConfig = () => {
  return CONFIG.performance;
};

export const getLocationConfig = () => {
  return CONFIG.location;
};

export const getBarConfig = () => {
  return CONFIG.bar;
};

export const getEventConfig = () => {
  return CONFIG.event;
};

export const getUserConfig = () => {
  return CONFIG.user;
};

export const getSearchConfig = () => {
  return CONFIG.search;
};

export const getFilterConfig = () => {
  return CONFIG.filter;
};

export const getNotificationConfig = () => {
  return CONFIG.notification;
};

export const getAnalyticsConfig = () => {
  return CONFIG.analytics;
};

export const getDebugConfig = () => {
  return CONFIG.debug;
};

export default CONFIG;
