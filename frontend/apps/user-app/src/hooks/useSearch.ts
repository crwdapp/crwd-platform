import { useState, useEffect, useCallback, useMemo } from 'react';
import { searchService, SearchQuery, SearchResult, SearchFilters, SearchCategory } from '../services/searchService';
export type { SearchCategory } from '../services/searchService';
import { useAppStore, isStoreReady } from '../store';

export interface UseSearchOptions {
  debounceMs?: number;
  defaultCategory?: SearchCategory;
  autoSearch?: boolean;
}

export interface UseSearchReturn {
  // State
  query: string;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  suggestions: string[];
  searchHistory: string[];
  
  // Actions
  setQuery: (query: string) => void;
  search: (query: string, filters?: SearchFilters) => Promise<void>;
  clearSearch: () => void;
  selectCategory: (category: SearchCategory) => void;
  getSuggestions: (query: string) => string[];
  clearHistory: () => void;
  
  // Computed
  hasResults: boolean;
  resultCount: number;
  activeCategory: SearchCategory;
}

/**
 * React Native hook for search functionality
 * Provides debounced search, state management, and integration with search service
 */
export const useSearch = (options: UseSearchOptions = {}): UseSearchReturn => {
  const {
    debounceMs = 300,
    defaultCategory = 'all',
    autoSearch = true
  } = options;

  // State
  const [query, setQueryState] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>(defaultCategory);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Get user preferences from store with error handling
  let userLocation: { lat: number; lng: number } | null = null;
  let userPreferences: { selectedLocation: string; activeFilters: string[]; viewMode: string; barFilterMode: string; eventFilterMode?: string } = { selectedLocation: 'ALL', activeFilters: [], viewMode: 'map', barFilterMode: 'all' };
  
  // Only try to access store if it's ready
  if (isStoreReady()) {
    try {
      const store = useAppStore.getState();
      if (store && store.user) {
        userLocation = store.user.location;
        userPreferences = store.user.preferences;
      }
    } catch (error) {
      console.warn('⚠️ Store not ready in useSearch hook:', error);
    }
  } else {
    console.log('ℹ️ Store not ready yet, using default preferences');
  }

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Auto-search effect
  useEffect(() => {
    if (autoSearch && debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else if (debouncedQuery.trim() === '') {
      setResults([]);
      setSuggestions([]);
    }
  }, [debouncedQuery, autoSearch]);

  // Update suggestions when query changes
  useEffect(() => {
    if (query.trim()) {
      const newSuggestions = searchService.getSuggestions(query);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions(searchService.getSearchHistory());
    }
  }, [query]);

  /**
   * Perform the actual search
   */
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    console.log('🔍 Starting search for:', searchQuery);
    setLoading(true);
    setError(null);

    try {
      // Build search filters from user preferences
      const filters: SearchFilters = {
        category: activeCategory,
        location: userPreferences.selectedLocation,
        openOnly: userPreferences.barFilterMode === 'open_now',
        userLocation: userLocation || undefined,
        radius: 10, // Default 10km radius
      };

      // Add active filters from user preferences
      if (userPreferences.activeFilters.length > 0) {
        filters.tags = userPreferences.activeFilters;
      }

      const searchQueryObj: SearchQuery = {
        text: searchQuery,
        filters,
        limit: 20,
        useFuzzy: false // Use simple search like the original React app
      };

      console.log('🔍 Search query object:', searchQueryObj);
      const searchResults = await searchService.search(searchQueryObj);
      console.log('🔍 Search results received in useSearch:', searchResults.length, 'results');
      console.log('🔍 First few results:', searchResults.slice(0, 3));
      setResults(searchResults);
      
      // Update store with search query
      if (isStoreReady()) {
        try {
          useAppStore.setState(state => ({
            ...state,
            ui: {
              ...state.ui,
              searchQuery: searchQuery
            }
          }));
        } catch (error) {
          console.warn('⚠️ Could not update store with search query:', error);
        }
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, userPreferences, userLocation]);

  /**
   * Set query and trigger search
   */
  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery);
  }, []);

  /**
   * Manual search function
   */
  const search = useCallback(async (searchQuery: string, filters?: SearchFilters) => {
    setQueryState(searchQuery);
    
    if (filters) {
      setActiveCategory(filters.category || 'all');
    }
    
    await performSearch(searchQuery);
  }, [performSearch]);

  /**
   * Clear search
   */
  const clearSearch = useCallback(() => {
    setQueryState('');
    setResults([]);
    setSuggestions([]);
    setError(null);
    
    // Clear search query in store
    if (isStoreReady()) {
      try {
        useAppStore.setState(state => ({
          ...state,
          ui: {
            ...state.ui,
            searchQuery: ''
          }
        }));
      } catch (error) {
        console.warn('⚠️ Could not clear search query in store:', error);
      }
    }
  }, []);

  /**
   * Select search category
   */
  const selectCategory = useCallback((category: SearchCategory) => {
    setActiveCategory(category);
    
    // Re-search with new category if there's an active query
    if (query.trim()) {
      performSearch(query);
    }
  }, [query, performSearch]);

  /**
   * Get search suggestions
   */
  const getSuggestions = useCallback((searchQuery: string): string[] => {
    return searchService.getSuggestions(searchQuery);
  }, []);

  /**
   * Clear search history
   */
  const clearHistory = useCallback(() => {
    searchService.clearSearchHistory();
    setSuggestions([]);
  }, []);

  // Computed values
  const hasResults = useMemo(() => results.length > 0, [results]);
  const resultCount = useMemo(() => results.length, [results]);
  const searchHistory = useMemo(() => searchService.getSearchHistory(), []);

  return {
    // State
    query,
    results,
    loading,
    error,
    suggestions,
    searchHistory,
    
    // Actions
    setQuery,
    search,
    clearSearch,
    selectCategory,
    getSuggestions,
    clearHistory,
    
    // Computed
    hasResults,
    resultCount,
    activeCategory,
  };
};

/**
 * Hook for search analytics
 */
export const useSearchAnalytics = () => {
  const analytics = useMemo(() => searchService.getSearchAnalytics(), []);
  
  const trackSearch = useCallback((query: string, resultCount: number) => {
    // In a real app, you'd send this to your analytics service
    console.log('Search tracked:', { query, resultCount, timestamp: new Date().toISOString() });
  }, []);

  return {
    analytics,
    trackSearch,
  };
};
