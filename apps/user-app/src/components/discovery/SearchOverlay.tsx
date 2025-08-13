import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSearch } from '../../hooks/useSearch';
import { useAppStore } from '../../store';
import { SearchResult } from '../../services/searchService';
import { useNavigation, NavigationProp } from '@react-navigation/native';

interface SearchOverlayProps {
  onClose: () => void;
  visible: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ onClose, visible }) => {
  const { query, results, loading, setQuery, clearSearch, selectCategory, activeCategory } = useSearch({
    autoSearch: true,
    debounceMs: 300
  });
  const [isInputFocused, setIsInputFocused] = useState(false);
  const searchInputRef = useRef<TextInput>(null);
  
  // Debug logging
  useEffect(() => {
    console.log('🔍 SearchOverlay - Query:', query);
    console.log('🔍 SearchOverlay - Results count:', results.length);
    console.log('🔍 SearchOverlay - Loading:', loading);
    if (results.length > 0) {
      console.log('🔍 SearchOverlay - First result:', results[0]);
    }
  }, [query, results, loading]);
  
  const slideAnim = new Animated.Value(visible ? 0 : -400);
  const fadeAnim = new Animated.Value(visible ? 1 : 0);
  const navigation = useNavigation<NavigationProp<any>>();

  useEffect(() => {
    if (visible) {
      // Slide in from top with fade
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Slide out to top with fade
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -400,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible]);

  // Auto-focus input when overlay becomes visible
  useEffect(() => {
    if (visible) {
      // Focus the input immediately when overlay becomes visible
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
      // Also try after a short delay in case the first attempt fails
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Dismiss keyboard when overlay closes
      Keyboard.dismiss();
      setIsInputFocused(false);
    }
  }, [visible]);

  const handleResultPress = (result: SearchResult) => {
    try {
      if (result.type === 'bar') {
        // Navigate to specific bar page
        const barId = parseInt(result.id.split('-')[1]);
        navigation.navigate('BarDetail' as never, { barId } as never);
      } else if (result.type === 'event' && result.barId) {
        // Navigate to specific event page (or bar with event focus)
        const barId = result.barId;
        navigation.navigate('BarDetail' as never, { 
          barId,
          showEvents: true 
        } as never);
      } else if (result.type === 'cocktail') {
        // Apply drink filter to map and close search modal
        const drinkName = result.name;
        console.log('🍸 Applying drink filter for:', drinkName);
        
        // Filter bars to only show those with this specific drink
        const store = useAppStore.getState();
        const barsWithDrink = store.bars.all.filter(bar => 
          bar.availableDrinksMenu?.some(drink => 
            drink.name.toLowerCase() === drinkName.toLowerCase()
          )
        );
        
        // Update the store with filtered bars
        useAppStore.setState(state => ({
          bars: {
            ...state.bars,
            filtered: barsWithDrink
          },
          ui: {
            ...state.ui,
            activeDrinkFilter: drinkName
          }
        }));
        
        console.log('🗺️ Filtered to', barsWithDrink.length, 'bars with', drinkName);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
    onClose();
  };

  // Handle dismissing keyboard and closing overlay when tapping outside
  const handleOutsidePress = () => {
    Keyboard.dismiss();
    setIsInputFocused(false);
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
    onClose();
  };

  // Handle input focus/blur
  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  // Animate clear button visibility
  useEffect(() => {
    if (isInputFocused && query) {
      // Show clear button when focused and has text
    }
  }, [isInputFocused, query]);

  // Handle clear button with haptic feedback
  const handleClearPress = () => {
    clearSearch();
    setIsInputFocused(false);
    Keyboard.dismiss();
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
    onClose();
  };

  // Handle search submission
  const handleSearchSubmit = () => {
    if (query.trim()) {
      Keyboard.dismiss();
      // Keep the overlay open to show results
    }
  };

  // Handle category selection with visual feedback
  const handleCategoryPress = (category: 'all' | 'bars' | 'cocktails' | 'events') => {
    selectCategory(category as any);
  };

  const categories = [
    { id: 'all', label: 'All', icon: 'search' },
    { id: 'bars', label: 'Bars', icon: 'location' },
    { id: 'cocktails', label: 'Drinks', icon: 'wine' },
    { id: 'events', label: 'Events', icon: 'calendar' },
  ];

  // Calculate adaptive height based on content
  const getAdaptiveHeight = () => {
    const bars = results.filter(r => r.type === 'bar').length;
    const cocktails = results.filter(r => r.type === 'cocktail').length;
    const events = results.filter(r => r.type === 'event').length;
    
    let estimatedHeight = 0;
    
    // Add height for each category that has results (more accurate measurements)
    if (bars > 0) estimatedHeight += 50 + 180; // Header + bar cards (taller with image)
    if (cocktails > 0) estimatedHeight += 50 + 140; // Header + cocktail circular cards
    if (events > 0) estimatedHeight += 50 + 180; // Header + event cards (taller with image)
    
    // Add padding and spacing
    estimatedHeight += 60;
    
    // More generous maximum height
    return Math.min(Math.max(estimatedHeight, 250), 600);
  };



  const renderBarCard = (result: SearchResult) => (
    <TouchableOpacity
      style={styles.barCard}
      onPress={() => handleResultPress(result)}
      activeOpacity={0.7}
    >
      {result.image ? (
        <Image source={{ uri: result.image }} style={styles.barImage} contentFit="cover" />
      ) : (
        <View style={styles.barImagePlaceholder}>
          <Ionicons name="location" size={20} color="#FFFFFF" />
        </View>
      )}
      <View style={styles.barContent}>
        <View style={styles.barHeader}>
          <Text style={styles.barName} numberOfLines={1}>{result.name}</Text>
          {result.rating && (
            <Text style={styles.barRating}>★ {result.rating}</Text>
          )}
        </View>
        <Text style={styles.barType} numberOfLines={1}>{result.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderDrinkCard = (result: SearchResult) => (
    <TouchableOpacity
      style={styles.drinkCard}
      onPress={() => handleResultPress(result)}
      activeOpacity={0.7}
    >
      <View style={styles.drinkImageContainer}>
        {result.image ? (
          <Image source={{ uri: result.image }} style={styles.drinkImage} contentFit="cover" />
        ) : (
          <View style={styles.drinkImagePlaceholder}>
            <Ionicons name="wine" size={24} color="#FFFFFF" />
          </View>
        )}
      </View>
      <Text style={styles.drinkName} numberOfLines={2}>{result.name}</Text>
    </TouchableOpacity>
  );

  const renderEventCard = (result: SearchResult) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => handleResultPress(result)}
      activeOpacity={0.7}
    >
      <View style={styles.eventImageContainer}>
        {result.image ? (
          <Image source={{ uri: result.image }} style={styles.eventImage} contentFit="cover" />
        ) : (
          <View style={styles.eventImagePlaceholder}>
            <Ionicons name="calendar" size={24} color="#FFFFFF" />
          </View>
        )}
        <View style={styles.eventOverlay}>
          <View style={styles.eventDateBadge}>
            <Text style={styles.eventDateText}>{result.subtitle.split(' • ')[0]}</Text>
          </View>
        </View>
      </View>
      <View style={styles.eventContent}>
        <Text style={styles.eventName} numberOfLines={1}>{result.name}</Text>
        <Text style={styles.eventLocation} numberOfLines={1}>at {result.barName}</Text>
        {result.rating && (
          <Text style={styles.eventRating}>★ {result.rating}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCategoryRow = (type: 'bar' | 'cocktail' | 'event', title: string) => {
    const typeResults = results.filter(r => r.type === type);
    if (typeResults.length === 0) return null;

    const renderCard = (result: SearchResult) => {
      switch (type) {
        case 'bar': return renderBarCard(result);
        case 'cocktail': return renderDrinkCard(result);
        case 'event': return renderEventCard(result);
        default: return null;
      }
    };

    return (
      <View key={type} style={styles.categoryRow}>
        <View style={styles.categoryRowHeader}>
          <Text style={styles.categoryRowTitle}>{title}</Text>
          <Text style={styles.categoryRowCount}>{typeResults.length}</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRowScroll}
        >
          {typeResults.map((result, index) => (
            <View key={`${result.id}-${index}`} style={styles.cardWrapper}>
              {renderCard(result)}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#FFFFFF" style={styles.searchIcon} />
                                           <TextInput
              ref={searchInputRef}
              style={[
                styles.searchInput,
                isInputFocused && styles.searchInputFocused
              ]}
              placeholder="Search bars, cocktails, events..."
              placeholderTextColor="#888888"
              value={query}
              onChangeText={setQuery}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              autoFocus={false}
              returnKeyType="search"
              blurOnSubmit={false}
              onSubmitEditing={handleSearchSubmit}
            />
                     <TouchableOpacity
             onPress={handleClearPress}
             style={[
               styles.clearButton,
               (isInputFocused && query) && styles.clearButtonVisible
             ]}
           >
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>


        {/* Search Results */}
        {query && query.trim() && (
          <View style={[styles.resultsContainer, { maxHeight: getAdaptiveHeight() }]}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Searching...</Text>
              </View>
            ) : results.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No results found</Text>
                <Text style={styles.noResultsSubtext}>
                  Try searching for bars, cocktails, or events
                </Text>
              </View>
            ) : (
              <ScrollView 
                style={styles.resultsList} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.resultsContent}
              >
                {renderCategoryRow('bar', '🏢 Bars')}
                {renderCategoryRow('cocktail', '🍸 Cocktails')}
                {renderCategoryRow('event', '🎉 Events')}
              </ScrollView>
            )}
          </View>
        )}
                     </View>
         </TouchableWithoutFeedback>
       </Animated.View>
     </Animated.View>
   </TouchableWithoutFeedback>
 );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1000,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.98)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
    zIndex: 1001,
  },
  searchContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  searchInputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 12,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 16,
    paddingHorizontal: 48,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(64, 64, 64, 0.5)',
  },
  searchInputFocused: {
    backgroundColor: '#1A1A1A',
    borderColor: '#5BC0CE',
    borderWidth: 2,
    shadowColor: '#5BC0CE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  clearButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    zIndex: 1,
    opacity: 0,
    transform: [{ scale: 0.8 }],
    transition: 'all 0.2s ease',
  },
  clearButtonVisible: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
  categoryTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    marginBottom: 8,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 8,
  },
  activeCategoryTab: {
    borderBottomColor: '#5BC0CE',
    backgroundColor: 'rgba(91, 192, 206, 0.15)',
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#CCCCCC',
  },
  activeCategoryLabel: {
    color: '#5BC0CE',
  },
  resultsContainer: {
    // Height is calculated dynamically
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  noResultsContainer: {
    padding: 32,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  debugText: {
    fontSize: 12,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  resultsList: {
    flexGrow: 1,
    flexShrink: 1,
  },
  resultsContent: {
    paddingBottom: 8,
  },
  // Category Row Styles
  categoryRow: {
    marginBottom: 20,
  },
  categoryRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryRowTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  categoryRowCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5BC0CE',
    backgroundColor: 'rgba(91, 192, 206, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryRowScroll: {
    paddingLeft: 16,
  },
  cardWrapper: {
    marginRight: 12,
  },
  
  // Bar Card Styles
  barCard: {
    width: 160,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    overflow: 'hidden',
  },
  barImage: {
    width: '100%',
    height: 80,
  },
  barImagePlaceholder: {
    width: '100%',
    height: 80,
    backgroundColor: '#5BC0CE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barContent: {
    padding: 8,
  },
  barHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  barName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  barType: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  barRating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  
  // Drink Card Styles
  drinkCard: {
    width: 90,
    padding: 8,
    alignItems: 'center',
  },
  drinkImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor: '#5BC0CE',
    marginBottom: 6,
    borderWidth: 2,
    borderColor: '#5BC0CE',
    shadowColor: '#5BC0CE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  drinkImage: {
    width: '100%',
    height: '100%',
  },
  drinkImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#5BC0CE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drinkName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    minHeight: 26,
    lineHeight: 15,
  },
  
  // Event Card Styles
  eventCard: {
    width: 180,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6C200',
    overflow: 'hidden',
  },
  eventImageContainer: {
    position: 'relative',
    height: 100,
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  eventImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  eventDateBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  eventDateText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  eventContent: {
    padding: 6,
    alignItems: 'center',
  },
  eventName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 3,
    textAlign: 'center',
  },
  eventLocation: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'center',
  },
  eventRating: {
    fontSize: 9,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  categorySection: {
    marginBottom: 8,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  resultCard: {
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#333333',
    transform: [{ scale: 1 }],
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  resultImage: {
    width: 56,
    height: 56,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#5BC0CE',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  resultContent: {
    flex: 1,
    gap: 4,
  },
  resultName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 2,
    fontWeight: '400',
  },
  barName: {
    fontSize: 13,
    color: '#5BC0CE',
    fontWeight: '500',
  },
  resultStatus: {
    alignItems: 'flex-end',
    gap: 6,
    minWidth: 40,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rating: {
    fontSize: 13,
    color: '#F59E0B',
    fontWeight: '600',
  },
});
