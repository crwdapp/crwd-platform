// Isolated map container component
import React, { memo } from 'react';
import { GoogleMap } from './GoogleMap';
import { MapControls } from './MapControls';
import { useAppStore } from '../../../store';

interface MapContainerProps {
  onBarSelect: (barId: number) => void;
}

export const MapContainer: React.FC<MapContainerProps> = memo(({ onBarSelect }) => {
  const { bars, ui, user } = useAppStore();

  return (
    <div className="relative h-full">
      <GoogleMap
        bars={bars.items}
        selectedBar={ui.selectedBarId}
        onMarkerClick={onBarSelect}
        onBarClick={onBarSelect}
        userLocation={user.location}
        isMenuExpanded={ui.mapExpanded}
      />
      <MapControls />
    </div>
  );
});

MapContainer.displayName = 'MapContainer';