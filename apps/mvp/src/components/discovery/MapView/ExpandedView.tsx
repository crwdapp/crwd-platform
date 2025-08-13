import React from 'react';
import { BarList } from '../ListView/BarList';
import { SearchBar } from '../Shared/SearchBar';

export const ExpandedView: React.FC = () => {
  return (
    <div 
      className="h-full flex flex-col"
      style={{
        maxHeight: '100%'
      }}
    >
      {/* Search bar in expanded view */}
      <div className="flex-shrink-0 p-4 pt-0">
        <SearchBar />
      </div>
      
      {/* Bar list with proper scrolling and bottom navigation space */}
      <div 
        className="flex-1 overflow-y-auto"
        style={{
          // Smooth scrolling with momentum
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
          // Override parent's touchAction to allow scrolling
          touchAction: 'pan-y'
        }}
      >
        <div className="px-4">
          <BarList />
        </div>
      </div>
    </div>
  );
};