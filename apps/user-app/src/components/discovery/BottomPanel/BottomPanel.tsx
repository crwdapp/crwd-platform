import React, { useCallback } from 'react';
import { 
  View, 
  Text,
  StyleSheet, 
  Animated, 
  Dimensions,
  useWindowDimensions
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { PanelHeader } from './PanelHeader';
import { ProgressIndicator } from './ProgressIndicator';
import { BarCard } from './BarCard';
import { CardSwipeHandler } from './CardSwipeHandler';
import { useBarData } from '../../../hooks/useBarData';
import { useBarCardAnimation } from '../../../hooks/useBarCardAnimation';

type RootStackParamList = {
  BarDetail: { barId: number };
};

const { width: screenWidth } = Dimensions.get('window');

export const BottomPanel: React.FC = () => {
  const { height: windowHeight } = useWindowDimensions();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  // Custom hooks for data and animation
  const {
    barsItems,
    currentIndex,
    currentBar,
    averageRating,
    isOpenNowActive,
    isEventFilterActive,
    hasEvents,
    user,
  } = useBarData();

  const {
    isAnimating,
    translateX,
    opacity,
    scale,
    animateToNextBar,
  } = useBarCardAnimation();

  // Calculate bottom navigation height dynamically
  const bottomNavHeight = 12 + 20 + 40 + 4;

  const handleBarSelect = useCallback((barId: number) => {
    navigation.navigate('BarDetail', { barId });
  }, [navigation]);

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    animateToNextBar(direction, currentIndex, barsItems.length);
  }, [animateToNextBar, currentIndex, barsItems.length]);

  // Show no results message if no bars
  if (!currentBar) {
    return (
      <View style={[styles.container, { paddingBottom: bottomNavHeight }]}>
        <View style={styles.content}>
          {/* Header Section */}
          <PanelHeader 
            selectedLocation={user.preferences?.selectedLocation || 'NEAR_ME'}
            isOpenNowActive={isOpenNowActive}
            isEventFilterActive={isEventFilterActive}
          />

          {/* No Results Section */}
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsTitle}>
              {isEventFilterActive ? 'No Events Today' : 'No Bars Found'}
            </Text>
            <Text style={styles.noResultsMessage}>
              {isEventFilterActive 
                ? 'There are no bars with events happening today in this area.'
                : 'Try adjusting your filters or location to find more bars.'
              }
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: bottomNavHeight }]}>
      <View style={styles.content}>
        {/* Header Section */}
        <PanelHeader 
          selectedLocation={user.preferences?.selectedLocation || 'NEAR_ME'}
          isOpenNowActive={isOpenNowActive}
          isEventFilterActive={isEventFilterActive}
        />

        {/* Card Section */}
        <View style={styles.cardContainer}>
          <Animated.View 
            style={[
              styles.cardWrapper,
              {
                transform: [
                  { translateX },
                  { scale }
                ],
                opacity
              }
            ]}
          >
            <CardSwipeHandler
              isAnimating={isAnimating}
              onSwipe={handleSwipe}
              translateX={translateX}
              opacity={opacity}
              scale={scale}
            >
              <BarCard
                bar={currentBar}
                averageRating={averageRating}
                hasEvents={hasEvents}
                onPress={handleBarSelect}
              />
            </CardSwipeHandler>
          </Animated.View>
        </View>

        {/* Progress indicator */}
        <ProgressIndicator 
          totalItems={barsItems.length}
          currentIndex={currentIndex}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
    maxHeight: '50%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: {
    width: '100%',
    maxWidth: screenWidth - 40,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  noResultsMessage: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});
