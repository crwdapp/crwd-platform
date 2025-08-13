import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DashboardLayout } from './components/DashboardLayout';
import { BrandDashboardLayout } from './components/BrandDashboardLayout';
import { Discover } from './pages/Discover';
import { Profile } from './pages/Profile';
import { Account } from './pages/Account';
import { AccountPassword } from './pages/AccountPassword';
import { AccountPhone } from './pages/AccountPhone';
import { AccountPayment } from './pages/AccountPayment';
import { AccountSubscription } from './pages/AccountSubscription';
import { Notifications } from './pages/Notifications';
import { RecentVisits } from './pages/RecentVisits';
import { BarDetail } from './pages/BarDetail';
import { LocationSelection } from './pages/LocationSelection';
import { FilterScreen } from './pages/FilterScreen';
import { Events } from './pages/Events';
import { AnalyticsPage } from './pages/dashboard/AnalyticsPage';
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { CampaignManagementPage } from './pages/dashboard/CampaignManagementPage';
import { EventsManagementPage } from './pages/dashboard/EventsManagementPage';
import { BrandOverviewPage } from './pages/brand/BrandOverviewPage';
import { ProductAnalyticsPage } from './pages/brand/ProductAnalyticsPage';
import { UserAnalyticsPage } from './pages/brand/UserAnalyticsPage';
import { BarsAnalyticsPage } from './pages/brand/BarsAnalyticsPage';
import { PerformanceByCityPage } from './pages/brand/PerformanceByCityPage';
import { locationService } from './services/location/locationService';
import { useAppStore } from './store';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [userRole, setUserRole] = useState<'member' | 'bar_owner' | 'brand_owner'>('member');

  // Function to directly set user role
  const setAppUserRole = (role: 'member' | 'bar_owner' | 'brand_owner') => {
    setUserRole(role);
  };

  // Initialize app with intelligent location detection
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 CRWD - Initializing with GPS location...');
        
        // Set loading state
        useAppStore.setState(state => {
          state.ui.isLocationLoading = true;
        });

        // Get user's real GPS location
        const location = await locationService.getCurrentLocation();
        console.log('📍 GPS location obtained:', location);
        
        // Update store with real user location
        useAppStore.setState(state => {
          state.user.location = location;
          state.ui.mapCenter = location;
          state.user.preferences.selectedLocation = 'NEAR_ME';
          state.ui.isLocationLoading = false;
        });

        console.log('✅ App initialized with GPS location');
        
      } catch (error) {
        console.log('⚠️ GPS unavailable, using intelligent fallback...');
        
        // Intelligent fallback: start with most popular city (Bucharest)
        const fallbackLocation = { lat: 44.4268, lng: 26.1025 };
        
        useAppStore.setState(state => {
          state.ui.mapCenter = fallbackLocation;
          state.user.preferences.selectedLocation = 'BUCHAREST';
          state.ui.isLocationLoading = false;
          state.ui.showLocationPrompt = true;
        });
      }

      // Set default user name
      useAppStore.setState(state => {
        if (!state.user.name) {
          state.user.name = 'User';
        }
      });
      
      console.log('✅ App initialized');
    };

    initializeApp();
  }, []);

  // Render brand dashboard for brand owners
  if (userRole === 'brand_owner') {
    return (
      <Router>
        <BrandDashboardLayout onSetUserRole={setAppUserRole}>
          <Routes>
            <Route path="/" element={<BrandOverviewPage />} />
            <Route path="/brand" element={<BrandOverviewPage />} />
            <Route path="/brand/products" element={<ProductAnalyticsPage />} />
            <Route path="/brand/users" element={<UserAnalyticsPage />} />
            <Route path="/brand/bars" element={<BarsAnalyticsPage />} />
            <Route path="/brand/cities" element={<PerformanceByCityPage />} />
          </Routes>
        </BrandDashboardLayout>
      </Router>
    );
  }

  // Render dashboard for bar owners
  if (userRole === 'bar_owner') {
    return (
      <Router>
        <DashboardLayout onSetUserRole={setAppUserRole}>
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/dashboard/campaigns" element={<CampaignManagementPage />} />
            <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
            <Route path="/dashboard/events" element={<EventsManagementPage />} />
          </Routes>
        </DashboardLayout>
      </Router>
    );
  }

  // Render regular user app
  return (
    <AuthProvider>
      <Router>
        <Layout onSetUserRole={setAppUserRole}>
          <Routes>
            <Route path="/" element={<Discover />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/location" element={<LocationSelection />} />
            <Route path="/filter" element={<FilterScreen />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/account" element={<Account />} />
            <Route path="/account/password" element={<AccountPassword />} />
            <Route path="/account/phone" element={<AccountPhone />} />
            <Route path="/account/payment" element={<AccountPayment />} />
            <Route path="/account/subscription" element={<AccountSubscription />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/recent-visits" element={<RecentVisits />} />
            <Route path="/events" element={<Events />} />
            <Route path="/bar/:id" element={<BarDetail />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;