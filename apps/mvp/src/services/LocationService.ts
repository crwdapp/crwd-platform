import { ILocationService } from '../core/interfaces/ILocationService';

/**
 * Concrete implementation of Location Service
 * Implements location-related operations with proper error handling
 */
export class LocationService implements ILocationService {
  private currentPosition: GeolocationPosition | null = null;
  private watchId: number | null = null;

  // City coordinates mapping - could be moved to a configuration file
  private readonly cityCoordinates: Record<string, { lat: number; lng: number }> = {
    'BUCHAREST': { lat: 44.4268, lng: 26.1025 },
    'CONSTANTA': { lat: 44.1598, lng: 28.6348 },
    'CLUJ': { lat: 46.7712, lng: 23.6236 },
    'TIMISOARA': { lat: 45.7489, lng: 21.2087 },
    'BRASOV': { lat: 45.6427, lng: 25.5887 }
  };

  async getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      console.log('Getting current GPS position...');
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('GPS position received:', position.coords);
          this.currentPosition = position;
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          resolve(location);
        },
        (error) => {
          console.error('GPS error:', error);
          reject(this.handleLocationError(error));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  getCityCoordinates(cityId: string): { lat: number; lng: number } | null {
    return this.cityCoordinates[cityId] || null;
  }

  async getLocationForSelection(selectedLocation: string): Promise<{ lat: number; lng: number }> {
    if (selectedLocation === 'NEAR_ME') {
      return this.getCurrentLocation();
    } else {
      const coordinates = this.getCityCoordinates(selectedLocation);
      if (coordinates) {
        return Promise.resolve(coordinates);
      } else {
        return Promise.reject(new Error(`Unknown city: ${selectedLocation}`));
      }
    }
  }

  watchLocation(callback: (location: { lat: number; lng: number }) => void): void {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.currentPosition = position;
        callback({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => console.error('Location watch error:', error),
      { enableHighAccuracy: true, maximumAge: 60000 }
    );
  }

  stopWatching(): void {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  private handleLocationError(error: GeolocationPositionError): Error {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return new Error('Location access denied. Please enable location services.');
      case error.POSITION_UNAVAILABLE:
        return new Error('Location unavailable. Please check your GPS settings.');
      case error.TIMEOUT:
        return new Error('Location request timeout. Please try again.');
      default:
        return new Error('Unknown location error');
    }
  }
}