import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Linking,
  Image,
  Alert
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { useAppStore } from '../store';
import { allBars } from '../data/barsData';
import { getEventImage, handleImageError } from '../utils/imageUtils';
import { DrinkSelectionModal } from '../components/DrinkSelectionModal';
import { ReviewModal } from '../components/ReviewModal';
import { BarDetailHeader } from '../components/barDetail/BarDetailHeader';
import { BarBasicInfo } from '../components/barDetail/BarBasicInfo';
import { BarDrinksMenu } from '../components/barDetail/BarDrinksMenu';
import { BarOpeningHours } from '../components/barDetail/BarOpeningHours';
import { BarLocationMap } from '../components/barDetail/BarLocationMap';


type BarDetailParams = {
  barId: number;
};

export const BarDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<{ BarDetail: BarDetailParams }, 'BarDetail'>>();
  const navigation = useNavigation();
  const { barId } = route.params;
  const [isFavorited, setIsFavorited] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDrinkModal, setShowDrinkModal] = useState(false);
  const [selectedDrinkId, setSelectedDrinkId] = useState<number | null>(null);
  
  const store = useAppStore();
  const reviews = (store as any)?.reviews || { items: [] };
  const user = store?.user;

  // Find the bar by ID
  const bar = allBars.find(b => b.id === barId);
  
  // Get reviews for this bar
  const barReviews = reviews.items.filter((review: any) => review.barId === bar?.id);
  
  // Calculate average rating from reviews
  const averageRating = barReviews.length > 0 
    ? barReviews.reduce((sum: number, review: any) => sum + review.rating, 0) / barReviews.length
    : bar?.rating || 0;

  if (!bar) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContent}>
          <Text style={styles.errorTitle}>Bar not found</Text>
          <TouchableOpacity 
            style={styles.errorButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.errorButtonText}>Return to Discover</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#10B981';
      default: return '#9CA3AF';
    }
  };



  const handleDrinkSelect = (drinkId: number) => {
    setSelectedDrinkId(drinkId);
    setShowDrinkModal(true);
  };

  const handleSubmitReview = async (reviewData: { rating: number; comment: string; barId: number }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newReview = {
      id: Date.now(),
      userId: user.id!,
      userName: user.name!,
      userAvatar: user.avatar,
      barId: reviewData.barId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toISOString(),
      helpful: 0,
      isHelpful: false
    };
    
    // Add review to store
    useAppStore.setState((state: any) => ({
      ...state,
      reviews: {
        ...state.reviews,
        items: [newReview, ...(state.reviews?.items || [])]
      }
    }));
  };

  const handleMarkHelpful = (reviewId: number) => {
    useAppStore.setState((state: any) => {
      const review = state.reviews?.items?.find((r: any) => r.id === reviewId);
      if (review) {
        review.isHelpful = !review.isHelpful;
        review.helpful += review.isHelpful ? 1 : -1;
      }
      return state;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <BarDetailHeader
          bar={bar}
          isFavorited={isFavorited}
          setIsFavorited={setIsFavorited}
          setShowReviewModal={setShowReviewModal}
          averageRating={averageRating}
          barReviewsCount={barReviews.length}
          availableDrinks={bar.availableDrinks}
        />

        <View style={styles.content}>
          {/* Basic Info Section */}
          <BarBasicInfo
            bar={bar}
            averageRating={averageRating}
            barReviewsCount={barReviews.length}
            setShowReviewModal={setShowReviewModal}
          />

          {/* Available Drinks Section */}
          <BarDrinksMenu
            availableDrinksMenu={bar.availableDrinksMenu || []}
            availableDrinksCount={bar.availableDrinks}
            onDrinkSelect={handleDrinkSelect}
          />

          {/* Location Map */}
          <BarLocationMap bar={bar} />

          {/* Opening Hours Section */}
          <BarOpeningHours hours={bar.hours} />

          {/* Events Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Events</Text>
            </View>
            
            <View style={styles.eventsContainer}>
              {bar.events && bar.events.length > 0 ? bar.events.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.eventCard}
                  onPress={() => (navigation as any).navigate('EventDetail', { eventId: event.id })}
                >
                  <View style={styles.eventImageContainer}>
                    <Image 
                      source={{ uri: getEventImage(undefined, 'music') }}
                      style={styles.eventImage}
                    />
                    <View style={styles.eventImageOverlay} />
                    
                    {/* Event Status Badge */}
                    <View style={styles.eventStatusBadge}>
                      <Text style={styles.eventStatusText}>UPCOMING</Text>
                    </View>
                    
                    {/* Date Badge */}
                    <View style={styles.eventDateBadge}>
                      <Text style={styles.eventDateText}>
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.eventContent}>
                    <Text style={styles.eventName} numberOfLines={1}>{event.name}</Text>
                    
                    <View style={styles.eventDetails}>
                      <View style={styles.eventDetail}>
                        <Icon name="calendar" size={14} color="#5bc0be" />
                        <Text style={styles.eventDetailText}>
                          {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </Text>
                      </View>
                      <View style={styles.eventDetail}>
                        <Icon name="clock" size={14} color="#5bc0be" />
                        <Text style={styles.eventDetailText}>8:00 PM</Text>
                      </View>
                      <View style={styles.eventDetail}>
                        <Icon name="users" size={14} color="#5bc0be" />
                        <Text style={styles.eventDetailText}>25+ going</Text>
                      </View>
                      <View style={styles.eventDetail}>
                        <Icon name="music" size={14} color="#5bc0be" />
                        <Text style={styles.eventDetailText}>DJ {event.dj}</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.eventDescription} numberOfLines={2}>
                      Join us for an amazing night with {event.dj}! Experience the best music and atmosphere in the city.
                    </Text>
                    
                    <View style={styles.eventActions}>
                      <Text style={styles.eventPrice}>FREE</Text>
                      <View style={styles.eventButtons}>
                        <TouchableOpacity style={styles.interestedButton}>
                          <Text style={styles.interestedButtonText}>Interested</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.goingButton}>
                          <Text style={styles.goingButtonText}>Going</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )) : (
                <View style={styles.noEventsContainer}>
                  <View style={styles.noEventsContent}>
                    <Icon name="calendar-x" size={48} color="rgba(255, 255, 255, 0.3)" />
                    <Text style={styles.noEventsTitle}>No Events Scheduled</Text>
                    <Text style={styles.noEventsMessage}>
                      This bar doesn't have any events planned yet.
                    </Text>
                    <TouchableOpacity 
                      style={styles.pokeButton}
                      onPress={() => Alert.alert('Event Request Sent', 'The bar has been notified that you\'re interested in events!')}
                    >
                      <Icon name="zap" size={18} color="#000000" />
                      <Text style={styles.pokeButtonText}>Poke for Events</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Review Modal */}
      <ReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        barName={bar.name}
        barId={bar.id}
        onSubmitReview={handleSubmitReview}
      />

      {/* Drink Selection Modal */}
      <DrinkSelectionModal 
        visible={showDrinkModal}
        onClose={() => {
          setShowDrinkModal(false);
          setSelectedDrinkId(null);
        }}
        barId={bar.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  eventsContainer: {
    gap: 16,
  },
  eventCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  eventImageContainer: {
    height: 200,
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  eventImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  eventStatusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(111, 255, 233, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  eventStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000000',
  },
  eventDateBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  eventDateText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  eventContent: {
    padding: 16,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  eventDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventDetailText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  eventDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 12,
    lineHeight: 16,
  },
  eventActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5bc0be',
  },
  eventButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  interestedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  interestedButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  goingButton: {
    backgroundColor: '#5bc0be',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  goingButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
  },
  noEventsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  noEventsContent: {
    alignItems: 'center',
    gap: 16,
  },
  noEventsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  noEventsMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  pokeButton: {
    backgroundColor: '#5bc0be',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#5bc0be',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pokeButtonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 14,
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  errorButton: {
    backgroundColor: '#5bc0be',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  errorButtonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 16,
  },
});
