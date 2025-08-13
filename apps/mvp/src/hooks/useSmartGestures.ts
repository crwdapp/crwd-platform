import { useState, useRef, useCallback } from 'react';
import { useAppStore } from '../store';

interface GestureConfig {
  enableOneHandedMode?: boolean;
  enableEdgeSwipes?: boolean;
  enableDoubleTap?: boolean;
  enableLongPress?: boolean;
}

export const useSmartGestures = (config: GestureConfig = {}) => {
  const [isOneHandedMode, setIsOneHandedMode] = useState(false);
  const [gestureState, setGestureState] = useState<'idle' | 'detecting' | 'recognized'>('idle');
  const touchStartTime = useRef(0);
  const touchCount = useRef(0);
  const lastTouchEnd = useRef(0);
  const longPressTimeout = useRef<NodeJS.Timeout>();
  const edgeThreshold = 20; // pixels from edge for edge swipes

  const {
    enableOneHandedMode = true,
    enableEdgeSwipes = true,
    enableDoubleTap = true,
    enableLongPress = true
  } = config;

  // Haptic feedback helper
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (navigator.vibrate) {
      const vibrationMap = { light: [10], medium: [20], heavy: [30] };
      navigator.vibrate(vibrationMap[type]);
    }
  }, []);

  // Check if touch is at screen edge (for one-handed mode)
  const isTouchAtEdge = useCallback((x: number, y: number) => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    return x <= edgeThreshold || 
           x >= screenWidth - edgeThreshold || 
           y <= edgeThreshold || 
           y >= screenHeight - edgeThreshold;
  }, []);

  // Toggle one-handed mode
  const toggleOneHandedMode = useCallback(() => {
    setIsOneHandedMode(prev => {
      const newMode = !prev;
      triggerHaptic(newMode ? 'heavy' : 'medium');
      
      // Apply one-handed mode styling
      const root = document.documentElement;
      if (newMode) {
        root.style.setProperty('--one-handed-scale', '0.85');
        root.style.setProperty('--one-handed-translate', '0px, 15%');
        root.classList.add('one-handed-mode');
      } else {
        root.style.removeProperty('--one-handed-scale');
        root.style.removeProperty('--one-handed-translate');
        root.classList.remove('one-handed-mode');
      }
      
      return newMode;
    });
  }, [triggerHaptic]);

  // Smart gesture detection
  const handleSmartTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const now = Date.now();
    
    touchStartTime.current = now;
    setGestureState('detecting');
    
    // Double-tap detection
    if (enableDoubleTap) {
      if (now - lastTouchEnd.current < 300) {
        touchCount.current += 1;
        if (touchCount.current === 2) {
          // Double-tap detected
          setGestureState('recognized');
          triggerHaptic('medium');
          
          // Toggle one-handed mode on double-tap at screen edge
          if (enableOneHandedMode && isTouchAtEdge(touch.clientX, touch.clientY)) {
            toggleOneHandedMode();
          }
          
          touchCount.current = 0;
        }
      } else {
        touchCount.current = 1;
      }
    }
    
    // Long press detection
    if (enableLongPress) {
      longPressTimeout.current = setTimeout(() => {
        setGestureState('recognized');
        triggerHaptic('heavy');
        
        // Show contextual menu or action on long press
        console.log('Long press detected at:', touch.clientX, touch.clientY);
      }, 500);
    }
  }, [enableDoubleTap, enableLongPress, enableOneHandedMode, isTouchAtEdge, toggleOneHandedMode, triggerHaptic]);

  const handleSmartTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    
    // Cancel long press on movement
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = undefined;
    }
    
    // Edge swipe detection
    if (enableEdgeSwipes && gestureState === 'detecting') {
      const isEdgeStart = isTouchAtEdge(touch.clientX, touch.clientY);
      
      if (isEdgeStart) {
        setGestureState('recognized');
        
        // Left edge swipe - go back
        if (touch.clientX <= edgeThreshold) {
          triggerHaptic('light');
          // Implement back navigation
          console.log('Left edge swipe detected - navigate back');
        }
        
        // Right edge swipe - forward/menu
        if (touch.clientX >= window.innerWidth - edgeThreshold) {
          triggerHaptic('light');
          // Implement forward navigation or menu
          console.log('Right edge swipe detected - navigate forward or show menu');
        }
        
        // Top edge swipe - refresh or notifications
        if (touch.clientY <= edgeThreshold) {
          triggerHaptic('light');
          console.log('Top edge swipe detected - refresh or notifications');
        }
      }
    }
  }, [enableEdgeSwipes, gestureState, isTouchAtEdge, triggerHaptic]);

  const handleSmartTouchEnd = useCallback(() => {
    const now = Date.now();
    lastTouchEnd.current = now;
    
    // Clear long press timeout
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = undefined;
    }
    
    // Reset gesture state after delay
    setTimeout(() => {
      setGestureState('idle');
    }, 100);
  }, []);

  // Get thumb-reach zones for one-handed mode
  const getThumbReachZones = useCallback(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Define comfortable thumb reach zones
    const rightHanded = {
      easy: { x: screenWidth * 0.3, y: screenHeight * 0.5, radius: screenWidth * 0.25 },
      medium: { x: screenWidth * 0.3, y: screenHeight * 0.5, radius: screenWidth * 0.4 },
      hard: { x: 0, y: 0, width: screenWidth, height: screenHeight * 0.3 }
    };
    
    const leftHanded = {
      easy: { x: screenWidth * 0.7, y: screenHeight * 0.5, radius: screenWidth * 0.25 },
      medium: { x: screenWidth * 0.7, y: screenHeight * 0.5, radius: screenWidth * 0.4 },
      hard: { x: 0, y: 0, width: screenWidth, height: screenHeight * 0.3 }
    };
    
    return { rightHanded, leftHanded };
  }, []);

  // Auto-adjust UI elements for one-handed mode
  const adjustForOneHandedMode = useCallback((element: HTMLElement) => {
    if (isOneHandedMode) {
      const zones = getThumbReachZones();
      const rect = element.getBoundingClientRect();
      
      // Check if element is in hard-to-reach zone
      if (rect.top < window.innerHeight * 0.3) {
        element.style.transform = 'translateY(20px) scale(0.9)';
        element.style.transformOrigin = 'bottom center';
      }
    } else {
      element.style.transform = '';
      element.style.transformOrigin = '';
    }
  }, [isOneHandedMode, getThumbReachZones]);

  return {
    isOneHandedMode,
    gestureState,
    toggleOneHandedMode,
    adjustForOneHandedMode,
    getThumbReachZones,
    handleSmartTouchStart,
    handleSmartTouchMove,
    handleSmartTouchEnd,
    triggerHaptic
  };
};