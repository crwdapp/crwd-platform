import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Users, MessageSquare } from 'lucide-react';
import { useAppStore } from '../../../store';
import { useSwipeGestures } from '../../../hooks/useSwipeGestures';
import { getBarImage, handleImageError } from '../../../utils/imageUtils';

export const BarCardSwipeable: React.FC = () => {
  const navigate = useNavigate();
  const { bars, ui, reviews } = useAppStore();
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeGestures();

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
    
    // Small delay to ensure DOM is ready
    setTimeout(updateProgressIndicator, 100);
  }, [ui.currentBarIndex, bars.items.length]);

  // Debug logging to track state changes
  useEffect(() => {
    console.log('BarCardSwipeable - State updated:', {
      currentBarIndex: ui.currentBarIndex,
      selectedBarId: ui.selectedBarId,
      totalBars: bars.items.length,
      currentBarName: bars.items[ui.currentBarIndex]?.name
    });
  }, [ui.currentBarIndex, ui.selectedBarId, bars.items]);

  // Ensure currentBarIndex is within bounds and find nearest bar
  useEffect(() => {
    if (bars.items.length > 0) {
      // If currentBarIndex is out of bounds, reset to 0
      if (ui.currentBarIndex >= bars.items.length || ui.currentBarIndex < 0) {
        console.log('Correcting out-of-bounds currentBarIndex:', ui.currentBarIndex, 'to 0');
        useAppStore.setState(state => {
          state.ui.currentBarIndex = 0;
          state.ui.selectedBarId = bars.items[0]?.id || null;
        });
      }
      
      // If we have user location and bars, find the nearest bar and set it as current
      const { user } = useAppStore.getState();
      if (user.location && bars.items.length > 0 && ui.currentBarIndex === 0) {
        // Calculate distances and find nearest bar
        const barsWithDistance = bars.items.map((bar, index) => {
          const distance = Math.sqrt(
            Math.pow(bar.lat - user.location!.lat, 2) + 
            Math.pow(bar.lng - user.location!.lng, 2)
          );
          return { bar, index, distance };
        });
        
        // Sort by distance and get the nearest
        barsWithDistance.sort((a, b) => a.distance - b.distance);
        const nearestBar = barsWithDistance[0];
        
        if (nearestBar && nearestBar.index !== ui.currentBarIndex) {
          console.log('Setting nearest bar as current:', nearestBar.bar.name, 'at index:', nearestBar.index);
          useAppStore.setState(state => {
            state.ui.currentBarIndex = nearestBar.index;
            state.ui.selectedBarId = nearestBar.bar.id;
          });
        }
      }
    }
  }, [bars.items, ui.currentBarIndex, ui.selectedBarId]);

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
    console.error('No current bar found at index:', safeBarIndex);
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold mb-2">Loading bar...</h3>
      </div>
    );
  }

  // Get reviews for current bar and calculate average rating
  const barReviews = reviews.items.filter(review => review.barId === currentBar.id);
  const averageRating = barReviews.length > 0 
    ? barReviews.reduce((sum, review) => sum + review.rating, 0) / barReviews.length
    : currentBar.rating;

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-x' }}
    >
      {/* Horizontal scrollable container */}
      <div className="flex h-full">
        {/* Current card - 90% width */}
        <div className="flex-shrink-0" style={{ width: '90%' }}>
          <div 
            className="bar-card h-full cursor-pointer relative overflow-hidden mx-2"
            onClick={() => navigate(`/bar/${currentBar.id}`)}
            style={{ 
              maxHeight: '100%',
              height: '100%',
              minHeight: '300px'
            }}
          >
      {/* Glass morphism background */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"></div>
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
      
      {/* Content container */}
      <div className="relative z-10 rounded-2xl overflow-hidden">
      {/* Image section with responsive height */}
      <div 
        className="relative"
        style={{ 
          height: '180px', // Fixed height instead of h-48 for better control
          minHeight: '180px',
          maxHeight: '180px'
        }}
      >
        <img 
          src={getBarImage(currentBar.image, currentBar.type)} 
          alt={currentBar.name}
          className="w-full h-full object-cover"
          draggable={false}
          onError={(e) => handleImageError(e, getBarImage(undefined, currentBar.type))}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-3 right-3 bg-black/80 rounded-lg px-2 py-1">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10"></div>
          <div className="relative z-10">
          <span className="text-[#6FFFE9] text-sm font-bold">
            {currentBar.availableDrinks} drinks
          </span>
          </div>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          {/* Glass background for text */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 -m-2"></div>
          <div className="relative z-10">
          <h3 className="text-white text-lg font-bold mb-1 line-clamp-1">
            {currentBar.name}
          </h3>
          <p className="text-[#D0D8E0] text-sm line-clamp-1">
            {currentBar.type} • {currentBar.distance}
          </p>
          </div>
        </div>
      </div>
      
      {/* Content section with controlled height */}
      <div 
        className="p-4 relative"
        style={{
          // Ensure content section doesn't cause overflow
          maxHeight: 'calc(100% - 180px)', // Remaining space after image
          overflow: 'hidden'
        }}
      >
        {/* Subtle inner glass effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
        
        <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3 text-sm text-[#D0D8E0]">
            <div className="flex items-center space-x-1">
              <Star size={14} className="text-[#6FFFE9]" />
              <span className="font-medium">{averageRating.toFixed(1)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users size={14} className={getCrowdColor(currentBar.crowdLevel)} />
              <span className={`${getCrowdColor(currentBar.crowdLevel)} font-medium`}>{currentBar.crowdLevel}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span className="font-medium text-xs">{currentBar.openUntil}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare size={14} className="text-[#D0D8E0]" />
              <span className="font-medium text-xs">{barReviews.length}</span>
            </div>
          </div>
        </div>
        
        {/* Tags with line clamping */}
        <div className="flex flex-wrap gap-1">
          {currentBar.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="relative overflow-hidden bg-[#5BC0CE]/20 backdrop-blur-sm border border-[#5BC0CE]/30 text-[#5BC0CE] px-2 py-1 rounded-full text-xs font-medium">
              <div className="absolute inset-0 bg-gradient-to-r from-[#5BC0CE]/10 to-transparent"></div>
              <span className="relative z-10">{tag}</span>
            </span>
          ))}
        </div>
        </div>
      </div>
          </div>
          </div>
        </div>
        
        {/* Next card preview - 10% width */}
        <div className="flex-shrink-0" style={{ width: '10%' }}>
          {bars.items[safeBarIndex + 1] && (
            <div 
              className="h-full cursor-pointer relative overflow-hidden mx-1 opacity-60 hover:opacity-80 transition-opacity duration-200"
              onClick={() => {
                // Swipe to next card logic
                const nextIndex = safeBarIndex + 1;
                if (nextIndex < bars.items.length) {
                  useAppStore.setState(state => {
                    state.ui.currentBarIndex = nextIndex;
                    state.ui.selectedBarId = bars.items[nextIndex].id;
                  });
                }
              }}
            >
              {/* Glass morphism background */}
              <div className="absolute inset-0 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/5 shadow-xl"></div>
              
              {/* Gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent rounded-2xl"></div>
              
              {/* Content container */}
              <div className="relative z-10 rounded-2xl overflow-hidden h-full">
                {/* Image section */}
                <div className="relative h-full">
                  <img 
                    src={getBarImage(bars.items[safeBarIndex + 1].image, bars.items[safeBarIndex + 1].type)} 
                    alt={bars.items[safeBarIndex + 1].name}
                    className="w-full h-full object-cover"
                    draggable={false}
                    onError={(e) => handleImageError(e, getBarImage(undefined, bars.items[safeBarIndex + 1].type))}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  
                  {/* Minimized text overlay for 10% width */}
                  <div className="absolute bottom-1 left-1 right-1">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded border border-white/10"></div>
                    <div className="relative z-10 p-1">
                      <h3 className="text-white text-xs font-bold line-clamp-1 leading-tight">
                        {bars.items[safeBarIndex + 1].name}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    
  );
};