import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Dimensions 
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Event, EventStatus } from '../../types/event';
import { userInteractionService } from '../../services/userInteractionService';

interface EventCardProps {
  event: Event;
  onEventPress?: (event: Event) => void;
  compact?: boolean;
  onInteractionChange?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onEventPress,
  compact = false,
  onInteractionChange
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userAttendance, setUserAttendance] = useState<'going' | 'interested' | null>(null);

  // Load user interactions on mount
  useEffect(() => {
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
    onInteractionChange?.(); // Notify parent to refresh
  };

  const handleAttendance = async (status: 'going' | 'interested') => {
    if (userAttendance === status) {
      // Remove the interaction
      await userInteractionService.removeInteraction(event.id, status);
      setUserAttendance(null);
    } else {
      // Remove any existing attendance status and add the new one
      if (userAttendance) {
        await userInteractionService.removeInteraction(event.id, userAttendance);
      }
      await userInteractionService.addInteraction(event.id, status);
      setUserAttendance(status);
    }
    onInteractionChange?.(); // Notify parent to refresh
  };

  const handleShare = () => {
    // Share functionality
    console.log('Share event:', event.name);
  };

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case EventStatus.ONGOING:
        return '#10B981';
      case EventStatus.UPCOMING:
        return '#3B82F6';
      case EventStatus.SOLD_OUT:
        return '#EF4444';
      case EventStatus.CANCELLED:
        return '#6B7280';
      default:
        return '#9CA3AF';
    }
  };

  const getStatusText = (status: EventStatus) => {
    switch (status) {
      case EventStatus.ONGOING:
        return 'LIVE';
      case EventStatus.UPCOMING:
        return 'UPCOMING';
      case EventStatus.SOLD_OUT:
        return 'SOLD OUT';
      case EventStatus.CANCELLED:
        return 'CANCELLED';
      default:
        return status.replace('_', ' ').toUpperCase();
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
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

  return (
    <TouchableOpacity 
      style={[styles.container, compact && styles.compactContainer]}
      onPress={() => onEventPress?.(event)}
      activeOpacity={0.9}
    >
      {/* Event Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: event.image }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status) }]}>
          <Text style={styles.statusText}>{getStatusText(event.status)}</Text>
        </View>
        
        {/* Bookmark Button */}
        <TouchableOpacity 
          style={styles.bookmarkButton}
          onPress={handleBookmark}
        >
          <Icon 
            name="bookmark" 
            size={20} 
            color={isBookmarked ? "#5BC0CE" : "#FFFFFF"}
          />
        </TouchableOpacity>
      </View>

      {/* Event Info */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.eventName} numberOfLines={2}>
            {event.name}
          </Text>
          <Text style={styles.barName}>
            {event.barName}
          </Text>
        </View>

        {/* Date and Time */}
        <View style={styles.dateTimeContainer}>
          <Icon name="calendar" size={14} color="#6B7280" />
          <Text style={styles.dateTimeText}>
            {formatDate(event.date)} • {formatTime(event.startTime)}
          </Text>
        </View>

        {/* DJ Info */}
        {event.dj && (
          <View style={styles.djContainer}>
            <Icon name="music" size={14} color="#6B7280" />
            <Text style={styles.djText}>
              {event.dj}
            </Text>
          </View>
        )}

        {/* Tags */}
        {event.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {event.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Attendance Stats and Actions */}
        <View style={styles.footer}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Icon name="users" size={12} color="#6B7280" />
              <Text style={styles.statText}>{event.goingCount} going</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="heart" size={12} color="#6B7280" />
              <Text style={styles.statText}>{event.interestedCount} interested</Text>
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                userAttendance === 'interested' && styles.actionButtonActive
              ]}
              onPress={() => handleAttendance('interested')}
            >
              <Icon 
                name="heart" 
                size={14} 
                color={userAttendance === 'interested' ? "#000000" : "#FFFFFF"} 
              />
              <Text style={[
                styles.actionButtonText,
                userAttendance === 'interested' && styles.actionButtonTextActive
              ]}>
                Interested
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.actionButton,
                userAttendance === 'going' && styles.actionButtonGoing
              ]}
              onPress={() => handleAttendance('going')}
            >
              <Icon 
                name="check" 
                size={14} 
                color={userAttendance === 'going' ? "#FFFFFF" : "#FFFFFF"} 
              />
              <Text style={[
                styles.actionButtonText,
                userAttendance === 'going' && styles.actionButtonTextGoing
              ]}>
                Going
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  compactContainer: {
    marginBottom: 8,
  },
  imageContainer: {
    position: 'relative',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 8,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  barName: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateTimeText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
  },
  djContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  djText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: 'rgba(91, 192, 206, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    color: '#5BC0CE',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    gap: 4,
  },
  actionButtonActive: {
    backgroundColor: '#5BC0CE',
  },
  actionButtonGoing: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButtonTextActive: {
    color: '#000000',
  },
  actionButtonTextGoing: {
    color: '#FFFFFF',
  },
});




