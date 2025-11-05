import Fuse from 'fuse.js';
import type { IFuseOptions, FuseResult } from 'fuse.js';
import { Bar } from '../types/bar';
import { allBars } from '../data/barsData';
import { allDrinks } from '../data/drinks';
import { sampleEvents } from '../data/events';
import { SearchResult, SearchFilters, SearchCategory } from './searchService';

/**
 * Fuzzy Search Service using Fuse.js
 * Provides typo tolerance and better search accuracy
 */
export class FuzzySearchService {
  private barsFuse: Fuse<Bar>;
  private drinksFuse: Fuse<any>;
  private eventsFuse: Fuse<any>;

  constructor() {
    // Configure Fuse.js for bars
    const barsFuseOptions: IFuseOptions<Bar> = {
      keys: [
        { name: 'name', weight: 0.4 },
        { name: 'type', weight: 0.3 },
        { name: 'location', weight: 0.2 },
        { name: 'tags', weight: 0.2 },
        { name: 'description', weight: 0.1 },
      ],
      threshold: 0.6, // Higher = more lenient matching
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 1,
      shouldSort: true,
    };

    // Configure Fuse.js for drinks
    const drinksFuseOptions: IFuseOptions<any> = {
      keys: [
        { name: 'name', weight: 0.5 },
        { name: 'category', weight: 0.3 },
        { name: 'description', weight: 0.2 },
      ],
      threshold: 0.6,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 1,
      shouldSort: true,
    };

    // Configure Fuse.js for events
    const eventsFuseOptions: IFuseOptions<any> = {
      keys: [
        { name: 'name', weight: 0.6 },
        { name: 'dj', weight: 0.4 },
      ],
      threshold: 0.6,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 1,
      shouldSort: true,
    };

    // Initialize Fuse instances
    this.barsFuse = new Fuse(allBars, barsFuseOptions);

    // Use separate drinks and events data with bar context
    const drinksWithBarContext = allDrinks.map(drink => {
      const bar = allBars.find(b => b.id === drink.barId);
      return {
        ...drink,
        barName: bar?.name || 'Unknown Bar',
        barLocation: bar?.location || 'Unknown',
        barDistance: bar?.distance,
        barIsOpen: bar?.isOpen || false,
        barRating: bar?.rating || 0,
      };
    });

    const eventsWithBarContext = sampleEvents.map(event => {
      const bar = allBars.find(b => b.id === event.barId);
      return {
        ...event,
        barName: bar?.name || 'Unknown Bar',
        barLocation: bar?.location || 'Unknown',
        barDistance: bar?.distance,
        barRating: bar?.rating || 0,
      };
    });

    this.drinksFuse = new Fuse(drinksWithBarContext, drinksFuseOptions);
    this.eventsFuse = new Fuse(eventsWithBarContext, eventsFuseOptions);
    
    // Test the search functionality
    console.log('🔍 FuzzySearchService initialized with:', {
      barsCount: allBars.length,
      drinksCount: drinksWithBarContext.length,
      eventsCount: eventsWithBarContext.length
    });
    
    // Test search
    const testResults = this.searchAll('club');
    console.log('🔍 Test search for "club" returned:', testResults.length, 'results');
  }

  /**
   * Search bars with fuzzy matching
   */
  searchBars(query: string, filters?: SearchFilters): SearchResult[] {
    if (!query.trim()) return [];

    console.log('🔍 searchBars called with query:', query);
    const results = this.barsFuse.search(query);
    console.log('🔍 Fuse.js bar results:', results.length);
    
    return results
      .filter(result => {
        const bar = result.item;
        const passesFilter = this.applyBarFilters(bar, filters);
        console.log(`🔍 Bar ${bar.name} passes filter:`, passesFilter);
        return passesFilter;
      })
      .map(result => {
        const bar = result.item;
        return {
          id: `bar-${bar.id}`,
          type: 'bar' as const,
          name: bar.name,
          subtitle: `${bar.type} • ${bar.location}`,
          image: bar.image,
          distance: bar.distance,
          rating: bar.rating,
          available: bar.isOpen,
          relevance: this.calculateFuzzyRelevance(result),
        };
      })
      .slice(0, 20);
  }

  /**
   * Search drinks with fuzzy matching
   */
  searchDrinks(query: string, filters?: SearchFilters): SearchResult[] {
    if (!query.trim()) return [];

    const results = this.drinksFuse.search(query);
    
    return results
      .filter(result => {
        const drink = result.item;
        const bar = allBars.find(b => b.id === drink.barId);
        return bar && this.applyBarFilters(bar, filters);
      })
      .map(result => {
        const drink = result.item;
        return {
          id: `cocktail-${drink.id}-${drink.barId}`,
          type: 'cocktail' as const,
          name: drink.name,
          subtitle: `${drink.category} • ${drink.originalPrice || 'Available'}`,
          image: drink.image,
          barName: drink.barName,
          barId: drink.barId,
          distance: drink.barDistance,
          available: drink.barIsOpen && drink.isAvailable,
          relevance: this.calculateFuzzyRelevance(result),
        };
      })
      .slice(0, 20);
  }

