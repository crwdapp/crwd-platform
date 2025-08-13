import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAppStore } from '../../store';
import * as Location from 'expo-location';
import { SearchOverlay } from './SearchOverlay';

type RootStackParamList = {
  Filter: undefined;
  LocationSelection: undefined;
  Profile: undefined;
};

export const MapOverlay: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { ui, user } = useAppStore();
  const [isLocating, setIsLocating] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Ensure store is ready
  useEffect(() => {
    const checkStore = () => {
      try {
        const store = useAppStore.getState();
        if (store && typeof store.updateUserLocation === 'function') {
          console.log('✅ Store is ready for use');
        } else {
          console.warn('⚠️ Store not fully initialized yet');
        }
      } catch (error) {
        console.error('❌ Store check failed:', error);
      }
    };
    
    // Check immediately and after a short delay
    checkStore();
    const timer = setTimeout(checkStore, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigateToUserLocation = async () => {
    if (isLocating) return; // Prevent multiple calls
    
    setIsLocating(true);
    
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission',
          'Permission to access location was denied. Please enable location services.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get current position with faster settings
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // Faster than High
      });

      const currentLocation = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
      
      console.log('📍 Got current location:', currentLocation);
      
      // Update user location using the new function
      try {
        const store = useAppStore.getState();
        if (store && typeof store.updateUserLocation === 'function') {
          store.updateUserLocation(currentLocation);
        } else {
          // Try again after a short delay in case store is still initializing
          setTimeout(() => {
            const retryStore = useAppStore.getState();
            if (retryStore && typeof retryStore.updateUserLocation === 'function') {
              retryStore.updateUserLocation(currentLocation);
            } else {
              console.error('❌ Store or updateUserLocation function not available after retry');
            }
          }, 100);
        }
      } catch (storeError) {
        console.error('❌ Error accessing store:', storeError);
      }
      
      console.log('📍 Updated store with user location:', currentLocation);
      console.log('📍 Triggered bars reordering by distance');
      
      // Show success feedback
      console.log('✅ Successfully navigated to your location');
    } catch (error) {
      console.error('❌ Failed to get location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please check your GPS settings and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Overlay */}
      <SearchOverlay 
        visible={showSearch} 
        onClose={() => setShowSearch(false)} 
      />
      
      {/* Top Controls */}
      <View style={styles.topControls}>
        {/* Right Side - Search and Navigation Buttons */}
        <View style={styles.rightControls}>
          <TouchableOpacity
            style={[styles.searchButton, showSearch && styles.searchButtonActive]}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Icon name="search" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.navigationButton, isLocating && styles.navigationButtonLoading]}
            onPress={handleNavigateToUserLocation}
            disabled={isLocating}
          >
            <Icon 
              name={isLocating ? "loader" : "navigation-2"} 
              size={20} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
  },
  topControls: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  rightControls: {
    flexDirection: 'row',
    gap: 12,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchButtonActive: {
    backgroundColor: 'rgba(91, 192, 206, 0.8)',
    borderColor: 'rgba(91, 192, 206, 0.6)',
  },
  navigationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  navigationButtonLoading: {
    opacity: 0.7, // Indicate loading state
  },
});

