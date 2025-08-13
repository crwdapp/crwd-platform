import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useAppStore } from '../store';
import { MapViewContainer } from '../components/discovery/MapViewContainer';
import { BottomNavigation } from '../components/BottomNavigation';

export const DiscoverScreen: React.FC = () => {
  const store = useAppStore();
  const user = store?.user || { name: 'User' };
  const bars = store?.bars || { items: [] };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <MapViewContainer />
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
});
