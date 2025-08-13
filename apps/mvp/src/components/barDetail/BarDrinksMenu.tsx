import React, { useState, useEffect, useRef } from 'react';
import { Wine, ChevronLeft, ChevronRight } from 'lucide-react';
import { Bar } from '../../types/bar';
import { getDrinkImage, handleImageError } from '../../utils/imageUtils';

interface BarDrinksMenuProps {
  availableDrinksMenu: Bar['availableDrinksMenu'];
  availableDrinksCount: number;
  onDrinkSelect: (drinkId: number) => void;
}

export const BarDrinksMenu: React.FC<BarDrinksMenuProps> = ({
  availableDrinksMenu,
  availableDrinksCount,
  onDrinkSelect
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);


  const handleTouchStart = (e: TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;
    
    // Prevent default scrolling for horizontal swipes
    if (Math.abs(deltaX) > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX;
    
    // Minimum swipe distance to change cards - show 2 at a time
    if (Math.abs(deltaX) > 80) {
      if (deltaX > 0) {
        // Swipe right - go to previous (show previous 2)
        setCurrentIndex(prev => Math.max(0, prev - 1));
      } else {
        // Swipe left - go to next (show next 2)
        setCurrentIndex(prev => Math.min(availableDrinksMenu.length - 2, prev + 1));
      }
    }
    
    setIsDragging(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add event listeners with passive: false to allow preventDefault
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, startX, availableDrinksMenu.length]);

  if (availableDrinksMenu.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center text-white">
          <Wine className="mr-2 text-[#06B6D4]" size={20} />
          Available Drinks ({availableDrinksCount} remaining today)
        </h3>
        <div className="text-center py-8 text-white/75">
          No drinks available at the moment
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 flex items-center text-white">
        <Wine className="mr-2 text-[#06B6D4]" size={20} />
        Available Drinks ({availableDrinksCount} remaining today)
      </h3>
      
      {/* Horizontal Swipeable Container - Show 2 cards */}
      <div 
        ref={containerRef}
        className="overflow-hidden"
        style={{ touchAction: 'pan-y' }}
      >
        <div 
          className="flex transition-transform duration-300 ease-out gap-3"
          style={{
            transform: `translateX(-${currentIndex * 50}%)`,
          }}
        >
          {availableDrinksMenu.map((drink, index) => (
            <div
              key={drink.id}
              className="flex-shrink-0 w-[calc(50%-6px)]"
            >
              <div className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-lg shadow-black/20 overflow-hidden group relative hover:shadow-2xl hover:shadow-[#06B6D4]/20 transition-all duration-300 hover:scale-[1.02] h-80 flex flex-col">
                {/* Blue accent line */}
                <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#06B6D4] to-transparent rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                
                {/* Drink Image */}
                <div className="relative h-40 flex-shrink-0">
                  <img 
                    src={getDrinkImage(drink.image, drink.category)}
                    alt={drink.name}
                    className="w-full h-40 object-cover"
                    onError={(e) => handleImageError(e, getDrinkImage(undefined, drink.category))}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2 bg-[#06B6D4]/90 backdrop-blur-sm text-white rounded-lg px-2 py-1 shadow-lg">
                    <span className="text-xs font-semibold">{drink.category}</span>
                  </div>
                  
                  {/* Price Badge */}
                  {drink.originalPrice && (
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-[#06B6D4] rounded-lg px-2 py-1 shadow-lg">
                      <span className="text-xs font-semibold">{drink.originalPrice}</span>
                    </div>
                  )}
                </div>
                
                {/* Drink Info */}
                <div className="p-3 flex-1 flex flex-col">
                  <h4 className="font-semibold text-white text-sm mb-1 line-clamp-1">{drink.name}</h4>
                  <p className="text-xs text-white/75 mb-2 line-clamp-2 flex-1">{drink.description}</p>
                  
                  {/* Additional Details */}
                  <div className="flex items-center justify-center mb-3">
                    <div className="flex items-center space-x-2 text-xs text-white/60">
                      {drink.alcoholContent && (
                        <span>{drink.alcoholContent}</span>
                      )}
                      {drink.volume && drink.alcoholContent && (
                        <span>•</span>
                      )}
                      {drink.volume && (
                        <span>{drink.volume}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Select Button */}
                  <button 
                    onClick={() => onDrinkSelect(drink.id)}
                    className="w-full bg-[#06B6D4] hover:bg-[#06B6D4]/80 text-white py-2 rounded-2xl font-medium text-sm transition-all duration-300 shadow-lg shadow-[#06B6D4]/40 hover:shadow-xl hover:shadow-[#06B6D4]/60 hover:scale-[1.02] mt-auto"
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};