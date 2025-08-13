import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';
import * as Location from 'expo-location';
import { useAppStore } from './src/store';

// Screens
import { DiscoverScreen } from './src/screens/DiscoverScreen';
import { EventsScreen } from './src/screens/EventsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { AccountScreen } from './src/screens/AccountScreen';
import { BarDetailScreen } from './src/screens/BarDetailScreen';
import { FilterScreen } from './src/screens/FilterScreen';
import { LocationSelectionScreen } from './src/screens/LocationSelectionScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { RecentVisitsScreen } from './src/screens/RecentVisitsScreen';
import { AccountPasswordScreen } from './src/screens/AccountPasswordScreen';
import { AccountPhoneScreen } from './src/screens/AccountPhoneScreen';
import { AccountPaymentScreen } from './src/screens/AccountPaymentScreen';
import { AccountSubscriptionScreen } from './src/screens/AccountSubscriptionScreen';
import { QRCodeScreen } from './src/screens/QRCodeScreen';
import { DrinkSelectionScreen } from './src/screens/DrinkSelectionScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

type RootStackParamList = {
  Discover: undefined;
  Events: undefined;
  Profile: undefined;
  Account: undefined;
  BarDetail: { barId: number };
  Filter: undefined;
  LocationSelection: undefined;
  Notifications: undefined;
  RecentVisits: undefined;
  AccountPassword: undefined;
  AccountPhone: undefined;
  AccountPayment: undefined;
  AccountSubscription: undefined;
  QRCode: undefined;
  DrinkSelection: undefined;
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  // Get store functions with error handling
  const getUpdateUserLocation = () => {
    try {
      const store = useAppStore.getState();
      return store?.updateUserLocation;
    } catch (error) {
      console.warn('⚠️ Store not ready in App component:', error);
      return null;
    }
  };

  // Initialize user location on app start
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status === 'granted') {
          // Get current position
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          const currentLocation = {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          };
          
          console.log('📍 App initialized with user location:', currentLocation);
          const updateLocation = getUpdateUserLocation();
          if (updateLocation) {
            updateLocation(currentLocation);
          } else {
            console.warn('⚠️ Could not update user location - store not ready');
          }
        } else {
          console.log('📍 Location permission denied on app start');
        }
      } catch (error) {
        console.error('❌ Failed to initialize location on app start:', error);
      }
    };

    initializeLocation();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="BarDetail" component={BarDetailScreen} />
        <Stack.Screen name="Filter" component={FilterScreen} />
        <Stack.Screen name="LocationSelection" component={LocationSelectionScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="RecentVisits" component={RecentVisitsScreen} />
        <Stack.Screen name="AccountPassword" component={AccountPasswordScreen} />
        <Stack.Screen name="AccountPhone" component={AccountPhoneScreen} />
        <Stack.Screen name="AccountPayment" component={AccountPaymentScreen} />
        <Stack.Screen name="AccountSubscription" component={AccountSubscriptionScreen} />
        <Stack.Screen name="QRCode" component={QRCodeScreen} />
        <Stack.Screen name="DrinkSelection" component={DrinkSelectionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
