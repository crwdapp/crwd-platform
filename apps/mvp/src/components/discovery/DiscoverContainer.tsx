import React, { useEffect } from 'react';
import { useAppStore } from '../../store';
import { MapViewContainer } from './MapView/MapViewContainer';
import { LoadingScreen } from './Shared/LoadingScreen';
import { ErrorScreen } from './Shared/ErrorScreen';
import { useBarData } from '../../hooks/useBarData';
import { usePerformanceOptimization } from '../../hooks/usePerformanceOptimization';
import { locationService } from '../../services/location/locationService';

export const DiscoverContainer: React.FC = () => {
  const { loading, error } = useBarData();
  const { preloadResource } = usePerformanceOptimization();
  const { user } = useAppStore();

  // Handle location changes from store
  useEffect(() => {
    const updateLocationAndStore = async () => {
      try {
        const { user } = useAppStore.getState();
        const selectedLocation = user.preferences.selectedLocation;
        const activeFilters = user.preferences.activeFilters;

        // Get coordinates based on selection
        let coordinates;
        
        if (selectedLocation === 'NEAR_ME') {
          // For NEAR_ME, check if we already have user location
          const currentState = useAppStore.getState();
          if (currentState.user.location) {
            // Use existing GPS location if available
            coordinates = currentState.user.location;
            console.log('Using existing GPS location:', coordinates);
          } else {
            try {
              console.log('Getting user GPS location for NEAR_ME...');
              coordinates = await locationService.getCurrentLocation();
              console.log('GPS location obtained:', coordinates);
              
              // Update user location for NEAR_ME
              useAppStore.setState(state => {
                state.user.location = coordinates;
              });
            } catch (gpsError) {
              console.warn('GPS failed for NEAR_ME, using default location:', gpsError);
              // If GPS fails for NEAR_ME, use default coordinates (Bucharest)
              coordinates = { lat: 44.4268, lng: 26.1025 };
            }
          }
        } else {
          // For city selections, use city coordinates directly
          console.log('Using city coordinates for:', selectedLocation);
          coordinates = locationService.getCityCoordinates(selectedLocation) || { lat: 44.4268, lng: 26.1025 };
        }
        
        // Always update map center
        useAppStore.setState(state => {
          state.ui.mapCenter = coordinates;
        });
        
        console.log('Map will center at:', coordinates);
        
      } catch (error) {
        console.error('Failed to get location coordinates:', error);
        
        // If everything fails, use default coordinates
        const defaultCoords = { lat: 44.4268, lng: 26.1025 };
        if (selectedLocation === 'NEAR_ME') {
          useAppStore.setState(state => {
            state.ui.mapCenter = defaultCoords;
          });
        } else {
          const cityCoords = locationService.getCityCoordinates(selectedLocation);
          useAppStore.setState(state => {
            state.ui.mapCenter = cityCoords || defaultCoords;
          });
        }
      }
    };

    updateLocationAndStore();
  }, [user.preferences.selectedLocation, user.preferences.activeFilters]);

  // Preload critical resources for better performance
  useEffect(() => {
    // Preload common bar images and icons
    preloadResource('/icons/map-marker.svg', 'image');
    preloadResource('/icons/star.svg', 'image');
    preloadResource('/icons/clock.svg', 'image');
  }, [preloadResource]);

  // if (loading) return <LoadingScreen />; // Removed for better UX
  if (error) return <ErrorScreen error={error} />;

  return (
    <div className="h-full bg-black text-white relative">
      <MapViewContainer />
    </div>
  );
};