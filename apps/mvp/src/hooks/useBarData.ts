// Refactored hook using Repository Pattern and Dependency Injection
import { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { getBarRepository } from '../core/DependencyContainer';
import { Bar } from '../types/bar';
import { IQuery } from '../core/interfaces/IRepository';

export const useBarData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const barRepository = getBarRepository();
  
  const {
    user: { preferences, location },
    ui: { searchQuery }
  } = useAppStore();

  const fetchBars = async () => {
    // Only show loading for network requests, not local data
    // setLoading(true); // Removed for better UX with local data
    setError(null);

    try {
      const query: IQuery<Bar> = {
        filters: {
          location: preferences.selectedLocation,
          filters: preferences.activeFilters.length > 0 ? preferences.activeFilters : undefined,
          barFilterMode: preferences.barFilterMode // Add bar filter mode to query
        },
        search: searchQuery || undefined
      };

      // For NEAR_ME, get user's GPS coordinates and add to query
      if (preferences.selectedLocation === 'NEAR_ME') {
        try {
          const { locationService } = await import('../services/location/locationService');
          const userLocation = await locationService.getCurrentLocation();
          query.filters!.userLocation = userLocation;
          console.log('useBarData - Got GPS coordinates for NEAR_ME:', userLocation);
        } catch (error) {
          console.error('useBarData - Failed to get GPS coordinates:', error);
          // Continue without GPS coordinates - bars will still be shown but without distance sorting
        }
      }

      console.log('useBarData - Fetching bars with query:', query);
      console.log('useBarData - Selected location:', preferences.selectedLocation);

      // Use filter search for all locations (including NEAR_ME)
      console.log('useBarData - Using filter search for location:', preferences.selectedLocation);
      const data = await barRepository.findByFilters(query);

      console.log('useBarData - Loaded bars:', data.length, 'bars');
      console.log('useBarData - Bar locations:', data.map(bar => ({ name: bar.name, location: bar.location })));

      useAppStore.setState(state => {
        state.bars.items = data;
      });
      
      console.log('Bar data updated in store:', data.length, 'bars loaded');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load bars';
      setError(errorMessage);
    } finally {
      // setLoading(false); // Not needed since we don't set loading to true
    }
  };

  const refreshBars = () => {
    fetchBars();
  };

  useEffect(() => {
    fetchBars();
  }, [preferences.selectedLocation, preferences.activeFilters, preferences.barFilterMode, searchQuery]);

  return {
    bars: useAppStore(state => state.bars.items),
    loading,
    error,
    refreshBars
  };
};