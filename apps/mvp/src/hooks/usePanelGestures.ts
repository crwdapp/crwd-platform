import { useRef, useState } from 'react';
import { useAppStore } from '../store';

export const usePanelGestures = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragDirection, setDragDirection] = useState<'vertical' | 'horizontal' | null>(null);
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const [velocity, setVelocity] = useState(0);

  // Haptic feedback helper
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (navigator.vibrate) {
      const vibrationMap = { light: [10], medium: [20], heavy: [30] };
      navigator.vibrate(vibrationMap[type]);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating) return;
    
    const { ui } = useAppStore.getState();
    
    // If panel is expanded (list view), only handle gestures from the top area (header)
    if (ui.mapExpanded) {
      const target = e.target as HTMLElement;
      const isHeaderOrDragHandle = target.closest('.panel-header') || target.closest('.drag-handle');
      if (!isHeaderOrDragHandle) {
        return; // Don't intercept scroll gestures in expanded content
      }
    }
    
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartX(e.touches[0].clientX);
    setDragDirection(null);
    setLastTouchTime(Date.now());
    setVelocity(0);
    triggerHaptic('light');
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isAnimating || !panelRef.current) return;

    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const deltaY = currentY - startY;
    const deltaX = currentX - startX;
    
    // Calculate velocity for momentum-based movement
    const currentTime = Date.now();
    const timeDelta = currentTime - lastTouchTime;
    if (timeDelta > 0) {
      setVelocity(Math.abs(deltaY) / timeDelta);
    }
    setLastTouchTime(currentTime);

    // Determine drag direction if not set
    if (!dragDirection) {
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
        setDragDirection('vertical');
      } else if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        setDragDirection('horizontal');
        return; // Let horizontal swipe be handled by bar card
      }
    }

    // Only handle vertical panel gestures
    if (dragDirection === 'vertical') {
      const { ui } = useAppStore.getState();

      if (ui.mapExpanded) {
        // When expanded, allow dragging down to collapse
        if (deltaY > 0) {
          // Changed to 0.30 (30% of screen height) for smaller panel
          const newTransform = Math.min(deltaY * 0.5, window.innerHeight * 0.30);
          panelRef.current.style.transform = `translateY(${newTransform}px)`;
        }
      } else {
        // When collapsed, allow dragging up to expand
        if (deltaY < 0) {
          // Changed to 0.30 (30% of screen height) for smaller panel
          const currentTransform = window.innerHeight * 0.30;
          const newTransform = Math.max(currentTransform + deltaY * 0.5, 0);
          panelRef.current.style.transform = `translateY(${(newTransform / window.innerHeight) * 100}%)`;
        }
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || isAnimating || !panelRef.current) return;
    
    setIsAnimating(true);
    setIsDragging(false);

    if (dragDirection === 'vertical') {
      const currentTransform = panelRef.current.style.transform;
      const translateY = parseFloat(currentTransform.match(/translateY\(([^)]+)\)/)?.[1] || '0');
      const { ui } = useAppStore.getState();
      
      // Velocity-based movement: high velocity (>0.5) triggers state change even with small movement
      const shouldToggleByVelocity = velocity > 0.5;
      
      if (ui.mapExpanded) {
        if (translateY > 100 || shouldToggleByVelocity) {
          // Collapse menu with haptic feedback
          useAppStore.setState(state => { state.ui.mapExpanded = false; });
          panelRef.current.style.transform = 'translateY(70%)';
          triggerHaptic('medium');
        } else {
          // Stay expanded
          panelRef.current.style.transform = 'translateY(0%)';
        }
      } else {
        const currentPercentage = (translateY / window.innerHeight) * 100;
        if (currentPercentage < 35 || shouldToggleByVelocity) {
          // Expand menu with haptic feedback
          useAppStore.setState(state => { state.ui.mapExpanded = true; });
          panelRef.current.style.transform = 'translateY(0%)';
          triggerHaptic('medium');
        } else {
          // Stay collapsed
          panelRef.current.style.transform = 'translateY(70%)';
        }
      }
    }

    // Add bounce animation on state change
    if (panelRef.current) {
      panelRef.current.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      setTimeout(() => {
        if (panelRef.current) {
          panelRef.current.style.transition = 'transform 0.3s ease-out';
        }
      }, 300);
    }

    setTimeout(() => {
      setIsAnimating(false);
      setDragDirection(null);
      setVelocity(0);
    }, 300);
  };

  return { panelRef, handleTouchStart, handleTouchMove, handleTouchEnd };
};