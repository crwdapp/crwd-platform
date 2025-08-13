import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  StatusBar 
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAppStore } from '../store';
import { allBars } from '../data/barsData';

// Helper function to calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

type RootStackParamList = {
  Discover: undefined;
};

interface CityOption {
  id: string;
  name: string;
  description: string;
  barCount: number;
  icon: string;
}

export const LocationSelectionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { bars, user } = useAppStore();
  
  // Create cities array and sort by distance from user location
  const cities: CityOption[] = (() => {
    const baseCities = [
      {
        id: 'ALL',
        name: 'All Bars',
        description: 'All available bars',
        barCount: allBars.length,
        icon: 'grid'
      },
      {
        id: 'NEAR_ME',
        name: 'Near You',
        description: 'Bars from closest city to your location',
        barCount: (() => {
          if (!user.location) return 0;
          // Find the closest city to user's location
          const citiesWithDistance = allBars.reduce((acc, bar) => {
            const distance = calculateDistance(
              user.location!.lat,
              user.location!.lng,
              bar.lat,
              bar.lng
            );
            
            if (!acc[bar.location]) {
              acc[bar.location] = { distance, bars: [] };
            }
            acc[bar.location].bars.push(bar);
            
            return acc;
          }, {} as Record<string, { distance: number; bars: Bar[] }>);
          
          // Find the city with the closest bar
          const closestCity = Object.entries(citiesWithDistance).reduce((closest, [city, data]) => {
            return data.distance < closest.distance ? { city, distance: data.distance } : closest;
          }, { city: '', distance: Infinity });
          
          return closestCity.city ? allBars.filter(bar => bar.location === closestCity.city).length : 0;
        })(),
        icon: 'map-pin'
      },
      {
        id: 'BUCHAREST',
        name: 'Bucharest',
        description: 'Bars in the capital city',
        barCount: allBars.filter(bar => bar.location === 'BUCHAREST').length,
        icon: 'building'
      },
      {
        id: 'CONSTANTA',
        name: 'Constanta',
        description: 'Bars by the Black Sea',
        barCount: allBars.filter(bar => bar.location === 'CONSTANTA').length,
        icon: 'anchor'
      },
      {
        id: 'CLUJ',
        name: 'Cluj-Napoca',
        description: 'Bars in Transylvania',
        barCount: allBars.filter(bar => bar.location === 'CLUJ').length,
        icon: 'mountain'
      }
    ];

    // If user has location, sort cities by distance (excluding 'ALL' and 'NEAR_ME')
    if (user.location) {
      const cityCities = baseCities.filter(city => city.id !== 'ALL' && city.id !== 'NEAR_ME');
      const sortedCityCities = cityCities.sort((a, b) => {
        const aBars = allBars.filter(bar => bar.location === a.id);
        const bBars = allBars.filter(bar => bar.location === b.id);
        
        if (aBars.length === 0 || bBars.length === 0) return 0;
        
        const aDistance = calculateDistance(
          user.location!.lat,
          user.location!.lng,
          aBars[0].lat,
          aBars[0].lng
        );
        
        const bDistance = calculateDistance(
          user.location!.lat,
          user.location!.lng,
          bBars[0].lat,
          bBars[0].lng
        );
        
        return aDistance - bDistance;
      });
      
      // Return with 'ALL' first, 'NEAR_ME' second, then sorted cities
      return [
        baseCities.find(city => city.id === 'ALL')!,
        baseCities.find(city => city.id === 'NEAR_ME')!,
        ...sortedCityCities
      ];
    }
    
    return baseCities;
  })();

  const handleCitySelect = (cityId: string) => {
    console.log('📍 Selecting city:', cityId);
    
    // Update the selected location preference
    useAppStore.setState(state => ({
      user: {
        ...state.user,
        preferences: {
          ...state.user.preferences,
          selectedLocation: cityId
        }
      }
    }));
    
    // Update bars based on selected city
    useAppStore.getState().updateBarsByCity(cityId);
    
    console.log('📍 Updated selectedLocation to:', cityId);
    
    // Navigate back to discover screen
    navigation.goBack();
  };

  const getCurrentLocation = () => {
    return user.preferences?.selectedLocation || 'NEAR_ME';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Location</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Choose your location</Text>
        <Text style={styles.sectionSubtitle}>
          Find bars in your preferred city
        </Text>

        {/* City Options */}
        <View style={styles.citiesContainer}>
          {cities.map((city) => {
            const isSelected = getCurrentLocation() === city.id;
            return (
              <TouchableOpacity
                key={city.id}
                style={[styles.cityCard, isSelected && styles.cityCardSelected]}
                onPress={() => handleCitySelect(city.id)}
                activeOpacity={0.8}
              >
                <View style={styles.cityIconContainer}>
                  <Icon 
                    name={city.icon as any} 
                    size={24} 
                    color={isSelected ? "#000000" : "#5bc0be"} 
                  />
                </View>
                
                <View style={styles.cityInfo}>
                  <Text style={[styles.cityName, isSelected && styles.cityNameSelected]}>
                    {city.name}
                  </Text>
                  <Text style={[styles.cityDescription, isSelected && styles.cityDescriptionSelected]}>
                    {city.description}
                  </Text>
                  <Text style={[styles.barCount, isSelected && styles.barCountSelected]}>
                    {city.barCount} bars available
                  </Text>
                </View>

                {isSelected && (
                  <View style={styles.selectedIndicator}>
                    <Icon name="check" size={20} color="#000000" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 32,
  },
  citiesContainer: {
    gap: 16,
  },
  cityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  cityCardSelected: {
    backgroundColor: '#5bc0be',
    borderColor: '#5bc0be',
  },
  cityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(111, 255, 233, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cityNameSelected: {
    color: '#000000',
  },
  cityDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  cityDescriptionSelected: {
    color: 'rgba(0, 0, 0, 0.7)',
  },
  barCount: {
    fontSize: 12,
    color: '#5bc0be',
    fontWeight: '500',
  },
  barCountSelected: {
    color: '#000000',
  },
  selectedIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

