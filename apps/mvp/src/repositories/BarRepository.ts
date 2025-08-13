import { Bar } from '../types/bar';
import { IBarRepository, IQuery } from '../core/interfaces/IBarRepository';
import { allBars } from '../data/barsData';

/**
 * Concrete implementation of Bar Repository
 * Implements Repository Pattern for bar data access
 */
export class BarRepository implements IBarRepository {
  private cache = new Map<string, { data: Bar[]; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async findById(id: number): Promise<Bar | null> {
    const bar = allBars.find(b => b.id === id);
    return bar || null;
  }

  async findAll(filters?: Record<string, any>): Promise<Bar[]> {
    const cacheKey = JSON.stringify(filters || {});
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    // No delay needed for local data
    
    let result = [...allBars];
    
    if (filters) {
      result = this.applyFilters(result, filters);
    }

    this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  }

  async findByLocation(location: string): Promise<Bar[]> {
    return this.findAll({ location });
  }

  async findNearby(lat: number, lng: number, radius: number): Promise<Bar[]> {
    const bars = await this.findAll();
    
    // Calculate distance for each bar and add it as a property
    const barsWithDistance = bars.map(bar => {
      const distance = this.calculateDistance(lat, lng, bar.lat, bar.lng);
      return {
        ...bar,
        distanceKm: distance,
        distance: `${distance.toFixed(1)}km`
      };
    });
    
    // Filter by radius and sort by distance
    return barsWithDistance
      .filter(bar => bar.distanceKm <= radius)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  async findByFilters(query: IQuery<Bar>): Promise<Bar[]> {
    let bars = await this.findAll();

    // Apply filters
    if (query.filters) {
      bars = this.applyFilters(bars, query.filters);
    }

    // For NEAR_ME location, add distance calculation for sorting (no proximity filtering)
    if (query.filters?.location === 'NEAR_ME' && query.filters?.userLocation) {
      const { lat, lng } = query.filters.userLocation;
      
      bars = bars.map(bar => {
        const distance = this.calculateDistance(lat, lng, bar.lat, bar.lng);
        return {
          ...bar,
          distanceKm: distance,
          distance: `${distance.toFixed(1)}km`
        };
      })
      .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0)); // Sort by distance
      
      console.log(`🎯 Found ${bars.length} bars, sorted by distance from user location`);
    }

    // Apply bar filter mode (open_now, all_bars, events_today)
    if (query.filters?.barFilterMode) {
      const filterMode = query.filters.barFilterMode;
      
      if (filterMode === 'open_now') {
        bars = bars.filter(bar => bar.isOpen);
        console.log(`🕒 Filtered to ${bars.length} open bars`);
      } else if (filterMode === 'events_today') {
        const today = new Date();
        const todayDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayName = dayNames[today.getDay()];
        
        bars = bars.filter(bar => {
          if (!bar.events || bar.events.length === 0) return false;
          
          return bar.events.some((event: any) => {
            // Check for specific date match
            if (event.date === todayDate) return true;
            
            // Check for recurring events (e.g., "Every Friday", "Every Saturday")
            if (event.date === `Every ${todayName}`) return true;
            
            // Check for other recurring patterns
            if (event.date.includes('Every') && event.date.toLowerCase().includes(todayName.toLowerCase())) {
              return true;
            }
            
            return false;
          });
        });
        console.log(`🎉 Filtered to ${bars.length} bars with events today (${todayName})`);
      }
      // For 'all_bars', we don't filter anything - show all bars
    }

    // Apply search
    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      bars = bars.filter(bar =>
        bar.name.toLowerCase().includes(searchTerm) ||
        bar.type.toLowerCase().includes(searchTerm) ||
        bar.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply sorting
    if (query.sort) {
      bars = this.applySorting(bars, query.sort);
    }

    // Apply pagination
    if (query.pagination) {
      const { page, limit } = query.pagination;
      const startIndex = (page - 1) * limit;
      bars = bars.slice(startIndex, startIndex + limit);
    }

    return bars;
  }

  async findAvailableDrinks(barId: number): Promise<Bar['availableDrinksMenu']> {
    const bar = await this.findById(barId);
    return bar?.availableDrinksMenu || [];
  }

  async create(entity: Omit<Bar, 'id'>): Promise<Bar> {
    const newBar: Bar = {
      ...entity,
      id: Math.max(...allBars.map(b => b.id)) + 1
    };
    allBars.push(newBar);
    this.clearCache();
    return newBar;
  }

  async update(id: number, entity: Partial<Bar>): Promise<Bar> {
    const index = allBars.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error(`Bar with id ${id} not found`);
    }
    
    allBars[index] = { ...allBars[index], ...entity };
    this.clearCache();
    return allBars[index];
  }

  async delete(id: number): Promise<boolean> {
    const index = allBars.findIndex(b => b.id === id);
    if (index === -1) {
      return false;
    }
    
    allBars.splice(index, 1);
    this.clearCache();
    return true;
  }

  private applyFilters(bars: Bar[], filters: any): Bar[] {
    const filteredBars = bars.filter(bar => {
      // First, apply location filter - this is the primary filter for city selection
      if (filters.location && filters.location !== 'NEAR_ME') {
        if (bar.location !== filters.location) {
          return false;
        }
      }
      
      // Then apply other filters (if any)
      if (filters.filters && filters.filters.length > 0) {
        // Apply other filters (exclude open_now from regular filter matching)
        const regularFilters = filters.filters.filter((filter: string) => filter !== 'open_now');
        if (regularFilters.length > 0) {
          return regularFilters.some((filter: string) => bar.filters?.includes(filter));
        }
      }
      
      return true;
    });

    // For open_now filter, we don't remove closed bars, just mark them for visual treatment
    // The UI components will handle showing them differently
    if (filters.filters && filters.filters.includes('open_now')) {
      // Sort so open bars appear first, but keep all bars
      return filteredBars.sort((a, b) => {
        if (a.isOpen && !b.isOpen) return -1;
        if (!a.isOpen && b.isOpen) return 1;
        return 0;
      });
    }
    
    return filteredBars;
  }

  private applySorting(bars: Bar[], sort: { field: keyof Bar; direction: 'asc' | 'desc' }): Bar[] {
    return bars.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];
      
      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  private clearCache(): void {
    this.cache.clear();
  }
}