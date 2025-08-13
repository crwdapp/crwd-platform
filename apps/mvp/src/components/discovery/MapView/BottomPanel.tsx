import React from 'react';
import { PanelHeader } from './PanelHeader';
import { PanelContent } from './PanelContent';

export const BottomPanel: React.FC = () => {
  return (
    <div className="fixed bottom-16 left-0 right-0 z-20 mx-4 mb-4">
      {/* Simple card container */}
      <div className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-lg shadow-black/20">
        {/* Header */}
        <PanelHeader />
        
        {/* Content */}
        <PanelContent />
      </div>
    </div>
  );
};