import React from 'react';
import { GoogleMap } from '../../GoogleMap';
import { useAppStore } from '../../../store';
import { useNavigate } from 'react-router-dom';

export const MapComponent: React.FC = () => {
  const navigate = useNavigate();
  const { bars, ui, user } = useAppStore();

  const handleBarClick = (barId: number) => {
    navigate(`/bar/${barId}`);
  };

  const handleMarkerClick = (barId: number) => {
    console.log('MapComponent - Marker clicked for bar ID:', barId);
    
    // Find the bar index in the current bars array
    const barIndex = bars.items.findIndex(bar => bar.id === barId);
    
    if (barIndex !== -1) {
      console.log('MapComponent - Updating store with bar index:', barIndex);
      useAppStore.setState(state => {
        state.ui.selectedBarId = barId;
        state.ui.currentBarIndex = barIndex;
      });
    } else {
      console.error('MapComponent - Bar not found in bars array:', barId);
    }
  };

  // Use mapCenter from store, fallback to user location, then default to Bucharest
  const mapCenter = ui.mapCenter || user.location || { lat: 44.4268, lng: 26.1025 };
  
  console.log('MapComponent - Current map center:', mapCenter);
  console.log('MapComponent - Store map center:', ui.mapCenter);
  console.log('MapComponent - User location:', user.location);
  console.log('MapComponent - Bars count:', bars.items.length);

  return (
    <div className="w-full h-full">
      <GoogleMap
        bars={bars.items}
        selectedBar={ui.selectedBarId}
        onMarkerClick={handleMarkerClick}
        onBarClick={handleBarClick}
        userLocation={user.location}
        isMenuExpanded={ui.mapExpanded}
        mapCenter={mapCenter}
      />
    </div>
  );
};