  /**
   * Search events with fuzzy matching
   */
  searchEvents(query: string, filters?: SearchFilters): SearchResult[] {
    if (!query.trim()) return [];

    const results = this.eventsFuse.search(query);
    
    return results
      .filter(result => {
        const event = result.item;
        const bar = allBars.find(b => b.id === event.barId);
        return bar && this.applyBarFilters(bar, filters);
      })
      .map(result => {
        const event = result.item;
        return {
          id: `event-${event.id}-${event.barId}`,
          type: 'event' as const,
          name: event.name,
          subtitle: `${event.date} • ${event.barName}`,
          image: event.image,
          barName: event.barName,
          barId: event.barId,
          distance: event.barDistance,
          relevance: this.calculateFuzzyRelevance(result),
        };
      })
      .slice(0, 20);
  }

  /**
   * Combined search across all categories
   */
  searchAll(query: string, filters?: SearchFilters, category: SearchCategory = 'all'): SearchResult[] {
    console.log('🔍 FuzzySearchService.searchAll called with:', { query, category, filters });
    
    const results: SearchResult[] = [];

    if (category === 'all' || category === 'bars') {
      const barResults = this.searchBars(query, filters);
      console.log('🔍 Bar search results:', barResults);
      results.push(...barResults);
    }

    if (category === 'all' || category === 'cocktails') {
      const drinkResults = this.searchDrinks(query, filters);
      console.log('🔍 Drink search results:', drinkResults);
      results.push(...drinkResults);
    }

    if (category === 'all' || category === 'events') {
      const eventResults = this.searchEvents(query, filters);
      console.log('🔍 Event search results:', eventResults);
      results.push(...eventResults);
    }

    console.log('🔍 Total results before sorting:', results.length);
    
    // Sort by relevance and return top results
    const sortedResults = results
      .sort((a, b) => (b.relevance || 0) - (a.relevance || 0))
      .slice(0, 20);
      
    console.log('🔍 Final sorted results:', sortedResults);
    return sortedResults;
  }

  /**
   * Get search suggestions with fuzzy matching
   */
  getSuggestions(query: string): string[] {
    if (!query.trim()) return [];

    const suggestions: string[] = [];
    const queryLower = query.toLowerCase();

    // Search for bars that match
    const barResults = this.barsFuse.search(query);
    barResults.slice(0, 3).forEach(result => {
      const bar = result.item;
      if (!suggestions.includes(bar.name)) {
        suggestions.push(bar.name);
      }
    });

    // Search for drink categories that match
    const drinkResults = this.drinksFuse.search(query);
    drinkResults.slice(0, 2).forEach(result => {
      const drink = result.item;
      if (!suggestions.includes(drink.category)) {
        suggestions.push(drink.category);
      }
    });

    // Add popular terms that match
    const popularTerms = [
      'club', 'bar', 'pub', 'restaurant',
      'cocktail', 'beer', 'wine', 'whiskey',
      'live music', 'dj', 'party', 'dance',
      'electronic', 'rock', 'jazz', 'blues'
    ];

    popularTerms.forEach(term => {
      if (term.toLowerCase().includes(queryLower) && !suggestions.includes(term)) {
        suggestions.push(term);
      }
    });

    return suggestions.slice(0, 5);
  }

  /**
   * Apply filters to a bar
   */
  private applyBarFilters(bar: Bar, filters?: SearchFilters): boolean {
    if (!filters) {
      console.log(`🔍 No filters applied to bar ${bar.name}`);
      return true;
    }

    console.log(`🔍 Applying filters to bar ${bar.name}:`, filters);

    // Location filter
    if (filters.location && filters.location !== 'NEAR_ME') {
      if (bar.location !== filters.location) {
        console.log(`🔍 Bar ${bar.name} failed location filter: ${bar.location} !== ${filters.location}`);
        return false;
      }
    }

    // Open only filter
    if (filters.openOnly && !bar.isOpen) {
      console.log(`🔍 Bar ${bar.name} failed open filter: ${bar.isOpen}`);
      return false;
    }

    // Rating filter
    if (filters.minRating && bar.rating < filters.minRating) {
      console.log(`🔍 Bar ${bar.name} failed rating filter: ${bar.rating} < ${filters.minRating}`);
      return false;
    }

    // Price range filter
    if (filters.priceRange && filters.priceRange.length > 0) {
      if (!filters.priceRange.includes(bar.priceRange)) {
        console.log(`🔍 Bar ${bar.name} failed price filter: ${bar.priceRange} not in ${filters.priceRange}`);
        return false;
      }
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      if (!filters.tags.some(tag => bar.tags.includes(tag))) {
        console.log(`🔍 Bar ${bar.name} failed tags filter: ${bar.tags} doesn't include any of ${filters.tags}`);
        return false;
      }
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
   * Calculate relevance score from Fuse.js result
   */
  private calculateFuzzyRelevance(result: FuseResult<any>): number {
    // Fuse.js score is 0-1, where 0 is perfect match
    // Convert to 0-100 scale where 100 is perfect match
    const baseScore = (1 - (result.score || 0)) * 100;
    
    // Boost score based on match quality
    let boostedScore = baseScore;
    
    // Perfect matches get bonus
    if (result.score === 0) {
      boostedScore += 20;
    }
    
    // Multiple matches get bonus
    if (result.matches && result.matches.length > 1) {
      boostedScore += result.matches.length * 5;
    }
    
    return Math.min(boostedScore, 100);
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
}

// Export singleton instance
export const fuzzySearchService = new FuzzySearchService();
