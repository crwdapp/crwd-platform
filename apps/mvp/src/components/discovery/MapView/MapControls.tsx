// Isolated map controls
import React from 'react';
import { Search, Navigation, X } from 'lucide-react';
import { useAppStore } from '../../../store';
import { locationService } from '../../../services/location/locationService';

export const MapControls: React.FC = () => {
  const { ui } = useAppStore();

  const handleLocationRequest = async () => {
    try {
      const location = await locationService.getCurrentLocation();
      useAppStore.setState(state => {
        state.user.location = location;
      });
    } catch (error) {
      console.error('Failed to get location:', error);
    }
  };

  const toggleSearch = () => {
    useAppStore.setState(state => {
      state.ui.searchQuery = '';
    });
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-30 p-3 pt-12">
      <div className="flex items-center justify-between">
        <button
          onClick={() => useAppStore.setState(state => { state.ui.mapExpanded = !state.ui.mapExpanded; })}
          className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <X size={16} className="text-gray-900" />
        </button>

        <div className="flex space-x-2">
          <button
            onClick={toggleSearch}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <Search size={16} className="text-gray-900" />
          </button>
          <button
            onClick={handleLocationRequest}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <Navigation size={16} className="text-gray-900" />
          </button>
        </div>
      </div>
    </div>
  );
};