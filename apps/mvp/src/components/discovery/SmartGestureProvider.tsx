import React, { useEffect, createContext, useContext } from 'react';
import { useSmartGestures } from '../../hooks/useSmartGestures';

interface SmartGestureContextType {
  isOneHandedMode: boolean;
  toggleOneHandedMode: () => void;
  adjustForOneHandedMode: (element: HTMLElement) => void;
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy') => void;
}

const SmartGestureContext = createContext<SmartGestureContextType | null>(null);

export const useSmartGestureContext = () => {
  const context = useContext(SmartGestureContext);
  if (!context) {
    // Return default values instead of throwing error to prevent crashes
    return {
      isOneHandedMode: false,
      toggleOneHandedMode: () => {},
      adjustForOneHandedMode: () => {},
      triggerHaptic: () => {}
    };
  }
  return context;
};

interface SmartGestureProviderProps {
  children: React.ReactNode;
  className?: string;
}

export const SmartGestureProvider: React.FC<SmartGestureProviderProps> = ({ 
  children, 
  className = '' 
}) => {
  const {
    isOneHandedMode,
    gestureState,
    toggleOneHandedMode,
    adjustForOneHandedMode,
    handleSmartTouchStart,
    handleSmartTouchMove,
    handleSmartTouchEnd,
    triggerHaptic
  } = useSmartGestures({
    enableOneHandedMode: true,
    enableEdgeSwipes: true,
    enableDoubleTap: true,
    enableLongPress: true
  });

  // Add CSS for one-handed mode
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .one-handed-mode {
        transform-origin: bottom center;
        transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      .one-handed-mode body {
        transform: scale(var(--one-handed-scale, 0.85)) translate(var(--one-handed-translate, 0px, 15%));
      }
      
      .gesture-indicator {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        backdrop-filter: blur(10px);
        transition: all 0.2s ease-out;
        opacity: 0;
        transform: translateY(-10px);
      }
      
      .gesture-indicator.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      .one-handed-indicator {
        position: fixed;
        bottom: 100px;
        right: 20px;
        z-index: 9999;
        background: rgba(91, 192, 206, 0.9);
        color: white;
        padding: 12px;
        border-radius: 50%;
        backdrop-filter: blur(10px);
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        opacity: 0;
        transform: scale(0.8) translateY(20px);
        box-shadow: 0 8px 32px rgba(91, 192, 206, 0.3);
      }
      
      .one-handed-indicator.visible {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      
      .edge-swipe-indicator {
        position: fixed;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 60px;
        background: linear-gradient(to bottom, transparent, rgba(111, 255, 233, 0.5), transparent);
        border-radius: 2px;
        opacity: 0;
        transition: opacity 0.2s ease-out;
        z-index: 9998;
      }
      
      .edge-swipe-indicator.left {
        left: 0;
      }
      
      .edge-swipe-indicator.right {
        right: 0;
      }
      
      .edge-swipe-indicator.visible {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Show gesture feedback
  useEffect(() => {
    let indicator = document.querySelector('.gesture-indicator') as HTMLElement;
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'gesture-indicator';
      document.body.appendChild(indicator);
    }
    
    if (gestureState === 'recognized') {
      indicator.textContent = isOneHandedMode ? 'One-handed mode' : 'Gesture detected';
      indicator.classList.add('visible');
      
      setTimeout(() => {
        indicator.classList.remove('visible');
      }, 2000);
    }
    
    return () => {
      if (indicator && indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
    };
  }, [gestureState, isOneHandedMode]);

  // Show one-handed mode indicator
  useEffect(() => {
    let indicator = document.querySelector('.one-handed-indicator') as HTMLElement;
    
    if (isOneHandedMode) {
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'one-handed-indicator';
        indicator.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 2v4h8V2c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2zm0 6v12c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V8H8zm4 9c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"/>
          </svg>
        `;
        indicator.onclick = toggleOneHandedMode;
        document.body.appendChild(indicator);
      }
      indicator.classList.add('visible');
    } else if (indicator) {
      indicator.classList.remove('visible');
      setTimeout(() => {
        if (indicator && indicator.parentNode) {
          indicator.parentNode.removeChild(indicator);
        }
      }, 300);
    }
    
    return () => {
      if (indicator && indicator.parentNode && !isOneHandedMode) {
        indicator.parentNode.removeChild(indicator);
      }
    };
  }, [isOneHandedMode, toggleOneHandedMode]);

  const contextValue: SmartGestureContextType = {
    isOneHandedMode,
    toggleOneHandedMode,
    adjustForOneHandedMode,
    triggerHaptic
  };

  return (
    <SmartGestureContext.Provider value={contextValue}>
      <div
        className={`smart-gesture-container ${className} ${isOneHandedMode ? 'one-handed-active' : ''}`}
        onTouchStart={handleSmartTouchStart}
        onTouchMove={handleSmartTouchMove}
        onTouchEnd={handleSmartTouchEnd}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          touchAction: 'manipulation'
        }}
      >
        {children}
        
        {/* Edge swipe indicators */}
        <div className="edge-swipe-indicator left" />
        <div className="edge-swipe-indicator right" />
      </div>
    </SmartGestureContext.Provider>
  );
};