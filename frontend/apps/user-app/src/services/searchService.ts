import { Bar } from '../types/bar';
import { allBars } from '../data/barsData';

export type SearchCategory = 'all' | 'bars' | 'cocktails' | 'events';

export interface SearchResult {
  id: string;
  type: 'bar' | 'cocktail' | 'event';
  name: string;
  subtitle: string;
  image?: string;
  barName?: string;
  barId?: number;
  distance?: string;
  available?: boolean;
  rating?: number;
  relevance?: number; // For future Elasticsearch scoring
}

export interface SearchFilters {
  category?: SearchCategory;
  location?: string;
  openOnly?: boolean;
  minRating?: number;
  priceRange?: string[];
  tags?: string[];
  radius?: number; // in km
  userLocation?: { lat: number; lng: number };
}

export interface SearchQuery {
  text: string;
  filters?: SearchFilters;
  limit?: number;
  useFuzzy?: boolean; // Enable fuzzy search
}

/**
 * Enhanced Search Service for React Native
 * Migrates and improves upon the existing React app search logic
 */
export class SearchService {
  private allBars: Bar[] = allBars;
  private searchHistory: string[] = [];
  private readonly MAX_HISTORY = 10;
  private readonly DEFAULT_LIMIT = 20;

  constructor() {
    console.log('🔍 SearchService initialized with', this.allBars.length, 'bars');
    console.log('🔍 Sample bar data:', {
      name: this.allBars[0]?.name,
      drinks: this.allBars[0]?.availableDrinksMenu?.length,
      events: this.allBars[0]?.events?.length
    });
    
    // Test search
    this.search({ text: 'club' }).then(results => {
      console.log('🔍 Test search for "club" returned:', results.length, 'results');
    });
  }

  /**
   * Main search method - searches across bars, cocktails, and events
   * Simplified to match the original React app logic
   */
  async search(query: SearchQuery): Promise<SearchResult[]> {
    const { text, filters = {}, limit = this.DEFAULT_LIMIT, useFuzzy = false } = query;
    
    console.log('🔍 SearchService.search called with:', { text, filters, limit, useFuzzy });
    
    if (!text.trim()) return [];

    // Add to search history
    this.addToHistory(text);

    // Use the original React app's simple search logic
    const results: SearchResult[] = [];
    const queryLower = text.toLowerCase();
    const category = filters.category || 'all';

    console.log('🔍 Searching through', this.allBars.length, 'bars');
    console.log('🔍 First bar sample:', {
      name: this.allBars[0]?.name,
      drinksCount: this.allBars[0]?.availableDrinksMenu?.length,
      eventsCount: this.allBars[0]?.events?.length
    });

    this.allBars.forEach(bar => {
      // Search bars
      if (category === 'all' || category === 'bars') {
        if (
          bar.name.toLowerCase().includes(queryLower) ||
          bar.type.toLowerCase().includes(queryLower) ||
          bar.location.toLowerCase().includes(queryLower) ||
          bar.tags.some(tag => tag.toLowerCase().includes(queryLower))
        ) {
          results.push({
            id: `bar-${bar.id}`,
            type: 'bar',
            name: bar.name,
            subtitle: `${bar.type} • ${bar.distance || '1.2km'}`,
            image: bar.image,
            distance: bar.distance,
            rating: bar.rating,
            available: bar.isOpen,
            relevance: this.calculateBarRelevance(bar, queryLower)
          });
        }
      }

      // Search cocktails (from nested data)
      if (category === 'all' || category === 'cocktails') {
        console.log(`🔍 Searching drinks in ${bar.name}:`, bar.availableDrinksMenu?.length || 0, 'drinks');
        bar.availableDrinksMenu?.forEach(drink => {
          if (
            drink.name.toLowerCase().includes(queryLower) ||
            drink.category.toLowerCase().includes(queryLower) ||
            drink.description.toLowerCase().includes(queryLower)
          ) {
            results.push({
              id: `cocktail-${drink.id}-${bar.id}`,
              type: 'cocktail',
              name: drink.name,
              subtitle: `${drink.category} • ${drink.originalPrice || 'Available'}`,
              image: drink.image,
              barName: bar.name,
              barId: bar.id,
              distance: bar.distance,
              available: bar.isOpen,
              relevance: this.calculateDrinkRelevance(drink, bar, queryLower)
            });
          }
        });
      }

      // Search events (from nested data)
      if (category === 'all' || category === 'events') {
        console.log(`🔍 Searching events in ${bar.name}:`, bar.events?.length || 0, 'events');
        bar.events?.forEach(event => {
          if (
            event.name.toLowerCase().includes(queryLower) ||
            event.dj.toLowerCase().includes(queryLower)
          ) {
            results.push({
              id: `event-${event.id}-${bar.id}`,
              type: 'event',
              name: event.name,
              subtitle: `${event.date} • ${bar.name}`,
              image: bar.image, // Use bar image since events don't have their own image
              barName: bar.name,
              barId: bar.id,
              distance: bar.distance,
              relevance: this.calculateEventRelevance(event, bar, queryLower)
            });
          }
        });
      }
    });

    console.log('🔍 Found', results.length, 'results');
    console.log('🔍 First few results:', results.slice(0, 3));
    
    // Sort by relevance and limit results
    const finalResults = results
      .sort((a, b) => (b.relevance || 0) - (a.relevance || 0))
      .slice(0, limit);
    
    console.log('🔍 Returning', finalResults.length, 'final results');
    return finalResults;
  }

