import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Linking, 
  Alert 
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Feather';
import { Bar } from '../../types/bar';

interface BarLocationMapProps {
  bar: Bar;
}

export const BarLocationMap: React.FC<BarLocationMapProps> = ({ bar }) => {
  const handleGetDirections = async () => {
    try {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${bar.lat},${bar.lng}&destination_place_id=${encodeURIComponent(bar.name)}`;
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Could not open maps application');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open directions');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: bar.lat,
            longitude: bar.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          customMapStyle={[
            {
              elementType: 'geometry',
              stylers: [{ color: '#ffffff' }],
            },
            {
              elementType: 'labels.text.fill',
              stylers: [{ color: '#333333' }],
            },
            {
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#ffffff' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#f5f5f5' }],
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#333333' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#e0e7ff' }],
            },
            {
              featureType: 'water',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'poi',
              elementType: 'all',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'transit',
              elementType: 'all',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'administrative',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'landscape',
              elementType: 'geometry',
              stylers: [{ color: '#ffffff' }],
            },
            {
              featureType: 'landscape',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ]}
        >
          <Marker
            coordinate={{ latitude: bar.lat, longitude: bar.lng }}
            pinColor="#5bc0be"
          />
        </MapView>
        
        {/* Blur Overlay */}
        <View style={styles.blurOverlay} />
        
        
        {/* Get Directions Button - Full Width Bottom */}
        <TouchableOpacity 
          style={styles.directionsButton}
          onPress={handleGetDirections}
          activeOpacity={1}
          underlayColor="transparent"
        >
          <Icon name="navigation" size={18} color="#000000" />
          <Text style={styles.directionsButtonText}>Get Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  mapContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 200,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  directionsButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#5bc0be',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    zIndex: 1000,
    elevation: 1000,
  },
  directionsButtonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 14,
  },
});