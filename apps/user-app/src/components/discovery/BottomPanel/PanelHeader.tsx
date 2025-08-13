import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAppStore } from '../../../store';

type RootStackParamList = {
  Filter: undefined;
  LocationSelection: undefined;
};

interface PanelHeaderProps {
  selectedLocation: string;
  isOpenNowActive: boolean;
  isEventFilterActive: boolean;
  barsCount?: number;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  selectedLocation,
  isOpenNowActive,
  isEventFilterActive,
  barsCount,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const toggleBarFilterMode = useAppStore(state => state.toggleBarFilterMode);
  const toggleEventFilterMode = useAppStore(state => state.toggleEventFilterMode);

  const getLocationText = () => {
    switch (selectedLocation) {
      case 'NEAR_ME':
        return 'Near me';
      case 'ALL':
        return 'All bars';
      case 'BUCHAREST':
        return 'Bucharest';
      case 'CONSTANTA':
        return 'Constanta';
      case 'CLUJ':
        return 'Cluj';
      default:
        return 'Near me';
    }
  };

  const handleOpenNowToggle = () => {
    toggleBarFilterMode();
  };

  const handleEventToggle = () => {
    toggleEventFilterMode();
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <View style={styles.leftButtons}>
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={() => navigation.navigate('LocationSelection')}
          >
            <Text style={styles.locationText}>{getLocationText()}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.openNowButton, isOpenNowActive && styles.openNowButtonActive]}
            onPress={handleOpenNowToggle}
          >
                           <Text style={[styles.openNowText, isOpenNowActive && styles.openNowTextActive]}>
                 Open
               </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.eventButton, isEventFilterActive && styles.eventButtonActive]}
            onPress={handleEventToggle}
          >
            <Text style={[styles.eventText, isEventFilterActive && styles.eventTextActive]}>
              Event
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5bc0be',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#5bc0be',
    shadowColor: '#5bc0be',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  locationText: {
    fontSize: 10,
    color: '#000000',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  openNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  openNowButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOpacity: 0.4,
  },
  openNowText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  openNowTextActive: {
    color: '#FFFFFF',
  },
  eventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  eventButtonActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.4,
  },
  eventText: {
    fontSize: 10,
    color: '#F59E0B',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  eventTextActive: {
    color: '#FFFFFF',
  },
});
