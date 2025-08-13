import React, { useEffect, useState } from 'react';
import { usePerformanceOptimization } from '../../../hooks/usePerformanceOptimization';

interface LoadingScreenProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading bars...', 
  showProgress = false,
  progress = 0 
}) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [loadingSteps] = useState([
    'Locating nearby bars...',
    'Fetching bar details...',
    'Analyzing crowd levels...',
    'Preparing your experience...'
  ]);
  const { performanceMode } = usePerformanceOptimization();

  // Animate through loading phases
  useEffect(() => {
    if (showProgress) return;
    
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % loadingSteps.length);
    }, 1500);
    
    return () => clearInterval(interval);
  }, [showProgress, loadingSteps.length]);

  const isPerformanceMode = performanceMode === 'performance';

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Animated background gradient */}
      {!isPerformanceMode && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#5BC0CE]/20 via-transparent to-[#6FFFE9]/20 animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#5BC0CE]/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[#6FFFE9]/10 rounded-full blur-2xl animate-float-delayed"></div>
        </div>
      )}
      
      <div className="text-center z-10 px-8">
        {/* Enhanced loading spinner */}
        <div className="relative mb-8">
          <div className="relative">
            {/* Main spinner */}
            <div className={`animate-spin rounded-full h-16 w-16 mx-auto ${
              isPerformanceMode 
                ? 'border-2 border-[#5BC0CE] border-t-transparent' 
                : 'border-4 border-transparent border-t-[#5BC0CE] border-r-[#6FFFE9]'
            }`}></div>
            
            {/* Inner pulse */}
            {!isPerformanceMode && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-[#5BC0CE] to-[#6FFFE9] rounded-full animate-pulse opacity-60"></div>
              </div>
            )}
            
            {/* Orbital dots */}
            {!isPerformanceMode && (
              <>
                <div className="absolute inset-0 animate-spin-slow">
                  <div className="w-3 h-3 bg-[#5BC0CE] rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1"></div>
                </div>
                <div className="absolute inset-0 animate-spin-reverse">
                  <div className="w-2 h-2 bg-[#6FFFE9] rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1"></div>
                </div>
              </>
            )}
          </div>
          
          {/* Progress ring */}
          {showProgress && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="rgba(91, 192, 206, 0.2)"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#progressGradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                  className="transition-all duration-300 ease-out"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#5BC0CE" />
                    <stop offset="100%" stopColor="#6FFFE9" />
                  </linearGradient>
                </defs>
              </svg>
              {showProgress && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{Math.round(progress)}%</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Loading message with typewriter effect */}
        <div className="mb-4 h-6">
          <p className="text-white text-lg font-medium animate-fade-in">
            {showProgress ? message : loadingSteps[animationPhase]}
          </p>
        </div>
        
        {/* Loading dots */}
        <div className="flex justify-center space-x-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 bg-gradient-to-r from-[#5BC0CE] to-[#6FFFE9] rounded-full ${
                isPerformanceMode ? 'animate-pulse' : 'animate-bounce'
              }`}
              style={{ 
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            ></div>
          ))}
        </div>
        
        {/* Subtitle */}
        <p className="text-gray-400 text-sm animate-fade-in-delayed">
          Discovering the best bars in your area
        </p>
      </div>
      
      {/* Custom animations CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-delayed {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 2s linear infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-fade-in-delayed {
          animation: fade-in-delayed 1.2s ease-out forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};