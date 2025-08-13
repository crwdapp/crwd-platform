import React, { useState } from 'react';
import { Search, Navigation } from 'lucide-react';
import { SearchInput } from '../Shared/SearchInput';
import { useAppStore } from '../../../store';
import { locationService } from '../../../services/location/locationService';

export const TopControls: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { ui, user } = useAppStore();

  const toggleMenu = () => {
    useAppStore.setState(state => {
      state.ui.mapExpanded = !state.ui.mapExpanded;
    });
  };

  const handleNavigateToUserLocation = async () => {
    setIsNavigating(true);
    try {
      // Get current user location
      const location = await locationService.getCurrentLocation();
      
      // Update map center to user location
      useAppStore.setState(state => {
        state.ui.mapCenter = location;
        state.user.location = location;
      });
      
      console.log('📍 Navigated to user location:', location);
    } catch (error) {
      console.error('❌ Failed to navigate to user location:', error);
    } finally {
      setIsNavigating(false);
    }
  };

  // Only show when menu is NOT expanded
  if (ui.mapExpanded) return null;

  return (
    <div className="absolute top-0 left-0 right-0 z-30 p-4 pt-14 safe-area-inset-top">
      <div className="flex items-center justify-end">
        {/* Enhanced action buttons with better spacing */}
        <div className="flex items-center space-x-3">
          {/* Navigation Button */}
          <button
            onClick={handleNavigateToUserLocation}
            disabled={isNavigating}
            className={`w-11 h-11 bg-white/95 backdrop-blur-md rounded-xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 touch-manipulation ${
              isNavigating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'
            }`}
          >
            <Navigation 
              size={20} 
              className={`text-gray-900 transition-colors duration-200 ${
                isNavigating ? 'animate-spin' : ''
              }`} 
            />
          </button>

          {/* Search Button */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`w-11 h-11 bg-white/95 backdrop-blur-md rounded-xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 touch-manipulation ${
              showSearch ? 'bg-blue-100 ring-2 ring-blue-200' : 'hover:bg-blue-50'
            }`}
          >
            <Search size={20} className={`text-gray-900 transition-colors duration-200 ${showSearch ? 'text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Enhanced search input with slide animation */}
      {showSearch && (
        <div className="mt-4 animate-in slide-in-from-top-2 duration-200 ease-out">
          <SearchInput onClose={() => setShowSearch(false)} />
        </div>
      )}
    </div>
  );
};