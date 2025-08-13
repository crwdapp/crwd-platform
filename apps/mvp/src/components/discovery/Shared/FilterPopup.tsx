import React, { useState } from 'react';
import { X, Filter, MapPin, Clock, Calendar, Grid } from 'lucide-react';
import { useAppStore } from '../../../store';

interface FilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

type BarFilterMode = 'open_now' | 'all_bars' | 'events_today';

export const FilterPopup: React.FC<FilterPopupProps> = ({ isOpen, onClose }) => {
  const { user } = useAppStore();
  const [barFilterMode, setBarFilterMode] = useState<BarFilterMode>(user.preferences.barFilterMode);

  const handleFilterModeChange = (mode: BarFilterMode) => {
    setBarFilterMode(mode);
    
    // Apply instantly to store (this will re-render pins without moving map)
    useAppStore.setState(state => {
      state.user.preferences.barFilterMode = mode;
    });
  };

  const filterModes = [
    {
      id: 'open_now' as BarFilterMode,
      label: 'Open Now',
      description: 'Only open bars',
      icon: Clock,
    },
    {
      id: 'all_bars' as BarFilterMode,
      label: 'All Bars',
      description: 'All available bars',
      icon: Grid,
    },
    {
      id: 'events_today' as BarFilterMode,
      label: 'Events Today',
      description: 'Bars with events today',
      icon: Calendar,
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="relative w-full max-w-md mx-4 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-end p-4">
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-white/70" />
          </button>
        </div>

        {/* Filter Mode Buttons */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-3">
            {filterModes.map((mode) => {
              const Icon = mode.icon;
              const isActive = barFilterMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => handleFilterModeChange(mode.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    isActive
                      ? 'border-[#06B6D4] bg-[#06B6D4]/20 text-white'
                      : 'border-white/20 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white/90'
                  }`}
                >
                  <div className="text-center">
                    <Icon size={20} className="mx-auto mb-2" />
                    <div className="text-sm font-medium">{mode.label}</div>
                    <div className="text-xs text-white/60 mt-1">{mode.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};