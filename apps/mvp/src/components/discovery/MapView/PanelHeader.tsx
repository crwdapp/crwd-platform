import React from 'react';
import { LocationButton } from '../Shared/LocationButton';
import { OpenNowButton } from '../Shared/OpenNowButton';
import { StatsDisplay } from '../Shared/StatsDisplay';

export const PanelHeader: React.FC = () => {

  return (
    <>

      {/* Filter row - modern clean design */}
      <div className="panel-header flex items-center justify-between px-3 py-2 border-b border-white/10 bg-transparent rounded-t-2xl">
        <div className="flex items-center space-x-2.5">
          <LocationButton />
          <OpenNowButton />
        </div>
        <StatsDisplay />
      </div>
    </>
  );
};