import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Share,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Bar } from '../../types/bar';

interface BarDetailHeaderProps {
  bar: Bar;
  isFavorited: boolean;
  setIsFavorited: (favorited: boolean) => void;
  setShowReviewModal: (show: boolean) => void;
  averageRating: number;
  barReviewsCount: number;
  availableDrinks: number;
}

export const BarDetailHeader: React.FC<BarDetailHeaderProps> = ({
  bar,
  isFavorited,
  setIsFavorited,
  setShowReviewModal,
  availableDrinks,
}) => {
  const navigation = useNavigation();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${bar.name}! They have ${availableDrinks} drinks available today.`,
        title: `Check out ${bar.name}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share');
    }
  };

  return (
    <View style={styles.header}>
      <ImageBackground
        source={{ uri: bar.images[0] }}
        style={styles.headerImage}
        imageStyle={styles.headerImageStyle}
      >
        {/* Gradient Overlay */}
        <View style={styles.headerGradient} />
        
        {/* Navigation */}
        <View style={styles.headerNavigation}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Text style={styles.shareButtonText}>Meet Here</Text>
            <Icon name="arrow-up-right" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 250,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerImageStyle: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  headerNavigation: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
  },
  shareButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  drinksBadge: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drinksBadgeText: {
    color: '#6FFFE9',
    fontWeight: '700',
    fontSize: 14,
  },
});