import React, { useState } from 'react';
import { Clock, Grid, Calendar } from 'lucide-react';
import { useAppStore } from '../../../store';
import { FilterPopup } from './FilterPopup';

export const OpenNowButton: React.FC = () => {
  const { user } = useAppStore();
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  
  const getFilterButtonText = () => {
    switch (user.preferences.barFilterMode) {
      case 'open_now':
        return 'Open Now';
      case 'all_bars':
        return 'All Bars';
      case 'events_today':
        return 'Events Today';
      default:
        return 'Open Now';
    }
  };

  const getFilterButtonIcon = () => {
    switch (user.preferences.barFilterMode) {
      case 'open_now':
        return Clock;
      case 'all_bars':
        return Grid;
      case 'events_today':
        return Calendar;
      default:
        return Clock;
    }
  };

  const handleFilterClick = () => {
    setShowFilterPopup(true);
  };

  const Icon = getFilterButtonIcon();
  const isDefault = user.preferences.barFilterMode === 'open_now';

  return (
    <>
      <button 
        onClick={handleFilterClick}
        className={`flex items-center space-x-1.5 px-2 py-1.5 rounded-md transition-all duration-200 ${
          isDefault 
            ? 'bg-[#06B6D4] hover:bg-[#0891B2] text-white' 
            : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
        }`}
      >
        <Icon size={12} className="transition-colors duration-200" />
        <span className="text-xs font-medium">{getFilterButtonText()}</span>
      </button>

      <FilterPopup 
        isOpen={showFilterPopup} 
        onClose={() => setShowFilterPopup(false)} 
      />
    </>
  );
};