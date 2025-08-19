import { useState, useRef, useCallback } from 'react';
import { Animated, Dimensions } from 'react-native';
import { useAppStore } from '../store';

const { width: screenWidth } = Dimensions.get('window');

export const useBarCardAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  
  // Next card animation values
  const nextCardTranslateX = useRef(new Animated.Value(screenWidth)).current;
  const nextCardOpacity = useRef(new Animated.Value(0)).current;
  const nextCardScale = useRef(new Animated.Value(0.9)).current;

  const animateToNextBar = useCallback((direction: 'left' | 'right', currentIndex: number, totalBars: number) => {
    if (totalBars <= 1 || isAnimating) return;

    setIsAnimating(true);
    
    // Animate current card out and next card in
    const outAnimation = Animated.parallel([
      Animated.timing(translateX, {
        toValue: direction === 'left' ? -screenWidth : screenWidth,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      // Animate next card in
      Animated.timing(nextCardTranslateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(nextCardOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(nextCardScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]);

    outAnimation.start(() => {
      // Update to next/previous bar
      let newIndex = currentIndex;
      if (direction === 'left') {
        newIndex = currentIndex < totalBars - 1 ? currentIndex + 1 : 0;
      } else {
        newIndex = currentIndex > 0 ? currentIndex - 1 : totalBars - 1;
      }
      
      useAppStore.setState(state => ({
        ui: {
          ...state.ui,
          currentBarIndex: newIndex
        }
      }));

      // Reset animations for new card
      translateX.setValue(0);
      opacity.setValue(1);
      scale.setValue(1);
      nextCardTranslateX.setValue(screenWidth);
      nextCardOpacity.setValue(0);
      nextCardScale.setValue(0.9);
      setIsAnimating(false);
    });
  }, [isAnimating, translateX, opacity, scale, nextCardTranslateX, nextCardOpacity, nextCardScale]);

  return {
    isAnimating,
    translateX,
    opacity,
    scale,
    nextCardTranslateX,
    nextCardOpacity,
    nextCardScale,
    animateToNextBar,
  };
};

