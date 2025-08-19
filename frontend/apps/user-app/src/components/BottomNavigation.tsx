import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  Discover: undefined;
  Events: undefined;
  Profile: undefined;
  Account: undefined;
};

export const BottomNavigation: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const tabs = [
    {
      name: 'Discover',
      icon: 'map',
      route: 'Discover' as keyof RootStackParamList,
    },
    {
      name: 'Events',
      icon: 'calendar',
      route: 'Events' as keyof RootStackParamList,
    },
    {
      name: 'Profile',
      icon: 'user',
      route: 'Profile' as keyof RootStackParamList,
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tab}
          onPress={() => navigation.navigate(tab.route)}
        >
          <Icon name={tab.icon as any} size={24} color="#FFFFFF" />
          <Text style={styles.tabText}>{tab.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 20,
    paddingTop: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
    fontWeight: '500',
  },
});
