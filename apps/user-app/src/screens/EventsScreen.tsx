import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import { EventCard } from '../components/events/EventCard';
import { EventDetail } from '../components/events/EventDetail';
import { CalendarPicker } from '../components/CalendarPicker';
import { BottomNavigation } from '../components/BottomNavigation';
import { sampleEvents } from '../data/events';
import { allBars } from '../data/barsData';
import { Event } from '../types/event';
import { userInteractionService } from '../services/userInteractionService';

const { width: screenWidth } = Dimensions.get('window');

type RootStackParamList = {
  BarDetail: { barId: number };
};

type EventsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BarDetail'>;

export const EventsScreen: React.FC = () => {
  const navigation = useNavigation<EventsScreenNavigationProp>();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeTimeFilter, setActiveTimeFilter] = useState<'tonight' | 'this_week' | 'custom' | null>(null);
  const [isTrendingMode, setIsTrendingMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCity, setSelectedCity] = useState('All');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showMyEvents, setShowMyEvents] = useState(false);
  const [userInteractedEventIds, setUserInteractedEventIds] = useState<number[]>([]);

  // Get cities that have bars from the bars data + "All" option
  const getAvailableCities = () => {
    const citiesWithBars = [...new Set(allBars.map(bar => bar.location))];
    const sortedCities = citiesWithBars.sort(); // Sort alphabetically
    return ['All', ...sortedCities]; // Add "All" at the beginning
  };

  const cities = getAvailableCities();

  // Load user interactions from storage
  useEffect(() => {
    const loadUserInteractions = async () => {
      const interactedEventIds = await userInteractionService.getInteractedEventIds();
      setUserInteractedEventIds(interactedEventIds);
    };

    loadUserInteractions();

    // Set up an interval to refresh interactions (in case user interacts in another part of the app)
    const interval = setInterval(loadUserInteractions, 1000);
    return () => clearInterval(interval);
  }, [showMyEvents]); // Refresh when My Events is toggled

  const userInteractedEvents = sampleEvents.filter(event => 
    userInteractedEventIds.includes(event.id)
  );

  const timeFilters = [
    { key: 'tonight', label: 'Tonight', icon: 'clock' },
    { key: 'this_week', label: 'This Week', icon: 'calendar' },
    { key: 'custom', label: 'Custom', icon: 'calendar' }
  ];

  const filteredEvents = useMemo(() => {
    let filtered = [...sampleEvents];

    // Step 1: Apply base filters (city, search) first
    // City filter - filter by selected city (skip if "All" is selected)
    if (selectedCity !== 'All') {
      filtered = filtered.filter(event => {
        return event.barLocation === selectedCity;
      });
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.barName.toLowerCase().includes(query) ||
        event.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Step 2: Apply time-based filters (mutually exclusive)
    if (activeTimeFilter) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (activeTimeFilter) {
        case 'tonight':
          filtered = filtered.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.toDateString() === today.toDateString();
          });
          break;
        case 'this_week':
          filtered = filtered.filter(event => {
            const eventDate = new Date(event.date);
            const weekEnd = new Date(today);
            weekEnd.setDate(today.getDate() + 7);
            return eventDate >= today && eventDate <= weekEnd;
          });
          break;
        case 'custom':
          if (selectedDate) {
            filtered = filtered.filter(event => {
              const eventDate = new Date(event.date);
              const customDate = new Date(selectedDate);
              return eventDate.toDateString() === customDate.toDateString();
            });
          }
          break;
      }
    }

    // Step 3: Apply sorting (trending vs distance)
    if (isTrendingMode) {
      // Sort by popularity (trending)
      filtered.sort((a, b) => {
        const aInteractions = (a.interestedCount || 0) + (a.goingCount || 0);
        const bInteractions = (b.interestedCount || 0) + (b.goingCount || 0);
        return bInteractions - aInteractions;
      });
    } else {
      // Sort by distance (closer events first)
      // For now, we'll sort by event ID as a placeholder since we don't have user location
      // In production, you would calculate actual distance here
      filtered.sort((a, b) => a.id - b.id);
    }

    // Step 4: Apply My Events filter last (if active, filter to only user's events)
    if (showMyEvents) {
      filtered = filtered.filter(event => userInteractedEventIds.includes(event.id));
    }

    return filtered;
  }, [sampleEvents, searchQuery, activeTimeFilter, selectedDate, showMyEvents, userInteractedEventIds, selectedCity, isTrendingMode]);

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleBack = () => {
    setSelectedEvent(null);
  };

  const handleViewBar = (barId: number) => {
    navigation.navigate('BarDetail', { barId });
  };

  const handleTimeFilterClick = (filterKey: 'tonight' | 'this_week' | 'custom') => {
    if (filterKey === 'custom') {
      setShowDatePicker(true);
    } else {
      // Toggle the filter - if it's already active, deactivate it
      if (activeTimeFilter === filterKey) {
        setActiveTimeFilter(null);
      } else {
        setActiveTimeFilter(filterKey);
      }
      setSelectedDate(''); // Clear custom date when switching to other filters
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setActiveTimeFilter('custom');
    setShowDatePicker(false);
  };

  const handleTrendingToggle = () => {
    setIsTrendingMode(!isTrendingMode);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setShowCityPicker(false);
  };

  const refreshUserInteractions = async () => {
    const interactedEventIds = await userInteractionService.getInteractedEventIds();
    setUserInteractedEventIds(interactedEventIds);
  };

  const formatCustomDate = (dateString: string) => {
    if (!dateString) return 'Select Date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  if (selectedEvent) {
    return <EventDetail event={selectedEvent} onBack={handleBack} onViewBar={handleViewBar} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" translucent={false} />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Events</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={18} color="rgba(255, 255, 255, 0.5)" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events, venues, or DJs..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* All Filters in One Row */}
      <View style={styles.filtersSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterScrollContent}
        >
          {/* City Button */}
          <TouchableOpacity
            style={styles.cityFilterButton}
            onPress={() => setShowCityPicker(true)}
          >
            <Icon name="map-pin" size={14} color="#000000" />
            <Text style={styles.cityFilterButtonText}>{selectedCity}</Text>
          </TouchableOpacity>

          {/* Trending Toggle Button */}
          <TouchableOpacity
            style={[styles.trendingToggle, isTrendingMode && styles.trendingToggleActive]}
            onPress={handleTrendingToggle}
          >
            <Icon 
              name={isTrendingMode ? "trending-up" : "map-pin"} 
              size={14} 
              color={isTrendingMode ? "#000000" : "#FFFFFF"} 
            />
            <Text style={[styles.trendingToggleText, isTrendingMode && styles.trendingToggleTextActive]}>
              {isTrendingMode ? "Trending" : "Distance"}
            </Text>
          </TouchableOpacity>

          {/* Time Filter Tabs */}
          {timeFilters.map(({ key, label, icon }) => {
            const isActive = activeTimeFilter === key;
            return (
              <TouchableOpacity
                key={key}
                style={[styles.filterTab, isActive && styles.activeFilterTab]}
                onPress={() => handleTimeFilterClick(key as 'tonight' | 'this_week' | 'custom')}
              >
                <Icon name={icon} size={14} color={isActive ? "#000000" : "#FFFFFF"} />
                <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Custom Date Display */}
      {activeTimeFilter === 'custom' && selectedDate && (
        <View style={styles.customDateContainer}>
          <Text style={styles.customDateText}>
            Events on {formatCustomDate(selectedDate)}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSelectedDate('');
              setActiveTimeFilter(null);
            }}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* My Events Button and Results Count */}
      <View style={styles.bottomControlsContainer}>
        <TouchableOpacity
          style={[styles.myEventsButton, showMyEvents && styles.myEventsButtonActive]}
          onPress={() => setShowMyEvents(!showMyEvents)}
        >
          <Icon 
            name="heart" 
            size={14} 
            color={showMyEvents ? "#000000" : "#FFFFFF"} 
          />
          <Text style={[styles.myEventsButtonText, showMyEvents && styles.myEventsButtonTextActive]}>
            My Events ({userInteractedEvents.length})
          </Text>
        </TouchableOpacity>

        {/* Results Count */}
        {filteredEvents.length > 0 && (
          <Text style={styles.resultsText}>{filteredEvents.length} events</Text>
        )}
      </View>

      {/* Events List */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEventPress={handleEventPress}
              onInteractionChange={refreshUserInteractions}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="calendar" size={48} color="#6B7280" />
            <Text style={styles.emptyTitle}>No Events Found</Text>
            <Text style={styles.emptySubtitle}>
              {!activeTimeFilter && !showMyEvents
                ? 'There are no events available at the moment.'
                : `No ${activeTimeFilter || 'filtered'} events found.`
              }
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                style={styles.modalCloseButton}
              >
                <Icon name="x" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <CalendarPicker
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </View>
        </View>
      </Modal>

      {/* City Picker Modal */}
      <Modal
        visible={showCityPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCityPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select City</Text>
              <TouchableOpacity
                onPress={() => setShowCityPicker(false)}
                style={styles.modalCloseButton}
              >
                <Icon name="x" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.cityPickerContainer}>
              {cities.map(city => (
                <TouchableOpacity
                  key={city}
                  style={styles.cityButton}
                  onPress={() => handleCitySelect(city)}
                >
                  <View style={styles.cityButtonContent}>
                    <Icon 
                      name={city === 'All' ? 'globe' : 'map-pin'} 
                      size={16} 
                      color="#5BC0CE" 
                    />
                    <Text style={styles.cityButtonText}>
                      {city}
                    </Text>
                  </View>
                  {selectedCity === city && (
                    <Icon name="check" size={16} color="#5BC0CE" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 15,
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  filtersSection: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  cityFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5BC0CE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 4,
  },
  cityFilterButtonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 12,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 300,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalCloseButton: {
    padding: 4,
  },
  cityPickerContainer: {
    gap: 8,
  },
  cityButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(91, 192, 206, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(91, 192, 206, 0.2)',
    padding: 12,
    borderRadius: 12,
  },
  cityButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cityButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  filterScrollView: {
    flexGrow: 0,
  },
  filterScrollContent: {
    paddingRight: 20,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeFilterTab: {
    backgroundColor: '#5BC0CE',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  activeFilterText: {
    color: '#000000',
  },
  trendingToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  trendingToggleActive: {
    backgroundColor: '#5BC0CE',
    borderColor: '#5BC0CE',
  },
  trendingToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  trendingToggleTextActive: {
    color: '#000000',
  },
  customDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 12,
    backgroundColor: 'rgba(91, 192, 206, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(91, 192, 206, 0.2)',
  },
  customDateText: {
    color: '#5BC0CE',
    fontSize: 14,
    fontWeight: '500',
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    color: '#5BC0CE',
    fontSize: 12,
  },
  bottomControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  myEventsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  myEventsButtonActive: {
    backgroundColor: '#5BC0CE',
  },
  myEventsButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  myEventsButtonTextActive: {
    color: '#000000',
  },
  resultsText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Extra space for bottom navigation
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

