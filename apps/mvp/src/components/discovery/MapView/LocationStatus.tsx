import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useAppStore } from '../../../store';
import { useLocationService } from '../../../hooks/useLocationService';

export const LocationStatus: React.FC = () => {
  const { user } = useAppStore();
  const { loading, error, requestLocation } = useLocationService();

  if (user.preferences.selectedLocation !== 'NEAR_ME') return null;

  if (loading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="bg-black/80 rounded-lg p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5BC0CE] mx-auto mb-2"></div>
          <p className="text-white text-sm">Finding your location...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="bg-red-900/90 border border-red-500/50 rounded-lg p-4 text-center max-w-xs">
          <AlertCircle className="text-red-400 mx-auto mb-2" size={24} />
          <p className="text-white text-sm mb-2">Location access needed</p>
          <button 
            onClick={requestLocation}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
};