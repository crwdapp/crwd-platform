import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store';
import { useSwipeGestures } from '../../../hooks/useSwipeGestures';
import { getBarImage, handleImageError } from '../../../utils/imageUtils';

export const BarCardCompact: React.FC = () => {
  const navigate = useNavigate();
  const { bars, ui } = useAppStore();
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeGestures();

  // Helper function to check if bar has events today (using bar's own events data)
  const hasEventsToday = (bar: any): boolean => {
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayDayName = dayNames[today.getDay()];
    
    // Check if bar has events for today's day of the week
    return bar.events && bar.events.some((event: any) => {
      // Check for events that happen on this day of the week
      if (event.date.includes(todayDayName) || event.date.includes('Every')) {
        return true;
      }
      // Check for specific date events
      if (event.date && event.date !== 'Every Friday' && event.date.includes(today.toDateString())) {
        return true;
      }
      return false;
    });
  };

  // Helper function to get today's opening hours
  const getTodayOpeningHours = (bar: any): string | null => {
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayDayName = dayNames[today.getDay()];
    return bar.hours && bar.hours[todayDayName] ? bar.hours[todayDayName] : null;
  };

  // Initialize progress indicator on mount
  useEffect(() => {
    const updateProgressIndicator = () => {
      const indicator = document.querySelector('.swipe-progress-indicator') as HTMLElement;
      if (indicator) {
        const dots = indicator.querySelectorAll('.progress-dot');
        dots.forEach((dot, index) => {
          const dotElement = dot as HTMLElement;
          if (index === ui.currentBarIndex) {
            dotElement.className = 'progress-dot w-6 h-2 bg-white/90 rounded-full transition-all duration-200';
          } else {
            dotElement.className = 'progress-dot w-2 h-2 bg-white/30 rounded-full transition-all duration-200';
          }
        });
      }
    };
    
    setTimeout(updateProgressIndicator, 100);
  }, [ui.currentBarIndex, bars.items.length]);

  // Ensure currentBarIndex is within bounds
  useEffect(() => {
    if (bars.items.length > 0) {
      if (ui.currentBarIndex >= bars.items.length || ui.currentBarIndex < 0) {
        useAppStore.setState(state => {
          state.ui.currentBarIndex = 0;
          state.ui.selectedBarId = bars.items[0]?.id || null;
        });
      }
    }
  }, [bars.items, ui.currentBarIndex]);

  if (bars.items.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold mb-2">No bars found</h3>
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

  // Ensure we have a valid bar index
  const safeBarIndex = Math.max(0, Math.min(ui.currentBarIndex, bars.items.length - 1));
  const currentBar = bars.items[safeBarIndex];

  if (!currentBar) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold mb-2">Loading bar...</h3>
      </div>
    );
  }

  // Check if Open Now filter is active and bar is closed
  const { user } = useAppStore.getState();
  const isOpenNowActive = user.preferences.activeFilters.includes('open_now');
  const isBarClosed = isOpenNowActive && !currentBar.isOpen;
  const hasEvents = hasEventsToday(currentBar);

  // Determine card colors based on bar status (same logic as map pins)
  let cardBackgroundColor = 'bg-[#06B6D4]'; // Default blue
  let accentLineColor = 'via-[#06B6D4]'; // Default blue accent
  let drinksBadgeColor = 'bg-[#06B6D4]'; // Default blue badge
  let drinksBadgeShadow = 'shadow-[#06B6D4]/40'; // Default blue shadow
  let badgeText = `${currentBar.availableDrinks} drinks`; // Default text

  // Apply gray colors for closed bars (same logic as map pins)
  if (isBarClosed) {
    cardBackgroundColor = 'bg-[#CCCCCC]'; // Gray for closed bars
    accentLineColor = 'via-[#999999]'; // Gray accent
    drinksBadgeColor = 'bg-[#888888]'; // Gray badge
    drinksBadgeShadow = 'shadow-[#888888]/40'; // Gray shadow
    
    // Determine badge text for closed bars using bar's hours data
    const todayHours = getTodayOpeningHours(currentBar);
    if (todayHours && todayHours !== 'Closed') {
      // Extract opening time from hours (e.g., "10:00 PM - 3:00 AM" -> "10:00 PM")
      const openingTime = todayHours.split(' - ')[0];
      badgeText = `Open at ${openingTime}`;
    } else {
      badgeText = 'Closed today';
    }
  }

  // Add orange accent colors for bars with events (no border)
  if (hasEvents) {
    accentLineColor = 'via-[#FF8C00]'; // Orange accent
    drinksBadgeColor = 'bg-[#FF8C00]'; // Orange badge
    drinksBadgeShadow = 'shadow-[#FF8C00]/40'; // Orange shadow
  }

  return (
    <div 
      className="relative w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ 
        touchAction: 'pan-x',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      {/* Horizontal scrollable container */}
      <div className="flex">
        {/* Current card - responsive width */}
        <div className="flex-shrink-0" style={{ width: 'clamp(85%, 90%, 92%)' }}>
          <div 
            className="bar-card cursor-pointer relative overflow-hidden mx-0.5 sm:mx-1 touch-manipulation group"
            onClick={() => navigate(`/bar/${currentBar.id}`)}
            style={{ 
              height: '200px' // Bigger height for card
            }}
          >
            {/* Clean modern card background with blue effects */}
            <div className={`absolute inset-0 bg-transparent rounded-2xl shadow-lg shadow-[#06B6D4]/10 group-hover:shadow-2xl group-hover:shadow-[#06B6D4]/30 group-hover:scale-[1.02] transition-all duration-300`}></div>
            
            {/* Dynamic accent line */}
            <div className={`absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent ${accentLineColor} to-transparent rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
            
            {/* Content container */}
            <div className="relative z-10 rounded-2xl overflow-hidden h-full flex flex-col">
              {/* Image section with compact height */}
              <div 
                className="relative"
                style={{ 
                  height: '130px', // Bigger image height
                  minHeight: '130px',
                  maxHeight: '130px'
                }}
              >
                <img 
                  src={getBarImage(currentBar.image, currentBar.type)} 
                  alt={currentBar.name}
                  className="w-full h-full object-cover rounded-t-2xl"
                  draggable={false}
                  onError={(e) => handleImageError(e, getBarImage(undefined, currentBar.type))}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-t-2xl" />
                
                {/* Drinks count badge with dynamic glow effect */}
                <div className={`absolute top-2 right-2 ${drinksBadgeColor} text-white rounded-lg px-2 py-1 shadow-lg ${drinksBadgeShadow} group-hover:shadow-xl group-hover:${drinksBadgeShadow.replace('/40', '/60')} transition-all duration-300`}>
                  <span className="text-xs font-semibold">
                    {badgeText}
                  </span>
                </div>
                
                {/* Event today badge - yellow bubble */}
                {hasEvents && (
                  <div className="absolute top-2 right-2 bg-[#FFD700] text-black rounded-lg px-2 py-1 shadow-lg shadow-[#FFD700]/40 group-hover:shadow-xl group-hover:shadow-[#FFD700]/60 transition-all duration-300 transform -translate-x-24">
                    <span className="text-xs font-semibold">
                      Event today
                    </span>
                  </div>
                )}
              </div>
              
              {/* Modern content section with dynamic background */}
              <div className={`relative flex-1 ${cardBackgroundColor} rounded-b-2xl overflow-hidden`}>
                {/* Subtle gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10"></div>
                
                {/* Content padding container */}
                <div className="relative z-10 px-4 py-3 h-full flex flex-col justify-center">
                  {/* Header with title and distance */}
                  <div className="flex items-start justify-between mb-2">
                    {/* Bar name with better typography */}
                    <h3 className="text-white text-lg font-bold line-clamp-1 tracking-tight flex-1 pr-2">
                      {currentBar.name}
                    </h3>
                    
                    {/* Distance on the right */}
                    <span className="text-white/80 text-xs font-medium whitespace-nowrap">
                      {currentBar.distance}
                    </span>
                  </div>
                  
                  {/* Available drinks list - horizontal with bullets */}
                  <div className="flex items-center space-x-2 text-white/80 text-xs font-medium">
                    {currentBar.availableDrinksMenu && currentBar.availableDrinksMenu.length > 0 ? (
                      currentBar.availableDrinksMenu.slice(0, 3).map((drink, index) => (
                        <React.Fragment key={index}>
                          <span>{drink.name}</span>
                          {index < Math.min(currentBar.availableDrinksMenu.length - 1, 2) && (
                            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <>
                        <span>Cocktails</span>
                        <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                        <span>Beer</span>
                        <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                        <span>Wine</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Next card preview - responsive width */}
        <div className="flex-shrink-0" style={{ width: 'clamp(8%, 10%, 15%)' }}>
          {(() => {
            // Calculate next bar and index with infinite looping for all modes
            const nextIndex = safeBarIndex + 1;
            const nextBar = bars.items[nextIndex] || bars.items[0]; // Always loop to beginning if at end
            
            if (!nextBar) return null;
            
            return (
              <div 
                className="cursor-pointer relative overflow-hidden mx-0.5 opacity-60 active:opacity-80 transition-opacity duration-200 touch-manipulation"
                style={{ height: '200px' }}
                onClick={() => {
                  // Swipe to next card logic with infinite looping
                  const targetIndex = nextIndex < bars.items.length ? nextIndex : 0;
                  useAppStore.setState(state => {
                    state.ui.currentBarIndex = targetIndex;
                    state.ui.selectedBarId = bars.items[targetIndex].id;
                  });
                }}
              >
                {/* Clean preview card background with blue effects */}
                <div className="absolute inset-0 bg-transparent rounded-2xl shadow-md shadow-[#06B6D4]/5 opacity-80 group-hover:shadow-lg group-hover:shadow-[#06B6D4]/20 transition-all duration-300"></div>
                
                {/* Blue accent line for preview */}
                <div className="absolute top-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#06B6D4]/40 to-transparent rounded-full opacity-40"></div>
                
                {/* Content container */}
                <div className="relative z-10 rounded-2xl overflow-hidden h-full">
                  {/* Image section */}
                  <div className="relative h-full">
                    <img 
                      src={getBarImage(nextBar.image, nextBar.type)} 
                      alt={nextBar.name}
                      className="w-full h-full object-cover rounded-2xl"
                      draggable={false}
                      onError={(e) => handleImageError(e, getBarImage(undefined, nextBar.type))}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent rounded-2xl" />
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};