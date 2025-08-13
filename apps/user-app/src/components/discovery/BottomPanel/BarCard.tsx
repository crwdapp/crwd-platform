import React from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ImageBackground 
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface BarCardProps {
  bar: any;
  averageRating: number;
  hasEvents: boolean;
  onPress: (barId: number) => void;
}

export const BarCard: React.FC<BarCardProps> = ({
  bar,
  averageRating,
  hasEvents,
  onPress,
}) => {
  const getBarImage = (bar: any) => {
    if (bar.images && bar.images.length > 0) return bar.images[0];
    if (bar.image) return bar.image;
    return 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop';
  };

  return (
    <TouchableOpacity
      style={styles.barCard}
      onPress={() => onPress(bar.id)}
      activeOpacity={0.95}
    >
      <View style={styles.barImageContainer}>
        <ImageBackground
          source={{ uri: getBarImage(bar) }}
          style={styles.barImage}
          imageStyle={styles.barImageStyle}
        >
          {/* Status Badge */}
          <View style={[styles.statusBadge, !bar.isOpen && styles.statusBadgeClosed]}>
            <View style={[styles.statusDot, !bar.isOpen && styles.statusDotClosed]} />
            <Text style={styles.statusText}>{bar.isOpen ? 'OPEN' : 'CLOSED'}</Text>
          </View>
          
          {/* Event Badge */}
          {hasEvents && (
            <View style={styles.eventBadge}>
              <Text style={styles.eventBadgeText}>Event today</Text>
            </View>
          )}
          
          {/* Drinks Available Badge */}
          <View style={styles.drinksBadge}>
            <Text style={styles.drinksBadgeText}>
              {bar.availableDrinks || 0} drinks today
            </Text>
          </View>
        </ImageBackground>
      </View>
      
      {/* Bar Info Container with Black Background */}
      <View style={styles.barInfoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.barNameOverlay} numberOfLines={1}>
            {bar.name}
          </Text>
          <View style={styles.ratingBadge}>
            <Icon name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>{averageRating.toFixed(1)}</Text>
          </View>
        </View>
        <Text style={styles.barTypeOverlay}>
          {bar.type} • {bar.distance}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  barCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  barImageContainer: {
    height: 140,
  },
  barImage: {
    width: '100%',
    height: '100%',
  },
  barImageStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  imageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  statusBadgeClosed: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    marginRight: 4,
  },
  statusDotClosed: {
    backgroundColor: '#FFFFFF',
  },
  statusText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  eventBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  eventBadgeText: {
    fontSize: 10,
    color: '#000000',
    fontWeight: '700',
  },
  drinksBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#5bc0be',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  drinksBadgeText: {
    fontSize: 10,
    color: '#000000',
    fontWeight: '700',
  },
  quickInfo: {
    position: 'absolute',
    top: 12,
    right: 12,
    gap: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  distanceText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  barInfoContainer: {
    backgroundColor: '#000000',
    padding: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  barInfoOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  barNameOverlay: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  barTypeOverlay: {
    fontSize: 14,
    color: '#D0D8E0',
  },
});
