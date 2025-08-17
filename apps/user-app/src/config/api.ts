// API Configuration for different environments
export const API_CONFIG = {
  // Development - local backend
  development: {
    baseURL: 'http://localhost:3001/api',
  },
  
  // Production - your production backend
  production: {
    baseURL: 'https://api.crwd.com/api', // Change this to your production URL
  },
  
  // Staging - your staging backend
  staging: {
    baseURL: 'https://staging-api.crwd.com/api', // Change this to your staging URL
  },
};

// Get current environment
const getEnvironment = () => {
  // You can change this based on your build process
  // For now, we'll use development
  return 'development';
};

export const getApiBaseURL = () => {
  const env = getEnvironment();
  return API_CONFIG[env as keyof typeof API_CONFIG].baseURL;
};

// For development with Expo, you might need to use your computer's IP address
// instead of localhost when testing on a physical device
export const getLocalApiURL = () => {
  // Replace with your computer's IP address when testing on device
  return 'http://localhost:3001/api'; // Use localhost for emulator testing
};
