import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo */}
        <div>
          <img 
            src="/src/assets/CRWD LOGO WHITE.png" 
            alt="CRWD-logo" 
            className="w-32 h-32 mx-auto object-contain animate-pulse"
          />
        </div>
      </div>
    </div>
  );
};