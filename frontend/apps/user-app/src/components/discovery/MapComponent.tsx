import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useAppStore } from '../../store';

export const MapComponent: React.FC = () => {
  const bars = useAppStore(state => state.bars);
  const ui = useAppStore(state => state.ui);
  const userLocation = useAppStore(state => state.user.location);
  const mapCenter = ui?.mapCenter || { lat: 44.4268, lng: 26.1025 };
  
  const mapRef = useRef<MapView>(null);
  const currentIndex = ui.currentBarIndex || 0;
  const currentBar = bars.items[currentIndex];

  // Track if the selection was made by user interaction
  const [userSelectedBar, setUserSelectedBar] = useState<number | null>(null);
  const [lastBarIndex, setLastBarIndex] = useState<number>(-1);

  // Debug logging
  console.log('MapComponent - bars.items:', bars.items.length);
  console.log('MapComponent - bars.items:', bars.items.map(bar => `${bar.name} (${bar.isOpen ? 'open' : 'closed'})`));
  console.log('MapComponent - currentIndex:', currentIndex);
  console.log('MapComponent - currentBar:', currentBar);

  const handleMarkerClick = (barId: number) => {
    // Find the bar index and update the store
    const barIndex = bars.items.findIndex(bar => bar.id === barId);
    if (barIndex !== -1) {
      // Mark this as a user selection so we know to center the map
      setUserSelectedBar(barId);
      useAppStore.setState(state => ({
        ui: {
          ...state.ui,
          selectedBarId: barId,
          currentBarIndex: barIndex
        }
      }));
    }
  };

    // Center map on current bar when it changes, accounting for BottomPanel
  useEffect(() => {
    // Check if this is a user selection (marker click) or if the bar index changed (swipe)
    const isUserSelection = userSelectedBar === currentBar?.id;
    const isIndexChange = lastBarIndex !== -1 && currentIndex !== lastBarIndex;
    
    if (currentBar && mapRef.current && (isUserSelection || isIndexChange)) {
      console.log('MapComponent - Centering on bar:', currentBar.name, 'at:', currentBar.lat, currentBar.lng, 'userSelected:', isUserSelection, 'indexChanged:', isIndexChange);
      
      // Get screen dimensions
      const { height: screenHeight } = Dimensions.get('window');
      
      // Calculate the visible area (space above BottomPanel)
      // BottomPanel takes roughly 50% of screen height (maxHeight: '50%')
      const bottomPanelHeight = screenHeight * 0.5;
      const visibleAreaHeight = screenHeight - bottomPanelHeight;
      
      // Calculate the center of the visible area
      const visibleCenterY = visibleAreaHeight / 2; // This is the center point of visible area
      
      // Calculate what percentage of the screen this center point represents
      const centerPercentage = visibleCenterY / screenHeight; // Should be around 0.25 (25% from top)
      
      // Calculate the latitude offset needed to position the bar at this center point
      // The map's latitude span is latitudeDelta (0.01), so we need to offset by a portion of that
      const latitudeDelta = 0.01;
      // We want to move the bar UP to the visible center (25% from top)
      // So we need to subtract the offset to move the map center down, making the bar appear higher
      const offsetPercentage = centerPercentage - 0.5; // How much to offset from map center
      const latitudeOffset = latitudeDelta * offsetPercentage;
      
      console.log('MapComponent - Screen height:', screenHeight);
      console.log('MapComponent - Visible area height:', visibleAreaHeight);
      console.log('MapComponent - Visible center Y:', visibleCenterY);
      console.log('MapComponent - Center percentage:', centerPercentage);
      console.log('MapComponent - Latitude offset:', latitudeOffset);
      
      const region: Region = {
        latitude: currentBar.lat + latitudeOffset, // Offset to position bar at visible center
        longitude: currentBar.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      
      mapRef.current.animateToRegion(region, 300);
      
      // Clear the user selection flag after centering
      setUserSelectedBar(null);
    }
    
    // Update the last bar index
    setLastBarIndex(currentIndex);
  }, [currentIndex, currentBar, userSelectedBar, lastBarIndex]);

  // Log when bars change
  useEffect(() => {
    console.log('🔄 MapComponent - Bars changed:', bars.items.length, 'bars');
    console.log('🔄 MapComponent - Bars:', bars.items.map(bar => `${bar.name} (${bar.isOpen ? 'open' : 'closed'})`));
  }, [bars.items]);

  // Center map on user location when it changes
  useEffect(() => {
    if (userLocation && mapRef.current) {
      console.log('MapComponent - Centering on user location:', userLocation);
      
      // Get screen dimensions
      const { height: screenHeight } = Dimensions.get('window');
      
      // Calculate the visible area (space above BottomPanel)
      // BottomPanel takes roughly 50% of screen height (maxHeight: '50%')
      const bottomPanelHeight = screenHeight * 0.5;
      const visibleAreaHeight = screenHeight - bottomPanelHeight;
      
      // Calculate the center of the visible area
      const visibleCenterY = visibleAreaHeight / 2; // This is the center point of visible area
      
      // Calculate what percentage of the screen this center point represents
      const centerPercentage = visibleCenterY / screenHeight; // Should be around 0.25 (25% from top)
      
      // Calculate the latitude offset needed to position the user location at this center point
      // The map's latitude span is latitudeDelta (0.01), so we need to offset by a portion of that
      const latitudeDelta = 0.01;
      // We want to move the user location UP to the visible center (25% from top)
      // So we need to subtract the offset to move the map center down, making the user location appear higher
      const offsetPercentage = centerPercentage - 0.5; // How much to offset from map center
      const latitudeOffset = latitudeDelta * offsetPercentage;
      
      console.log('MapComponent - Centering user location with offset - Screen height:', screenHeight);
      console.log('MapComponent - Visible area height:', visibleAreaHeight);
      console.log('MapComponent - Visible center Y:', visibleCenterY);
      console.log('MapComponent - Center percentage:', centerPercentage);
      console.log('MapComponent - Latitude offset:', latitudeOffset);
      
      const region: Region = {
        latitude: userLocation.lat + latitudeOffset, // Offset to position user location at visible center
        longitude: userLocation.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      
      mapRef.current.animateToRegion(region, 300);
    }
  }, [userLocation]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: mapCenter.lat,
          longitude: mapCenter.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        mapType="standard"
        customMapStyle={[
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#212121"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#212121"
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "administrative.country",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#bdbdbd"
              }
            ]
          },
                     {
             "featureType": "poi",
             "stylers": [
               {
                 "visibility": "off"
               }
             ]
           },
                     {
             "featureType": "poi.park",
             "stylers": [
               {
                 "visibility": "off"
               }
             ]
           },
          {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#2c2c2c"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#8a8a8a"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#373737"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#3c3c3c"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
                     {
             "featureType": "transit",
             "stylers": [
               {
                 "visibility": "off"
               }
             ]
           },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#000000"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#3d3d3d"
              }
            ]
          }
        ]}
      >
        {bars.items.map((bar) => {
          const isSelected = bar.id === currentBar?.id;
          console.log('MapComponent - Rendering marker for:', bar.name, 'at:', bar.lat, bar.lng, 'selected:', isSelected, 'isOpen:', bar.isOpen);
          return (
            <Marker
              key={`${bar.id}-${bar.isOpen}-${bars.items.length}`}
              coordinate={{
                latitude: bar.lat,
                longitude: bar.lng,
              }}
              title={bar.name}
              description={bar.type}
              onPress={() => handleMarkerClick(bar.id)}
              pinColor={isSelected ? "#5bc0be" : (bar.isOpen ? "#10B981" : "#6B7280")}
              opacity={isSelected ? 1 : 0.8}
              tracksViewChanges={true}
            />
          );
        })}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});