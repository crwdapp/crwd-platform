import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store';
import { getBarImage, handleImageError } from '../../../utils/imageUtils';

export const CollapsedView: React.FC = () => {
  const navigate = useNavigate();
  const { bars, user, ui } = useAppStore();
  
  // Helper function to check if bar has events today
  const hasEventsToday = (bar: any): boolean => {
    if (!bar.events || bar.events.length === 0) return false;
    
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNames[today.getDay()];
    
    return bar.events.some((event: any) => {
      if (event.date === today.toISOString().split('T')[0]) return true;
      if (event.date === `Every ${todayName}`) return true;
      if (event.date.includes('Every') && event.date.toLowerCase().includes(todayName.toLowerCase())) {
        return true;
      }
      return false;
    });
  };

  // Show loading state
  if (ui.isLocationLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#06B6D4] mx-auto mb-2"></div>
        <p className="text-white/70 text-sm">Finding bars near you...</p>
      </div>
    );
  }

  // Show no results state
  if (bars.items.length === 0) {
    const hasActiveFilters = user.preferences.activeFilters.length > 1;
    const isSearching = ui.searchQuery.length > 0;
    const isNearMe = user.preferences.selectedLocation === 'NEAR_ME';
    
    let message = 'No bars found';
    if (isSearching) {
      message = `No results for "${ui.searchQuery}"`;
    } else if (hasActiveFilters) {
      message = 'No bars match your filters';
    } else if (isNearMe) {
      message = 'No bars nearby';
    }
    
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2 text-white">{message}</h3>
        <p className="text-gray-400 text-sm mb-4">
          Try adjusting your search or filter settings
        </p>
        <button 
          onClick={() => navigate('/filter')}
          className="bg-[#06B6D4] hover:bg-[#0891B2] px-6 py-2 rounded-lg font-medium transition-colors text-white shadow-lg shadow-[#06B6D4]/30 hover:shadow-xl hover:shadow-[#06B6D4]/50"
        >
          Adjust Filters
        </button>
      </div>
    );
  }

  // Get the selected bar
  const selectedBar = bars.items.find(bar => bar.id === ui.selectedBarId) || bars.items[ui.currentBarIndex] || bars.items[0];

  if (!selectedBar) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2 text-white">Select a bar</h3>
        <p className="text-gray-400 text-sm">Tap on a map pin to view bar details</p>
      </div>
    );
  }

  const hasEvents = hasEventsToday(selectedBar);

  return (
    <div className="p-4">
      {/* Bar Details Card */}
      <div 
        className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 cursor-pointer hover:bg-white/15 transition-all duration-200"
        onClick={() => navigate(`/bar/${selectedBar.id}`)}
      >
        {/* Header with bar name and status */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg mb-1">{selectedBar.name}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-white/70 text-sm">{selectedBar.distance}</span>
              {selectedBar.isOpen ? (
                <span className="text-green-400 text-xs font-medium">● Open</span>
              ) : (
                <span className="text-red-400 text-xs font-medium">● Closed</span>
              )}
              {hasEvents && (
                <span className="text-yellow-400 text-xs font-medium">● Event today</span>
              )}
            </div>
          </div>
          
          {/* Quick action button */}
          <button className="bg-[#06B6D4] hover:bg-[#0891B2] text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors">
            View Details
          </button>
        </div>

        {/* Bar image and basic info */}
        <div className="flex space-x-3">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={getBarImage(selectedBar.image, selectedBar.type)} 
              alt={selectedBar.name}
              className="w-full h-full object-cover"
              onError={(e) => handleImageError(e, getBarImage(undefined, selectedBar.type))}
            />
          </div>
          
          <div className="flex-1">
            <div className="text-white/80 text-sm mb-2">
              <span className="font-medium">{selectedBar.availableDrinks} drinks available</span>
            </div>
            
            {/* Tags/features */}
            <div className="flex flex-wrap gap-1">
              {selectedBar.tags && selectedBar.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="bg-white/20 text-white/90 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};