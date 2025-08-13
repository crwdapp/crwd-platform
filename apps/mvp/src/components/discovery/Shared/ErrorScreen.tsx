import React from 'react';

interface ErrorScreenProps {
  error: string;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ error }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <p className="text-[#D0D8E0] mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-[#5BC0CE] to-[#6FFFE9] hover:from-[#6FFFE9] hover:to-[#5BC0CE] text-black px-4 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
};