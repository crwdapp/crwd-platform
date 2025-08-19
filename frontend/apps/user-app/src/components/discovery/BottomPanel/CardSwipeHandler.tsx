import React, { useRef, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  Animated, 
  Dimensions 
} from 'react-native';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.3;

interface CardSwipeHandlerProps {
  children: React.ReactNode;
  isAnimating: boolean;
  onSwipe: (direction: 'left' | 'right') => void;
  translateX: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
}

export const CardSwipeHandler: React.FC<CardSwipeHandlerProps> = ({
  children,
  isAnimating,
  onSwipe,
  translateX,
  opacity,
  scale,
}) => {
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { 
      useNativeDriver: true,
      listener: (event: any) => {
        const { translationX } = event.nativeEvent;
        const progress = Math.abs(translationX) / SWIPE_THRESHOLD;
        
        // Update opacity and scale based on swipe progress with smoother transitions
        opacity.setValue(Math.max(0.4, 1 - progress * 0.6));
        scale.setValue(Math.max(0.95, 1 - progress * 0.05));
      }
    }
  );

  const onHandlerStateChange = useCallback((event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;
      
      if (Math.abs(translationX) > SWIPE_THRESHOLD) {
        const direction = translationX > 0 ? 'right' : 'left';
        onSwipe(direction);
      } else {
        // Snap back to center with faster spring animation
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 150,
            friction: 6,
          }),
          Animated.spring(opacity, {
            toValue: 1,
            useNativeDriver: true,
            tension: 150,
            friction: 6,
          }),
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 150,
            friction: 6,
          }),
        ]).start();
      }
    }
  }, [onSwipe, translateX, opacity, scale]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        enabled={!isAnimating}
      >
        <Animated.View style={styles.cardContent}>
          {children}
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContent: {
    flex: 1,
  },
});

