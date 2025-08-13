import React from 'react';
import { TopControls } from './TopControls';
import { LocationStatus } from './LocationStatus';

export const MapOverlay: React.FC = () => {
  return (
    <>
      <TopControls />
      <LocationStatus />
    </>
  );
};