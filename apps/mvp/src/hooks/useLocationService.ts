import { useState } from 'react';
import { useAppStore } from '../store';
import { getLocationService } from '../core/DependencyContainer';

export const useLocationService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const locationService = getLocationService();

  const requestLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Requesting current GPS location...');
      const location = await locationService.getCurrentLocation();
      console.log('GPS location received:', location);
      
      // Update the store with the new location
      useAppStore.setState(state => {
        state.user.location = location;
      });
      
      return location;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      console.error('Location request failed:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, requestLocation };
};