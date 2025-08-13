import { Bar } from '../../types/bar';
import { IRepository, IQuery } from './IRepository';

/**
 * Bar-specific repository interface
 * Extends generic repository with bar-specific methods
 */
export interface IBarRepository extends IRepository<Bar> {
  findByLocation(location: string): Promise<Bar[]>;
  findNearby(lat: number, lng: number, radius: number): Promise<Bar[]>;
  findByFilters(query: IQuery<Bar>): Promise<Bar[]>;
  findAvailableDrinks(barId: number): Promise<Bar['availableDrinksMenu']>;
}