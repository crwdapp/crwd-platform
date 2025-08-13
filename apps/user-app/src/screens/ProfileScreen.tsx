import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAppStore } from '../store';
import { BottomNavigation } from '../components/BottomNavigation';

type RootStackParamList = {
  Account: undefined;
  Notifications: undefined;
  RecentVisits: undefined;
  QRCode: undefined;
  BarDetail: { barId: number };
};

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const store = useAppStore();
  const user = store?.user || { 
    id: null, 
    name: null, 
    avatar: null, 
    location: null, 
    preferences: { 
      selectedLocation: 'NEAR_ME', 
      activeFilters: [], 
      viewMode: 'map', 
      barFilterMode: 'open_now' 
    }, 
    subscription: { 
      status: 'free', 
      plan: 'Free Plan', 
      startDate: '', 
      nextBilling: '' 
    }, 
    tokens: { 
      daily: [], 
      weekly: [], 
      lastDailyReset: '', 
      lastWeeklyReset: '' 
    } 
  };
  const getTokenCount = store?.getTokenCount;
  const tokenCount = getTokenCount ? getTokenCount() : { daily: 0, weekly: 0 };

  const userProfile = {
    name: user?.name || 'John Doe',
    username: '@johndoe',
    location: user?.preferences?.selectedLocation === 'NEAR_ME' ? 'Bucharest' : (user?.preferences?.selectedLocation || 'Bucharest'),
    joinDate: 'January 2024',
    avatar: user?.avatar || '/default-avatar.png',
    subscriptionStatus: 'Active',
    subscriptionPrice: '49 RON/month',
  };

  const menuItems = [
    {
      id: 'account',
      title: 'Account Settings',
      description: 'Manage your account preferences',
      icon: 'settings',
      action: () => navigation.navigate('Account'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage your notification preferences',
      icon: 'bell',
      action: () => navigation.navigate('Notifications'),
    },
    {
      id: 'recent',
      title: 'Recent Visits',
      description: 'View your recent bar visits',
      icon: 'clock',
      action: () => navigation.navigate('RecentVisits'),
    },
    {
      id: 'qr',
      title: 'QR Code',
      description: 'Your personal QR code for bars',
      icon: 'qr-code',
      action: () => navigation.navigate('QRCode'),
    },
  ];

  const faqItems = [
    {
      question: 'How do I use tokens?',
      answer: 'Tokens are used to order drinks at bars. You get daily and weekly tokens that reset automatically.',
    },
    {
      question: 'How do I upgrade to Premium?',
      answer: 'Go to Account Settings and select the Premium plan to unlock unlimited tokens and exclusive features.',
    },
    {
      question: 'Can I change my location?',
      answer: 'Yes! Tap the location button on the map to change your preferred location.',
    },
  ];

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Icon name="user" size={40} color="#FFFFFF" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileUsername}>{userProfile.username}</Text>
          <View style={styles.locationContainer}>
            <Icon name="map-pin" size={14} color="#5bc0be" />
            <Text style={styles.locationText}>{userProfile.location}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderTokenCards = () => (
    <View style={styles.tokenSection}>
      <Text style={styles.sectionTitle}>Your Tokens</Text>
      <View style={styles.tokenCards}>
        <View style={styles.tokenCard}>
          <View style={styles.tokenHeader}>
            <Icon name="sun" size={20} color="#FFD700" />
            <Text style={styles.tokenTitle}>Daily Tokens</Text>
          </View>
          <Text style={styles.tokenCount}>{tokenCount.daily}</Text>
          <Text style={styles.tokenSubtext}>Resets daily at 00:00</Text>
        </View>
        
        <View style={styles.tokenCard}>
          <View style={styles.tokenHeader}>
            <Icon name="calendar" size={20} color="#5bc0be" />
            <Text style={styles.tokenTitle}>Weekly Tokens</Text>
          </View>
          <Text style={styles.tokenCount}>{tokenCount.weekly}</Text>
          <Text style={styles.tokenSubtext}>Resets every Monday</Text>
        </View>
      </View>
    </View>
  );

  const renderMenuItems = () => (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>Menu</Text>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.menuItem}
          onPress={item.action}
        >
          <View style={styles.menuItemLeft}>
            <View style={styles.menuIcon}>
              <Icon name={item.icon as any} size={20} color="#5bc0be" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </View>
          </View>
          <Icon name="chevron-right" size={20} color="#666666" />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderFAQ = () => (
    <View style={styles.faqSection}>
      <Text style={styles.sectionTitle}>FAQ</Text>
      {faqItems.map((item, index) => (
        <View key={index} style={styles.faqItem}>
          <Text style={styles.faqQuestion}>{item.question}</Text>
          <Text style={styles.faqAnswer}>{item.answer}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {renderProfileHeader()}
          {renderTokenCards()}
          {renderMenuItems()}
          {renderFAQ()}
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100, // Space for bottom navigation
  },
  profileHeader: {
    marginBottom: 32,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(111, 255, 233, 0.3)',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#5bc0be',
  },
  tokenSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  tokenCards: {
    flexDirection: 'row',
    gap: 12,
  },
  tokenCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tokenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  tokenTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tokenCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tokenSubtext: {
    fontSize: 12,
    color: '#666666',
  },
  menuSection: {
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(111, 255, 233, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 12,
    color: '#666666',
  },
  faqSection: {
    marginBottom: 32,
  },
  faqItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});

