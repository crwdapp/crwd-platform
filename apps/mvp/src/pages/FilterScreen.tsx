import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, X } from 'lucide-react';
import { useAppStore } from '../store';

export const FilterScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppStore();
  const [selectedFilters, setSelectedFilters] = useState<string[]>(user.preferences.activeFilters);
  const [proximityRadius, setProximityRadius] = useState<number>(user.preferences.proximityRadius);

  const availableFilters = [
    { id: 'live-music', label: 'Live Music', description: 'Bars with live performances' },
    { id: 'late-night', label: 'Late Night', description: 'Open until 2AM or later' },
    { id: 'quiet', label: 'Quiet', description: 'Perfect for conversations' },
    { id: 'groups', label: 'Groups', description: 'Great for larger groups' },
    { id: 'dancing', label: 'Dancing', description: 'Dance floors and DJs' },
    { id: 'food', label: 'Food', description: 'Full menu available' },
    { id: 'outdoor', label: 'Outdoor', description: 'Terrace or garden seating' },
    { id: 'rooftop', label: 'Rooftop', description: 'Sky-high views' },
    { id: 'cocktails', label: 'Cocktails', description: 'Expert mixologists' },
    { id: 'beer', label: 'Craft Beer', description: 'Wide beer selection' },
    { id: 'wine', label: 'Wine Bar', description: 'Curated wine selection' },
    { id: 'casual', label: 'Casual', description: 'Relaxed atmosphere' },
    { id: 'upscale', label: 'Upscale', description: 'Premium experience' },
    { id: 'sports', label: 'Sports Bar', description: 'Watch the game' },
    { id: 'karaoke', label: 'Karaoke', description: 'Sing your heart out' },
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
  };

  const applyFilters = () => {
    // Update the store directly
    useAppStore.setState(state => {
      state.user.preferences.activeFilters = selectedFilters;
      state.user.preferences.proximityRadius = proximityRadius;
    });
    navigate('/discover');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12 border-b border-gray-700">
        <button 
          onClick={() => navigate('/discover')}
          className="p-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={24} className="text-white" />
        </button>
        <h1 className="text-xl font-semibold">Filters</h1>
        <button 
          onClick={clearAllFilters}
          className="text-gray-400 hover:text-white transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Distance Filter for Near Me */}
      {user.preferences.selectedLocation === 'NEAR_ME' && (
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-white">Distance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-white">
              <span>Show bars within</span>
              <span className="font-semibold text-[#06B6D4]">{proximityRadius} km</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={proximityRadius}
              onChange={(e) => setProximityRadius(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #06B6D4 0%, #06B6D4 ${((proximityRadius - 10) / 90) * 100}%, #4B5563 ${((proximityRadius - 10) / 90) * 100}%, #4B5563 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>10 km</span>
              <span>100 km</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Options */}
      <div className="p-4 space-y-4">
        {availableFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => toggleFilter(filter.id)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedFilters.includes(filter.id)
                ? 'border-[#06B6D4] bg-[#06B6D4]/20 text-white'
                : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="font-semibold">{filter.label}</h3>
                <p className="text-sm opacity-75">{filter.description}</p>
              </div>
              {selectedFilters.includes(filter.id) && (
                <div className="w-6 h-6 bg-[#06B6D4] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Apply Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black border-t border-gray-700">
        <button
          onClick={applyFilters}
          className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-white font-semibold py-4 rounded-xl transition-colors"
        >
          Apply Filters {selectedFilters.length > 0 && `(${selectedFilters.length})`}
        </button>
      </div>
    </div>
  );
};