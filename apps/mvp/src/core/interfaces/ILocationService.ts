/**
 * Location service interface
 * Abstracts location-related operations
 */
export interface ILocationService {
  getCurrentLocation(): Promise<{ lat: number; lng: number }>;
  getCityCoordinates(cityId: string): { lat: number; lng: number } | null;
  getLocationForSelection(selectedLocation: string): Promise<{ lat: number; lng: number }>;
  watchLocation(callback: (location: { lat: number; lng: number }) => void): void;
  stopWatching(): void;
}