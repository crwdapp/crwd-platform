import React from 'react';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store';

export const LocationButton: React.FC = () => {
  const { user } = useAppStore();
  const navigate = useNavigate();

  // Helper function to format location text to title case
  const formatLocationText = (location: string) => {
    if (location === 'NEAR_ME') return 'Near Me';
    // Convert other locations from uppercase to title case
    return location.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleLocationClick = () => {
    navigate('/location');
  };

  return (
    <button 
      onClick={handleLocationClick}
      className="flex items-center space-x-1.5 px-2 py-1.5 rounded-md transition-all duration-200 group bg-[#06B6D4] hover:bg-[#0891B2] text-white"
      title={`Current: ${formatLocationText(user.preferences.selectedLocation)}`}
    >
      <MapPin size={12} className="transition-colors duration-200 group-hover:text-white" />
      <span className="text-xs font-medium">
        {formatLocationText(user.preferences.selectedLocation)}
      </span>
    </button>
  );
};