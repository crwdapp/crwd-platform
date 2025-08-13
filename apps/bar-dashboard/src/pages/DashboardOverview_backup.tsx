import React from 'react';
import { Calendar, TrendingUp, Users, Wine, Clock, MapPin, Star, Check, AlertCircle, MessageSquare, DollarSign } from 'lucide-react';
import { useAppStore } from '../store';
import { allBars } from '../data/barsData';
import { FloatingActionButton } from '../components/shared/FloatingActionButton';
import { RevenueKPICard } from '../components/shared/RevenueKPICard';
import { OperationalDashboard } from '../components/shared/OperationalDashboard';
import { EventsAnalytics } from '../components/dashboard/EventsAnalytics';
import { tokenService } from '../services/tokenService';

export const DashboardOverview: React.FC = () => {
  const { reviews } = useAppStore();
  
  // Get Control Club data (assuming this dashboard is for Control Club - ID 1)
  const controlClub = allBars.find(bar => bar.id === 1);
  
  // Get reviews for Control Club
  const controlClubReviews = reviews.items.filter(review => review.barId === 1);
  
  // Token claiming state
  const [showClaimModal, setShowClaimModal] = React.useState(false);
  const [tokenCode, setTokenCode] = React.useState('');
  const [isValidating, setIsValidating] = React.useState(false);
  const [validationStatus, setValidationStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [validationMessage, setValidationMessage] = React.useState('');
  const [isStatsExpanded, setIsStatsExpanded] = React.useState(false);
  const [isBarOpen, setIsBarOpen] = React.useState(true);
  const [promotionsEnabled, setPromotionsEnabled] = React.useState(true);
  const [selectedView, setSelectedView] = React.useState<'overview' | 'operations'>('overview');

  // Enhanced revenue and operational data
  const todayStats = {
    drinksServed: 23,
    redemptionRate: 49,
    newCustomers: 8,
    revenue: 2850.50,
    averageOrderValue: 23.75,
    peakHourRevenue: 450.25,
    customerLifetimeValue: 156.80,
    upsellOpportunities: 12
  };

  const recentRedemptions = [
    { id: 1, drink: 'House Beer', time: '2 min ago' },
    { id: 2, drink: 'Signature Cocktail', time: '15 min ago' },
    { id: 3, drink: 'House Wine', time: '32 min ago' },
    { id: 4, drink: 'Craft Beer', time: '1 hour ago' },
  ];

  const upcomingEvents = [
    ...(controlClub?.events || []).map(event => ({
      id: event.id,
      name: event.name,
      date: event.date,
      time: '10:00 PM' // Default time since not in data structure
    }))
  ];

  // Use actual customer feedback from reviews
  const customerFeedback = controlClubReviews.slice(0, 5).map(review => ({
    id: review.id,
    customerName: review.userName,
    rating: review.rating,
    message: review.comment,
    date: new Date(review.date).toLocaleDateString()
  }));

  // Handle token code input
  const handleTokenCodeChange = (value: string) => {
    // Only allow alphanumeric characters and convert to uppercase
    const cleanValue = value.replace(/[^A-Z0-9]/g, '').toUpperCase().slice(0, 5);
    setTokenCode(cleanValue);
    
    // Reset validation status when user types
    if (validationStatus !== 'idle') {
      setValidationStatus('idle');
      setValidationMessage('');
    }
  };

  // Handle token claiming (both traditional and FAB)
  const handleClaimToken = async (code?: string) => {
    const codeToValidate = code || tokenCode;
    if (codeToValidate.length < 5) return;
    
    setIsValidating(true);
    setValidationStatus('idle');
    
    try {
      // Use the token service to validate and redeem the token
      const result = await tokenService.redeemTokenCode(codeToValidate, 'bartender_123'); // In real app, use actual bartender ID
      
      setValidationStatus('success');
      setValidationMessage(`Token redeemed successfully! ${result.drink_name} - €${result.discounted_price}`);
      
      // Update today's stats
      todayStats.drinksServed += 1;
      todayStats.revenue += result.discounted_price;
      
      // Haptic feedback for mobile
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
      
      // Reset after delay
      setTimeout(() => {
        setTokenCode('');
        setValidationStatus('idle');
        setValidationMessage('');
        setShowClaimModal(false);
      }, 3000);
      
    } catch (error) {
      setValidationStatus('error');
      setValidationMessage(error instanceof Error ? error.message : 'Invalid or expired token. Please ask customer to regenerate.');
    } finally {
      setIsValidating(false);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowClaimModal(false);
    setTokenCode('');
    setValidationStatus('idle');
    setValidationMessage('');
  };

  return (
    <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
      {/* Header with View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">Welcome back! Here's what's happening at your bar today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedView('overview')}
              className={`px-3 py-1 rounded text-sm transition-all ${
                selectedView === 'overview' ? 'bg-white shadow text-cyan-600' : 'text-gray-600'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedView('operations')}
              className={`px-3 py-1 rounded text-sm transition-all ${
                selectedView === 'operations' ? 'bg-white shadow text-cyan-600' : 'text-gray-600'
              }`}
            >
              Operations
            </button>
          </div>
          <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-500">
            <Clock size={16} />
            <span>2 min ago</span>
          </div>
        </div>
      </div>

      {/* Token Redemption Section - Moved to Top */}
      <div className="bg-white rounded-xl p-4 lg:p-6 border-2 border-cyan-200">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 lg:p-3 bg-cyan-100 rounded-lg">
              <Wine className="text-cyan-600" size={24} />
            </div>
            <div>
              <h2 className="text-base lg:text-lg font-semibold">Token Redemption</h2>
              <p className="text-xs lg:text-sm text-gray-600">Enter customer's 5-digit code</p>
            </div>
          </div>
        </div>
        
        {/* Quick Code Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Customer Code
            </label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <input
                type="text"
                value={tokenCode}
                onChange={(e) => handleTokenCodeChange(e.target.value)}
                placeholder="Enter 5-digit code"
                className={`flex-1 bg-white border rounded-lg px-3 lg:px-4 py-2 lg:py-3 text-gray-900 text-center text-base lg:text-lg font-mono tracking-wider focus:outline-none focus:ring-2 ${
                  validationStatus === 'error' 
                    ? 'border-red-400 focus:ring-red-400' 
                    : validationStatus === 'success'
                    ? 'border-cyan-400 focus:ring-cyan-400'
                    : 'border-gray-300 focus:ring-cyan-500'
                }`}
                maxLength={5}
                disabled={isValidating || validationStatus === 'success'}
              />
              <button
                onClick={handleClaimToken}
                disabled={tokenCode.length !== 5 || isValidating || validationStatus === 'success'}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 px-4 lg:px-6 py-2 lg:py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 min-h-[44px]"
              >
                {isValidating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Validating...</span>
                  </>
                ) : validationStatus === 'success' ? (
                  <>
                    <Check size={16} />
                    <span>Claimed!</span>
                  </>
                ) : (
                  <>
                    <Wine size={16} />
                    <span>Claim</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {tokenCode.length}/5 characters
            </p>
          </div>

          {/* Validation Message */}
          {validationMessage && (
            <div className={`p-3 rounded-lg border text-sm ${
              validationStatus === 'success' 
                ? 'bg-cyan-50 border-cyan-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center space-x-2">
                {validationStatus === 'success' ? (
                  <Check className="text-cyan-600" size={16} />
                ) : (
                  <AlertCircle className="text-red-500" size={16} />
                )}
                <span className={`text-sm font-medium ${
                  validationStatus === 'success' ? 'text-cyan-700' : 'text-red-700'
                }`}>
                  {validationMessage}
                </span>
              </div>
            </div>
          )}

          {/* Quick Instructions */}
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 lg:block hidden">
            <div className="flex items-start space-x-2">
              <AlertCircle className="text-cyan-600 mt-0.5" size={16} />
              <div>
                <h4 className="font-medium text-cyan-700 text-sm mb-1">Quick Guide:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Ask customer to show their 5-digit code</li>
                  <li>• Enter the code and click "Claim"</li>
                  <li>• Serve the drink after successful validation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mobile Quick Instructions - Collapsible */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsStatsExpanded(!isStatsExpanded)}
              className="w-full text-left text-sm text-cyan-600 font-medium"
            >
              {isStatsExpanded ? 'Hide' : 'Show'} Quick Guide
            </button>
            {isStatsExpanded && (
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 mt-2">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="text-cyan-600 mt-0.5" size={16} />
                  <div>
                    <h4 className="font-medium text-cyan-700 text-sm mb-1">Quick Guide:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Ask customer to show their 5-digit code</li>
                      <li>• Enter the code and click "Claim"</li>
                      <li>• Serve the drink after successful validation</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conditional Content Based on Selected View */}
      {selectedView === 'overview' ? (
        <>
          {/* Revenue-Focused KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <RevenueKPICard
              title="Today's Revenue"
              value={`$${todayStats.revenue.toFixed(2)}`}
              change="+18%"
              trend="up"
              icon="revenue"
              subtitle="From token redemptions"
            />
            <RevenueKPICard
              title="Peak Hour Revenue"
              value={`$${todayStats.peakHourRevenue.toFixed(2)}`}
              change="+25%"
              trend="up"
              icon="peak"
              subtitle="22:00-23:00 highest"
            />
            <RevenueKPICard
              title="Customer LTV"
              value={`$${todayStats.customerLifetimeValue.toFixed(0)}`}
              change="+12%"
              trend="up"
              icon="customers"
              subtitle="Average per customer"
            />
            <RevenueKPICard
              title="Upsell Opportunities"
              value={todayStats.upsellOpportunities}
              change="8 potential"
              trend="neutral"
              icon="upsell"
              subtitle="Premium drinks suggested"
              onClick={() => alert('Show upselling opportunities')}
            />
          </div>

          {/* Main Content Grid */}
          <div className="space-y-4 lg:space-y-6">
        {/* Quick Actions - Moved to top priority position */}
        <div className="bg-white rounded-xl p-4 lg:p-6">
          <h2 className="text-base lg:text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            <button className="bg-gray-50 hover:bg-gray-100 rounded-lg p-3 lg:p-4 text-center transition-all duration-300 min-h-[80px] lg:min-h-[100px] flex flex-col items-center justify-center">
              <Calendar className="mx-auto mb-2 text-cyan-600" size={24} />
              <span className="text-xs lg:text-sm font-medium">New Campaign</span>
            </button>
            <button className="bg-gray-50 hover:bg-gray-100 rounded-lg p-3 lg:p-4 text-center transition-all duration-300 min-h-[80px] lg:min-h-[100px] flex flex-col items-center justify-center">
              <TrendingUp className="mx-auto mb-2 text-cyan-500" size={24} />
              <span className="text-xs lg:text-sm font-medium">View Analytics</span>
            </button>
          </div>
        </div>

        {/* Recent Redemptions */}
        <div className="bg-white rounded-xl p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-base lg:text-lg font-semibold">Recent Redemptions</h2>
            <button className="text-cyan-600 text-xs lg:text-sm hover:text-cyan-700 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-3 lg:space-y-4">
            {recentRedemptions.map((redemption) => (
              <div key={redemption.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 min-h-[44px]">
                <div className="flex items-center space-x-3">
                  <div className="w-6 lg:w-8 h-6 lg:h-8 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Wine size={16} className="text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{redemption.drink}</p>
                    <p className="text-xs text-gray-500">Served</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0">{redemption.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Events Analytics */}
        <div className="bg-white rounded-xl p-4 lg:p-6">
          <EventsAnalytics barId={1} />
        </div>

        {/* Performance and Status Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Today's Performance */}
          <div className="bg-white rounded-xl p-4 lg:p-6">
            <h2 className="text-base lg:text-lg font-semibold mb-4">Today's Performance</h2>
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <div className="text-center">
                <p className="text-xl lg:text-2xl font-bold text-cyan-600">{todayStats.drinksServed}</p>
                <p className="text-xs lg:text-sm text-gray-600">Drinks Served</p>
              </div>
              <div className="text-center">
                <p className="text-xl lg:text-2xl font-bold text-cyan-500">{todayStats.redemptionRate}%</p>
                <p className="text-xs lg:text-sm text-gray-600">Success Rate</p>
              </div>
            </div>
          </div>

          {/* Bar Status */}
          <div className="bg-white rounded-xl p-4 lg:p-6">
            <h2 className="text-base lg:text-lg font-semibold mb-4">Bar Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium text-sm lg:text-base">Open</span>
                </div>
                <p className="text-xs lg:text-sm text-gray-600">Until 3:00 AM</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MapPin className="text-cyan-600" size={16} />
                  <span className="font-medium text-sm lg:text-base">High Traffic</span>
                </div>
                <p className="text-xs lg:text-sm text-gray-600">Peak hours active</p>
              </div>
              <div className="text-center sm:col-span-3 lg:col-span-1">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Star className="text-yellow-500" size={16} />
                  <span className="font-medium text-sm lg:text-base">4.8 Rating</span>
                </div>
                <p className="text-xs lg:text-sm text-gray-600">324 reviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Feedback Section - Now at the bottom */}
        <div className="bg-white rounded-xl p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 lg:p-3 bg-cyan-100 rounded-lg">
                <MessageSquare className="text-cyan-600" size={24} />
              </div>
              <div>
                <h2 className="text-base lg:text-lg font-semibold">Customer Feedback</h2>
                <p className="text-xs lg:text-sm text-gray-600">Private messages from customers</p>
              </div>
            </div>
            <button className="text-cyan-600 text-xs lg:text-sm hover:text-cyan-700 transition-colors">
              View All
            </button>
          </div>
          
          <div className="space-y-3 lg:space-y-4 max-h-64 overflow-y-auto">
            {customerFeedback.map((feedback) => (
              <div key={feedback.id} className="bg-gray-50 rounded-lg p-3 lg:p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{feedback.customerName.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{feedback.customerName}</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              className={`${
                                star <= feedback.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{feedback.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {feedback.message && (
                  <p className="text-sm text-gray-600 mt-2 pl-11">{feedback.message}</p>
                )}
              </div>
            ))}
          </div>
          
          {customerFeedback.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto mb-4 text-gray-400" size={36} />
              <h3 className="text-base lg:text-lg font-semibold mb-2">No feedback yet</h3>
              <p className="text-gray-600 text-sm lg:text-base">Customer feedback will appear here</p>
            </div>
          )}
        </div>
      </div>
        </>
      ) : (
        <OperationalDashboard
          isBarOpen={isBarOpen}
          onToggleBarStatus={setIsBarOpen}
          promotionsEnabled={promotionsEnabled}
          onTogglePromotions={setPromotionsEnabled}
        />
      )}

      {/* Floating Action Button */}
      <FloatingActionButton
        onTokenRedeem={handleClaimToken}
        isValidating={isValidating}
        validationStatus={validationStatus}
      />
    </div>
  );
};