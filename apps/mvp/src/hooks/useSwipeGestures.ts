import { useState } from 'react';
import { useAppStore } from '../store';

export const useSwipeGestures = () => {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState<'horizontal' | 'vertical' | null>(null);
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [lastX, setLastX] = useState(0);

  // Haptic feedback helper
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (navigator.vibrate) {
      const vibrationMap = { light: [10], medium: [20], heavy: [30] };
      navigator.vibrate(vibrationMap[type]);
    }
  };

  // Show card peek for adjacent cards
  const showCardPeek = (direction: 'left' | 'right', progress: number) => {
    const { bars, ui } = useAppStore.getState();
    
    let peekIndex = direction === 'left' 
      ? ui.currentBarIndex + 1 
      : ui.currentBarIndex - 1;
    
    // Handle looping for all modes
    if (bars.items.length > 0) {
      if (peekIndex >= bars.items.length) {
        peekIndex = 0; // Loop to beginning
      } else if (peekIndex < 0) {
        peekIndex = bars.items.length - 1; // Loop to end
      }
    }
    
    if (peekIndex >= 0 && peekIndex < bars.items.length) {
      const peekCard = document.querySelector('.bar-card-peek') as HTMLElement;
      if (peekCard) {
        const peekBar = bars.items[peekIndex];
        // Update peek card content dynamically
        const peekImage = peekCard.querySelector('img') as HTMLImageElement;
        const peekName = peekCard.querySelector('.peek-name') as HTMLElement;
        const peekType = peekCard.querySelector('.peek-type') as HTMLElement;
        
        if (peekImage && peekName && peekType) {
          peekImage.src = peekBar.image;
          peekName.textContent = peekBar.name;
          peekType.textContent = `${peekBar.type} • ${peekBar.distance}`;
        }
        
        const translateX = direction === 'left' 
          ? `${100 - (progress * 80)}%` 
          : `${-100 + (progress * 80)}%`;
        
        peekCard.style.transform = `translateX(${translateX}) scale(${0.8 + progress * 0.2})`;
        peekCard.style.opacity = (progress * 0.8).toString();
        peekCard.style.display = 'block';
      }
    }
  };

  // Hide card peek
  const hideCardPeek = () => {
    const peekCard = document.querySelector('.bar-card-peek') as HTMLElement;
    if (peekCard) {
      peekCard.style.display = 'none';
    }
  };

  // Update progress indicator
  const updateProgressIndicator = (currentIndex: number, totalBars: number, swipeProgress: number = 0) => {
    const indicator = document.querySelector('.swipe-progress-indicator') as HTMLElement;
    if (indicator) {
      const dots = indicator.querySelectorAll('.progress-dot');
      dots.forEach((dot, index) => {
        const dotElement = dot as HTMLElement;
        if (index === currentIndex) {
          dotElement.className = 'progress-dot w-6 h-2 bg-white/90 rounded-full transition-all duration-200';
        } else if (Math.abs(index - currentIndex) === 1 && Math.abs(swipeProgress) > 0.3) {
          // Animate adjacent dots when close to threshold
          dotElement.className = 'progress-dot w-4 h-2 bg-white/60 rounded-full transition-all duration-200';
        } else {
          dotElement.className = 'progress-dot w-2 h-2 bg-white/30 rounded-full transition-all duration-200';
        }
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const { ui } = useAppStore.getState();
    // Only allow horizontal swipe when menu is collapsed
    if (ui.mapExpanded) return;
    
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
    setLastX(e.touches[0].clientX);
    setDragDirection(null);
    setLastTouchTime(Date.now());
    setVelocity(0);
    triggerHaptic('light');
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    // Calculate velocity for momentum-based swiping
    const currentTime = Date.now();
    const timeDelta = currentTime - lastTouchTime;
    if (timeDelta > 0) {
      setVelocity(Math.abs(currentX - lastX) / timeDelta);
    }
    setLastX(currentX);
    setLastTouchTime(currentTime);

    // Determine drag direction if not set
    if (!dragDirection) {
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        setDragDirection('horizontal');
      } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
        setDragDirection('vertical');
        return; // Let panel handle vertical gestures
      }
    }

    // Only handle horizontal swipes for bar navigation
    if (dragDirection === 'horizontal') {
      // Safely prevent scrolling only if the event is cancelable
      if (e.cancelable) {
        try {
          e.preventDefault();
        } catch (error) {
          // Ignore passive event listener errors
          console.debug('Cannot prevent default on passive event listener');
        }
      }
      
      const { bars, ui } = useAppStore.getState();
      const cardElement = document.querySelector('.bar-card') as HTMLElement;
      if (cardElement) {
        const progress = Math.abs(deltaX) / window.innerWidth;
        const opacity = Math.max(0.3, 1 - progress * 1.5);
        const scale = Math.max(0.85, 1 - progress * 0.3);
        
        // Enhanced card transform with better easing
        const resistance = progress > 0.5 ? 0.5 + (progress - 0.5) * 0.3 : 1;
        const adjustedDeltaX = deltaX * resistance;
        
        cardElement.style.transform = `translateX(${adjustedDeltaX}px) scale(${scale})`;
        cardElement.style.opacity = opacity.toString();
        
        // Show card peek and update progress
        if (progress > 0.15) {
          const direction = deltaX > 0 ? 'right' : 'left';
          showCardPeek(direction, Math.min(progress, 1));
          
          // Trigger haptic feedback at threshold
          if (progress > 0.3 && progress < 0.35) {
            triggerHaptic('medium');
          }
        } else {
          hideCardPeek();
        }
        
        // Update progress indicator
        updateProgressIndicator(ui.currentBarIndex, bars.items.length, progress * (deltaX > 0 ? 1 : -1));
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (dragDirection === 'horizontal') {
      const { bars, ui } = useAppStore.getState();
      
      const cardElement = document.querySelector('.bar-card') as HTMLElement;
      if (cardElement) {
        const currentTransform = cardElement.style.transform;
        const translateX = parseFloat(currentTransform.match(/translateX\(([^)]+)\)/)?.[1] || '0');
        const progress = Math.abs(translateX) / window.innerWidth;
        
        // Enhanced threshold logic with velocity consideration
        const velocityThreshold = velocity > 0.8; // High velocity triggers change
        const positionThreshold = progress > 0.25; // 25% swipe threshold
        const shouldChangeBar = velocityThreshold || positionThreshold;
        
        let cardChanged = false;
        
        if (shouldChangeBar) {
          // Enable infinite looping for all modes
          if (translateX > 0) {
            // Swipe right - previous bar (or loop to end)
            let newIndex;
            if (ui.currentBarIndex > 0) {
              newIndex = ui.currentBarIndex - 1;
            } else if (bars.items.length > 0) {
              // Loop to end
              newIndex = bars.items.length - 1;
            } else {
              newIndex = 0;
            }
            
            const newBarId = bars.items[newIndex]?.id;
            useAppStore.setState(state => { 
              state.ui.currentBarIndex = newIndex;
              state.ui.selectedBarId = newBarId || null;
            });
            cardChanged = true;
            triggerHaptic('heavy');
          } else if (translateX < 0) {
            // Swipe left - next bar (or loop to beginning)
            let newIndex;
            if (ui.currentBarIndex < bars.items.length - 1) {
              newIndex = ui.currentBarIndex + 1;
            } else if (bars.items.length > 0) {
              // Loop to beginning
              newIndex = 0;
            } else {
              newIndex = 0;
            }
            
            const newBarId = bars.items[newIndex]?.id;
            useAppStore.setState(state => { 
              state.ui.currentBarIndex = newIndex;
              state.ui.selectedBarId = newBarId || null;
            });
            cardChanged = true;
            triggerHaptic('heavy');
          }
        }
        
        // Enhanced animation with momentum
        const animationDuration = cardChanged ? 400 : 300;
        const easing = cardChanged 
          ? 'cubic-bezier(0.165, 0.84, 0.44, 1)' 
          : 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        cardElement.style.transition = `transform ${animationDuration}ms ${easing}, opacity ${animationDuration}ms ${easing}`;
        cardElement.style.transform = 'translateX(0px) scale(1)';
        cardElement.style.opacity = '1';
        
        // Hide peek card with animation
        hideCardPeek();
        
        // Update progress indicator
        setTimeout(() => {
          updateProgressIndicator(ui.currentBarIndex, bars.items.length);
        }, 50);
        
        setTimeout(() => {
          if (cardElement) {
            cardElement.style.transition = '';
          }
        }, animationDuration);
      }
    }
    
    setDragDirection(null);
    setVelocity(0);
  };

  return { handleTouchStart, handleTouchMove, handleTouchEnd };
};