import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, MapPin, Wine, Calendar } from 'lucide-react';
import { useAppStore } from '../../../store';
import { allBars } from '../../../data/barsData';

interface SearchInputProps {
  onClose: () => void;
}

type SearchCategory = 'all' | 'bars' | 'cocktails' | 'events';

interface SearchResult {
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
}

export const SearchInput: React.FC<SearchInputProps> = ({ onClose }) => {
  const { ui } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [query, setQuery] = useState('');

  // Search logic
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const queryLower = query.toLowerCase();

    allBars.forEach(bar => {
      // Search bars
      if (activeCategory === 'all' || activeCategory === 'bars') {
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
            available: bar.isOpen
          });
        }
      }

      // Search cocktails
      if (activeCategory === 'all' || activeCategory === 'cocktails') {
        bar.availableDrinksMenu.forEach(drink => {
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
              available: bar.isOpen
            });
          }
        });
      }

      // Search events
      if (activeCategory === 'all' || activeCategory === 'events') {
        bar.events.forEach(event => {
          if (
            event.name.toLowerCase().includes(queryLower) ||
            event.dj.toLowerCase().includes(queryLower)
          ) {
            results.push({
              id: `event-${event.id}-${bar.id}`,
              type: 'event',
              name: event.name,
              subtitle: `${event.date} • ${bar.name}`,
              image: event.image,
              barName: bar.name,
              barId: bar.id,
              distance: bar.distance
            });
          }
        });
      }
    });

    return results.slice(0, 20); // Limit results
  }, [query, activeCategory]);

  const handleChange = (value: string) => {
    setQuery(value);
    useAppStore.setState(state => {
      state.ui.searchQuery = value;
    });
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'bar') {
      // Navigate to bar or focus on map
      window.location.href = `/bar/${result.id.split('-')[1]}`;
    } else if (result.type === 'cocktail' && result.barId) {
      // Navigate to bar with cocktail focus
      window.location.href = `/bar/${result.barId}?drink=${result.id.split('-')[1]}`;
    } else if (result.type === 'event' && result.barId) {
      // Navigate to bar
      window.location.href = `/bar/${result.barId}`;
    }
  };

  const categories = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'bars', label: 'Bars', icon: MapPin },
    { id: 'cocktails', label: 'Drinks', icon: Wine },
    { id: 'events', label: 'Events', icon: Calendar }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
      {/* Search Input */}
      <div className="relative p-4">
        <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search bars, cocktails, events..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full bg-gray-50/50 border-0 rounded-xl pl-12 pr-12 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5BC0CE] text-base font-medium"
          autoFocus
        />
        <button
          onClick={() => {
            setQuery('');
            handleChange('');
            onClose();
          }}
          className="absolute right-7 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-gray-100 px-4">
        {categories.map(category => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id as SearchCategory)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-all duration-200 ${
                isActive
                  ? 'border-[#5BC0CE] text-[#5BC0CE]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} />
              <span className="font-medium text-sm">{category.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Results */}
      {query && (
        <div className="max-h-96 overflow-y-auto">
          {searchResults.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">No results found</div>
              <div className="text-sm text-gray-500">Try searching for bars, cocktails, or events</div>
            </div>
          ) : (
            <div className="py-2">
              {/* Group results by type */}
              {['bar', 'cocktail', 'event'].map(type => {
                const typeResults = searchResults.filter(r => r.type === type);
                if (typeResults.length === 0) return null;

                const typeLabels = {
                  bar: '🏢 Bars',
                  cocktail: '🍸 Cocktails', 
                  event: '🎉 Events'
                };

                return (
                  <div key={type}>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                      {typeLabels[type as keyof typeof typeLabels]}
                    </div>
                    {typeResults.map(result => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        {/* Image */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                          {result.image ? (
                            <img 
                              src={result.image} 
                              alt={result.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#5BC0CE] to-[#6FFFE9]">
                              {result.type === 'bar' && <MapPin size={16} className="text-white" />}
                              {result.type === 'cocktail' && <Wine size={16} className="text-white" />}
                              {result.type === 'event' && <Calendar size={16} className="text-white" />}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900 truncate">{result.name}</div>
                          <div className="text-sm text-gray-500 truncate">{result.subtitle}</div>
                          {result.barName && result.type !== 'bar' && (
                            <div className="text-xs text-[#5BC0CE] truncate">Available at {result.barName}</div>
                          )}
                        </div>

                        {/* Status Indicators */}
                        <div className="flex flex-col items-end space-y-1">
                          {result.available !== undefined && (
                            <div className={`w-2 h-2 rounded-full ${result.available ? 'bg-green-400' : 'bg-red-400'}`} />
                          )}
                          {result.rating && (
                            <div className="text-xs text-amber-600 font-medium">★ {result.rating}</div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};