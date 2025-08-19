import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Bar } from '../../types/bar';

interface BarBasicInfoProps {
  bar: Bar;
  averageRating: number;
  barReviewsCount: number;
  setShowReviewModal: (show: boolean) => void;
}

export const BarBasicInfo: React.FC<BarBasicInfoProps> = ({
  bar,
  averageRating,
  barReviewsCount,
  setShowReviewModal
}) => {
  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#10B981';
      default: return '#9CA3AF';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.barName}>{bar.name}</Text>
          <Text style={styles.barType}>{bar.type} • {bar.priceRange}</Text>
        </View>
        <TouchableOpacity 
          style={styles.ratingButton}
          onPress={() => setShowReviewModal(true)}
        >
          <Icon name="star" size={16} color="#5bc0be" />
          <Text style={styles.ratingText}>{averageRating.toFixed(1)}</Text>
          <Text style={styles.reviewsCount}>({barReviewsCount + bar.reviews})</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>{bar.description}</Text>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        {bar.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Icon name="map-pin" size={16} color="#D0D8E0" />
          <Text style={styles.statText}>{bar.distance || '0.5km'}</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="clock" size={16} color="#D0D8E0" />
          <Text style={styles.statText}>Open until {bar.openUntil}</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="users" size={16} color={getCrowdColor(bar.crowdLevel)} />
          <Text style={[styles.statText, { color: getCrowdColor(bar.crowdLevel) }]}>
            {bar.crowdLevel} crowd
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  barName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  barType: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  ratingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  reviewsCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    marginLeft: 2,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
    marginBottom: 16,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: 'rgba(111, 255, 233, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(111, 255, 233, 0.2)',
  },
  tagText: {
    fontSize: 12,
    color: '#5bc0be',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '500',
  },
});
