import React, { useState } from 'react';
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
  AccountPassword: undefined;
  AccountPhone: undefined;
  AccountPayment: undefined;
  AccountSubscription: undefined;
};

export const AccountScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const store = useAppStore();
  const user = store?.user || { 
    subscription: { 
      status: 'free', 
      plan: 'Free Plan', 
      nextBilling: '' 
    } 
  };
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isPremium = user.subscription?.status === 'premium';

  const accountSections = [
    {
      id: 'subscription',
      title: 'Subscription',
      description: 'Manage your subscription plan',
      icon: 'shield',
      action: () => navigation.navigate('AccountSubscription')
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      description: 'Manage your payment methods',
      icon: 'credit-card',
      action: () => navigation.navigate('AccountPayment')
    },
    {
      id: 'password',
      title: 'Change Password',
      description: 'Update your account password',
      icon: 'lock',
      action: () => navigation.navigate('AccountPassword')
    },
    {
      id: 'phone',
      title: 'Phone Number',
      description: 'Update your phone number',
      icon: 'phone',
      action: () => navigation.navigate('AccountPhone')
    }
  ];

  const handleDeleteAccount = () => {
    // Handle account deletion logic
    console.log('Account deleted');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Account Settings</Text>
    </View>
  );

  const renderSubscriptionStatus = () => (
    <View style={styles.subscriptionCard}>
      <View style={styles.subscriptionHeader}>
        <Text style={styles.subscriptionTitle}>Subscription Status</Text>
        <View style={[
          styles.statusBadge,
          isPremium ? styles.premiumBadge : styles.freeBadge
        ]}>
          <Text style={[
            styles.statusText,
            isPremium ? styles.premiumText : styles.freeText
          ]}>
            {isPremium ? 'Premium' : 'Free'}
          </Text>
        </View>
      </View>
      
      <View style={styles.subscriptionDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Current Plan</Text>
          <Text style={styles.detailValue}>
            {user.subscription?.plan || 'Free Plan'}
          </Text>
        </View>
        
        {isPremium && user.subscription?.nextBilling && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Next Billing</Text>
            <Text style={styles.detailValue}>
              {new Date(user.subscription.nextBilling).toLocaleDateString()}
            </Text>
          </View>
        )}
        
        {!isPremium && (
          <View style={styles.upgradeCard}>
            <Text style={styles.upgradeText}>
              Upgrade to Premium to unlock tokens and exclusive features!
            </Text>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => navigation.navigate('AccountSubscription')}
            >
              <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const renderAccountSections = () => (
    <View style={styles.sectionsContainer}>
      {accountSections.map((section) => (
        <TouchableOpacity
          key={section.id}
          style={styles.sectionItem}
          onPress={section.action}
        >
          <View style={styles.sectionLeft}>
            <View style={styles.sectionIcon}>
              <Icon name={section.icon as any} size={20} color="#5BC0CE" />
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionDescription}>{section.description}</Text>
            </View>
          </View>
          <Icon name="chevron-right" size={20} color="#666666" />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderDangerZone = () => (
    <View style={styles.dangerZone}>
      <Text style={styles.dangerTitle}>Danger Zone</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => setShowDeleteConfirm(true)}
      >
        <Icon name="trash-2" size={20} color="#EF4444" />
        <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {renderHeader()}
          {renderSubscriptionStatus()}
          {renderAccountSections()}
          {renderDangerZone()}
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
    padding: 16,
    paddingBottom: 100, // Space for bottom navigation
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subscriptionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  premiumBadge: {
    backgroundColor: '#5BC0CE',
  },
  freeBadge: {
    backgroundColor: '#666666',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  premiumText: {
    color: '#000000',
  },
  freeText: {
    color: '#FFFFFF',
  },
  subscriptionDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderRadius: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#D0D8E0',
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  upgradeCard: {
    padding: 16,
    backgroundColor: 'rgba(92, 192, 206, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(92, 192, 206, 0.3)',
    alignItems: 'center',
  },
  upgradeText: {
    fontSize: 14,
    color: '#D0D8E0',
    textAlign: 'center',
    marginBottom: 12,
  },
  upgradeButton: {
    backgroundColor: '#5BC0CE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  sectionsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderRadius: 12,
    marginBottom: 12,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(92, 192, 206, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  sectionDescription: {
    fontSize: 12,
    color: '#D0D8E0',
  },
  dangerZone: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
    gap: 8,
  },
  deleteText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '500',
  },
});