  /**
   * Apply filters to a bar
   */
  private applyBarFilters(bar: Bar, filters: SearchFilters): boolean {
    // Location filter
    if (filters.location && filters.location !== 'NEAR_ME') {
      if (bar.location !== filters.location) return false;
    }

    // Open only filter
    if (filters.openOnly && !bar.isOpen) return false;

    // Rating filter
    if (filters.minRating && bar.rating < filters.minRating) return false;

    // Price range filter
    if (filters.priceRange && filters.priceRange.length > 0) {
      if (!filters.priceRange.includes(bar.priceRange)) return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      if (!filters.tags.some(tag => bar.tags.includes(tag))) return false;
    }

    // Distance filter (if user location provided)
    if (filters.userLocation && filters.radius) {
      const distance = this.calculateDistance(
        filters.userLocation.lat,
        filters.userLocation.lng,
        bar.lat,
        bar.lng
      );
      if (distance > filters.radius) return false;
    }

    return true;
  }

  /**
   * Calculate relevance score for bars
   */
  private calculateBarRelevance(bar: Bar, query: string): number {
    let score = 0;
    const queryLower = query.toLowerCase();

    // Exact name match gets highest score
    if (bar.name.toLowerCase() === queryLower) score += 100;
    else if (bar.name.toLowerCase().includes(queryLower)) score += 50;

    // Type match
    if (bar.type.toLowerCase().includes(queryLower)) score += 30;

    // Tag matches
    const tagMatches = bar.tags.filter(tag => 
      tag.toLowerCase().includes(queryLower)
    ).length;
    score += tagMatches * 20;

    // Location match
    if (bar.location.toLowerCase().includes(queryLower)) score += 25;

    // Rating bonus
    score += bar.rating * 2;

    // Open status bonus
    if (bar.isOpen) score += 10;

    return score;
  }

  /**
   * Calculate relevance score for drinks
   */
  private calculateDrinkRelevance(drink: Bar['availableDrinksMenu'][0], bar: Bar, query: string): number {
    let score = 0;
    const queryLower = query.toLowerCase();

    // Exact name match
    if (drink.name.toLowerCase() === queryLower) score += 100;
    else if (drink.name.toLowerCase().includes(queryLower)) score += 50;

    // Category match
    if (drink.category.toLowerCase().includes(queryLower)) score += 30;

    // Description match
    if (drink.description.toLowerCase().includes(queryLower)) score += 20;

    // Bar rating bonus
    score += bar.rating * 2;

    // Open status bonus
    if (bar.isOpen) score += 10;

    return score;
  }

  /**
   * Calculate relevance score for events
   */
  private calculateEventRelevance(event: Bar['events'][0], bar: Bar, query: string): number {
    let score = 0;
    const queryLower = query.toLowerCase();

    // Event name match
    if (event.name.toLowerCase().includes(queryLower)) score += 50;

    // DJ match
    if (event.dj.toLowerCase().includes(queryLower)) score += 30;

    // Bar rating bonus
    score += bar.rating * 2;

    // Check if event is today
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNames[today.getDay()];
    
    if (event.date === `Every ${todayName}`) score += 20;

    return score;
  }

  /**
   * Calculate distance between two coordinates
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Add search term to history
   */
  private addToHistory(term: string): void {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) return;

    // Remove if already exists
    this.searchHistory = this.searchHistory.filter(item => item !== trimmedTerm);
    
    // Add to beginning
    this.searchHistory.unshift(trimmedTerm);
    
    // Keep only recent searches
    if (this.searchHistory.length > this.MAX_HISTORY) {
      this.searchHistory = this.searchHistory.slice(0, this.MAX_HISTORY);
    }
  }

  /**
   * Get search history
   */
  getSearchHistory(): string[] {
    return [...this.searchHistory];
  }

  /**
   * Clear search history
   */
  clearSearchHistory(): void {
    this.searchHistory = [];
  }

  /**
   * Get search suggestions based on history and popular terms
   */
  getSuggestions(query: string): string[] {
    if (!query.trim()) return this.searchHistory;

    // Simple suggestions based on search history
    return this.searchHistory.filter(term => 
      term.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Get search analytics (for future Elasticsearch integration)
   */
  getSearchAnalytics(): {
    totalSearches: number;
    popularTerms: string[];
    averageResults: number;
  } {
    return {
      totalSearches: this.searchHistory.length,
      popularTerms: this.searchHistory.slice(0, 5),
      averageResults: 15 // Placeholder
    };
  }
}

// Export singleton instance
export const searchService = new SearchService();
