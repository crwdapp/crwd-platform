import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { useAppStore } from '../../../store';
import { FilterPopup } from './FilterPopup';

export const FilterButton: React.FC = () => {
  const { user } = useAppStore();
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  
  // Check if we have any active filter mode other than default
  const hasActiveFilters = user.preferences.barFilterMode !== 'open_now';

  const handleFilterClick = () => {
    setShowFilterPopup(true);
  };

  return (
    <>
      <button 
        onClick={handleFilterClick}
        className={`flex items-center space-x-1.5 px-2 py-1.5 rounded-md transition-all duration-200 group relative ${
          hasActiveFilters 
            ? 'bg-[#06B6D4] hover:bg-[#0891B2] text-white' 
            : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
        }`}
        title={`Filter ${hasActiveFilters ? '(active)' : ''}`}
      >
        <Filter size={12} className="transition-colors duration-200" />
        <span className="text-xs font-medium">Filter</span>
        
        {hasActiveFilters && (
          <div className="absolute -top-1 -right-1 bg-white text-[#06B6D4] text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
            •
          </div>
        )}
      </button>

      <FilterPopup 
        isOpen={showFilterPopup} 
        onClose={() => setShowFilterPopup(false)} 
      />
    </>
  );
};