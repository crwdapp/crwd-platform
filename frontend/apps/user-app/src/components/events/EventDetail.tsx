import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView, 
  Dimensions,
  Alert,
  Linking,
  StatusBar,
  SafeAreaView,
  PanResponder,
  Share
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Event, EventStatus, EventDrink } from '../../types/event';
import { userInteractionService } from '../../services/userInteractionService';

interface EventDetailProps {
  event: Event;
  onBack: () => void;
  onViewBar?: (barId: number) => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({ event, onBack, onViewBar }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userAttendance, setUserAttendance] = useState<'going' | 'interested' | null>(null);
  
  // Swipe back gesture
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Only respond to horizontal swipes starting from the left edge
      return (
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
        gestureState.dx > 0 &&
        evt.nativeEvent.pageX < 50 // Only from left edge
      );
    },
    onPanResponderMove: (evt, gestureState) => {
      // Optional: Add visual feedback during swipe
    },
    onPanResponderRelease: (evt, gestureState) => {
      // If swiped right more than 100 pixels, go back
      if (gestureState.dx > 100) {
        onBack();
      }
    },
  });
  
  // Load user interactions on mount
  React.useEffect(() => {
    const loadInteractions = async () => {
      const savedStatus = await userInteractionService.hasInteraction(event.id, 'saved');
      const interestedStatus = await userInteractionService.hasInteraction(event.id, 'interested');
      const goingStatus = await userInteractionService.hasInteraction(event.id, 'going');
      
      setIsBookmarked(savedStatus);
      
      if (goingStatus) {
        setUserAttendance('going');
      } else if (interestedStatus) {
        setUserAttendance('interested');
      } else {
        setUserAttendance(null);
      }
    };

    loadInteractions();
  }, [event.id]);

  const handleBookmark = async () => {
    const newBookmarkStatus = await userInteractionService.toggleInteraction(event.id, 'saved');
    setIsBookmarked(newBookmarkStatus);
  };

  const handleAttendance = async (status: 'going' | 'interested') => {
    if (userAttendance === status) {
      await userInteractionService.removeInteraction(event.id, status);
      setUserAttendance(null);
    } else {
      if (userAttendance) {
        await userInteractionService.removeInteraction(event.id, userAttendance);
      }
      await userInteractionService.addInteraction(event.id, status);
      setUserAttendance(status);
    }
  };

  const handleShare = async () => {
    try {
      const shareMessage = `🎉 Check out this event!\n\n📅 ${event.name}\n📍 ${event.barName}, ${event.barLocation}\n🗓️ ${formatDate(event.date)}\n⏰ ${formatTime(event.startTime)}\n\n${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}`;
      
      const result = await Share.share({
        message: shareMessage,
        title: `${event.name} at ${event.barName}`,
      });

      if (result.action === Share.sharedAction) {
        console.log('Event shared successfully');
      }
    } catch (error) {
      console.error('Error sharing event:', error);
      Alert.alert(
        'Share Error',
        'Could not share this event. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const getEngagementScore = () => {
    const engagement = event.views + event.shares + event.goingCount + event.interestedCount;
    if (engagement > 500) return { score: '🔥', label: 'Hot', color: '#EF4444' };
    if (engagement > 200) return { score: '⭐', label: 'Popular', color: '#F59E0B' };
    return { score: '📅', label: 'New', color: '#3B82F6' };
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleDrinkSelect = (drink: EventDrink) => {
    Alert.alert(
      'Select Drink',
      `${drink.name}\n${drink.description}\n\nCost: ${drink.tokenCost} tokens (${drink.originalPrice})${drink.specialOffer ? `\n🎉 ${drink.specialOffer}` : ''}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reserve with Tokens', onPress: () => handleReserveDrink(drink) }
      ]
    );
  };

  const handleReserveDrink = (drink: EventDrink) => {
    // TODO: Implement token-based drink reservation
    Alert.alert(
      'Coming Soon',
      'Drink reservation with tokens will be available soon!',
      [{ text: 'OK' }]
    );
    console.log('Reserve drink with tokens:', drink);
  };

  const engagement = getEngagementScore();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" translucent={false} />
      <View style={styles.container} {...panResponder.panHandlers}>
      
      {/* Hero Image - Moved to top */}
      <View style={styles.heroContainer}>
        <Image 
          source={{ uri: event.image }} 
          style={styles.heroImage}
          resizeMode="cover"
        />
        
        {/* Back Button - Top left overlay */}
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        {/* Share Button - Top right */}
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Icon name="share-2" size={14} color="#000000" />
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
        
        {/* Engagement Badge - Bottom left */}
        <View style={[styles.engagementBadge, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <Text style={styles.engagementText}>{engagement.score} {engagement.label}</Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Action Buttons Section - Now inside scroll view */}
        <View style={styles.actionButtonsContainer}>
          {/* Left side - View Bar button */}
          <View style={styles.leftActions}>
            {onViewBar && (
              <TouchableOpacity
                style={styles.viewBarActionButton}
                onPress={() => onViewBar(event.barId)}
              >
                <Icon name="map-pin" size={14} color="#5BC0CE" />
                <Text style={styles.viewBarActionText}>View Bar</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Right side - Interaction buttons */}
          <View style={styles.rightActions}>
            <TouchableOpacity
              onPress={() => handleAttendance('interested')}
              style={[
                styles.headerActionButton,
                userAttendance === 'interested' && styles.interestedHeaderButton
              ]}
            >
              <Text style={[
                styles.headerActionText,
                userAttendance === 'interested' && styles.interestedHeaderText
              ]}>
                Interested
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => handleAttendance('going')}
              style={[
                styles.headerActionButton,
                userAttendance === 'going' && styles.goingHeaderButton
              ]}
            >
              <Text style={[
                styles.headerActionText,
                userAttendance === 'going' && styles.goingHeaderText
              ]}>
                Going
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleBookmark}
              style={[
                styles.bookmarkHeaderButton,
                isBookmarked && styles.bookmarkedHeaderButton
              ]}
            >
              <Icon 
                name="bookmark" 
                size={18} 
                color={isBookmarked ? "#000000" : "#FFFFFF"} 
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* Event Info */}
        <View style={styles.eventInfo}>
          {/* Title and Location */}
          <View style={styles.titleSection}>
            <Text style={styles.eventTitle}>{event.name}</Text>
            <View style={styles.locationRow}>
              <Icon name="map-pin" size={16} color="#D0D8E0" />
              <Text style={styles.barName}>{event.barName}</Text>
              <Text style={styles.locationSeparator}>•</Text>
              <Text style={styles.barLocation}>{event.barLocation}</Text>
            </View>
          </View>

          {/* Date and Time Grid */}
          <View style={styles.dateTimeGrid}>
            <View style={styles.dateTimeItem}>
              <Icon name="calendar" size={16} color="#D0D8E0" />
              <Text style={styles.dateTimeText}>{formatDate(event.date)}</Text>
            </View>
            <View style={styles.dateTimeItem}>
              <Icon name="clock" size={16} color="#D0D8E0" />
              <Text style={styles.dateTimeText}>
                {formatTime(event.startTime)} - {formatTime(event.endTime)}
              </Text>
            </View>
          </View>

          {/* Attendance Stats Box */}
          <View style={styles.attendanceStatsBox}>
            <View style={styles.statColumn}>
              <Text style={styles.statNumber}>{event.goingCount}</Text>
              <Text style={styles.statLabel}>Going</Text>
            </View>
            <View style={styles.statColumn}>
              <Text style={styles.statNumber}>{event.interestedCount}</Text>
              <Text style={styles.statLabel}>Interested</Text>
            </View>
            <View style={styles.statColumn}>
              <Text style={styles.statNumber}>
                {event.price === 0 ? 'FREE' : `$${event.price}`}
              </Text>
              <Text style={styles.statLabel}>Entry</Text>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this event</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          {/* Additional Info */}
          <View style={styles.additionalInfo}>
            {event.dj && (
              <View style={styles.infoRow}>
                <Icon name="star" size={16} color="#D0D8E0" />
                <Text style={styles.infoText}>DJ: {event.dj}</Text>
              </View>
            )}
            {event.genre && (
              <View style={styles.infoRow}>
                <Icon name="trending-up" size={16} color="#D0D8E0" />
                <Text style={styles.infoText}>Genre: {event.genre}</Text>
              </View>
            )}
            {event.ageRestriction && (
              <View style={styles.infoRow}>
                <Icon name="users" size={16} color="#D0D8E0" />
                <Text style={styles.infoText}>Age: {event.ageRestriction}</Text>
              </View>
            )}
          </View>

          {/* Available Drinks */}
          {event.availableDrinks && event.availableDrinks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Available Drinks</Text>
              <Text style={styles.sectionSubtitle}>Use tokens to get these drinks at the event</Text>
              <View style={styles.drinksContainer}>
                {event.availableDrinks.map((drink) => (
                  <TouchableOpacity
                    key={drink.drinkId}
                    style={styles.drinkCard}
                    onPress={() => handleDrinkSelect(drink)}
                  >
                    <View style={styles.drinkImageContainer}>
                      <Image
                        source={{ uri: drink.image || 'https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                        style={styles.drinkImage}
                        resizeMode="cover"
                      />
                      {drink.specialOffer && (
                        <View style={styles.offerBadge}>
                          <Text style={styles.offerText}>🎉 {drink.specialOffer}</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.drinkInfo}>
                      <Text style={styles.drinkName}>{drink.name}</Text>
                      <Text style={styles.drinkDescription} numberOfLines={2}>
                        {drink.description}
                      </Text>
                      <View style={styles.drinkPricing}>
                        <View style={styles.leftPricing}>
                          <View style={styles.quantityContainer}>
                            <Text style={styles.cocktailEmoji}>🍸</Text>
                            <Text style={styles.quantityText}>{drink.totalQuantity} available</Text>
                          </View>
                        </View>
                        <View style={styles.rightPricing}>
                          <Text style={styles.originalPrice}>{drink.originalPrice}</Text>
                          <Text style={styles.halfPrice}>{Math.round(parseFloat(drink.originalPrice.replace(/[^\d.]/g, '')) / 2)} RON</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Ticket Information - Only for paid events */}
          {event.price > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ticket Information</Text>
              <View style={styles.ticketBox}>
                {event.isTicketed && event.ticketUrl ? (
                  <>
                    <View style={styles.ticketPriceRow}>
                      <Text style={styles.ticketLabel}>Ticket Price:</Text>
                      <Text style={styles.ticketPrice}>${event.price}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.ticketButton}
                      onPress={() => Linking.openURL(event.ticketUrl!)}
                    >
                      <Text style={styles.ticketButtonText}>Get Tickets</Text>
                      <Icon name="external-link" size={16} color="#000000" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={styles.ticketPriceRow}>
                      <Text style={styles.ticketLabel}>Entrance Fee:</Text>
                      <Text style={styles.ticketPrice}>${event.price}</Text>
                    </View>
                    <Text style={styles.ticketNote}>Pay at the entrance</Text>
                  </>
                )}
              </View>
            </View>
          )}

          {/* Event Performance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Performance</Text>
            <View style={styles.performanceBox}>
              <Text style={styles.performanceTitle}>Event Performance</Text>
              <View style={styles.performanceGrid}>
                <View style={styles.performanceItem}>
                  <Text style={styles.performanceNumber}>{event.views.toLocaleString()}</Text>
                  <Text style={styles.performanceLabel}>Views</Text>
                </View>
                <View style={styles.performanceItem}>
                  <Text style={styles.performanceNumber}>{event.shares}</Text>
                  <Text style={styles.performanceLabel}>Shares</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  heroContainer: {
    position: 'relative',
    height: 264, // Match web h-64
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50, // Increased to avoid status bar
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  shareButton: {
    position: 'absolute',
    top: 50, // Increased to avoid status bar
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#5BC0CE',
    gap: 4,
    zIndex: 10,
  },
  shareText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  engagementBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  engagementText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  leftActions: {
    alignItems: 'flex-start',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewBarActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(91, 192, 206, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  viewBarActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5BC0CE',
  },
  headerActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  interestedHeaderButton: {
    backgroundColor: '#5BC0CE',
  },
  goingHeaderButton: {
    backgroundColor: '#10B981',
  },
  headerActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  interestedHeaderText: {
    color: '#000000',
  },
  goingHeaderText: {
    color: '#FFFFFF',
  },
  bookmarkHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkedHeaderButton: {
    backgroundColor: '#5BC0CE',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  eventInfo: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  barName: {
    fontSize: 14,
    color: '#D0D8E0',
  },
  locationSeparator: {
    fontSize: 14,
    color: '#D0D8E0',
  },
  barLocation: {
    fontSize: 14,
    color: '#D0D8E0',
  },
  dateTimeGrid: {
    marginBottom: 16,
    gap: 16,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#D0D8E0',
  },
  attendanceStatsBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#D0D8E0',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#D0D8E0',
    lineHeight: 20,
  },
  additionalInfo: {
    marginBottom: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#D0D8E0',
  },
  // Section subtitle
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 18,
  },
  // Available Drinks Styles
  drinksContainer: {
    gap: 12,
  },
  drinkCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  drinkImageContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  drinkImage: {
    width: '100%',
    height: '100%',
  },
  offerBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(91, 192, 206, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  offerText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000000',
  },
  drinkInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  drinkName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  drinkDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 8,
  },
  drinkPricing: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftPricing: {
    flex: 1,
  },
  rightPricing: {
    alignItems: 'flex-end',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(91, 192, 206, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5BC0CE',
  },
  cocktailEmoji: {
    fontSize: 12,
  },
  originalPrice: {
    fontSize: 12,
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  halfPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginTop: 2,
  },
  ticketBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  ticketPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketLabel: {
    fontSize: 14,
    color: '#D0D8E0',
  },
  ticketPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ticketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5BC0CE',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  ticketButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  ticketNote: {
    fontSize: 14,
    color: '#D0D8E0',
    textAlign: 'center',
  },
  performanceBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  performanceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  performanceItem: {
    alignItems: 'center',
  },
  performanceNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 12,
    color: '#D0D8E0',
  },
});



