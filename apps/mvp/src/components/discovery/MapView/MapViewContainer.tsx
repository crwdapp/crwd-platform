import React from 'react';
import { MapComponent } from './MapComponent';
import { MapOverlay } from './MapOverlay';
import { BottomPanel } from './BottomPanel';

export const MapViewContainer: React.FC = () => {
  return (
    <div className="h-full relative">
      {/* Map takes full screen */}
      <div className="absolute inset-0">
        <MapComponent />
        <MapOverlay />
      </div>
      
      {/* Bottom panel as simple card above navigation */}
      <BottomPanel />
    </div>
  );
};