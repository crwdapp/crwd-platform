import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { MapComponent } from './MapComponent';
import { MapOverlay } from './MapOverlay';
import { BottomPanel } from './BottomPanel/BottomPanel';

export const MapViewContainer: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapComponent />
        <MapOverlay />
      </View>
      <BottomPanel />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
});

