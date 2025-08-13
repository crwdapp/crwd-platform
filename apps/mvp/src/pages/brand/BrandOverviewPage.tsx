import React, { useState } from 'react';
import { TrendingUp, Users, Smartphone, Download, Calendar, Wine, Gift, Calculator, Target, MapPin } from 'lucide-react';
import { StatCard } from '../../components/shared/StatCard';
import { ROICalculator } from '../../components/brand/ROICalculator';
import { CompetitiveAnalysis } from '../../components/brand/CompetitiveAnalysis';
import { GeographicIntelligence } from '../../components/brand/GeographicIntelligence';
import { CampaignOptimization } from '../../components/brand/CampaignOptimization';
import { useAppStore } from '../../store';
import { allBars } from '../../data/barsData';

export const BrandOverviewPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedView, setSelectedView] = useState<'overview' | 'roi' | 'competitive' | 'geographic' | 'campaigns'>('overview');
  const { reviews } = useAppStore();
  
  // Calculate top performing locations from actual bar data
  const topPerformingLocations = React.useMemo(() => {
    const locationStats = allBars.reduce((acc, bar) => {
      const city = bar.location;
      if (!acc[city]) {
        acc[city] = { name: bar.name, city, tokens: 0, count: 0 };
      }
      acc[city].tokens += bar.availableDrinks;
      acc[city].count += 1;
      // Keep the bar with most drinks as representative
      if (bar.availableDrinks > acc[city].tokens / acc[city].count) {
        acc[city].name = bar.name;
      }
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(locationStats)
      .sort((a: any, b: any) => b.tokens - a.tokens)
      .slice(0, 5);
  }, []);
  
  // Calculate most active city
  const mostActiveCity = React.useMemo(() => {
    const cityStats = allBars.reduce((acc, bar) => {
      const city = bar.location;
      acc[city] = (acc[city] || 0) + 1;
      return acc;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(cityStats)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Bucharest';
  }, []);

  const periods = [
    { id: 'day', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' }
  ];

  // Mock data that changes based on selected period
  const getDataForPeriod = (period: string) => {
    const data = {
      day: {
        totalTokens50: 234,
        totalTokensFree: 89,
        uniqueUsers: 156,
        growth50: '+12%',
        growthFree: '+8%',
        growthUsers: '+15%'
      },
      week: {
        totalTokens50: 1567,
        totalTokensFree: 423,
        uniqueUsers: 892,
        growth50: '+18%',
        growthFree: '+22%',
        growthUsers: '+25%'
      },
      month: {
        totalTokens50: 6789,
        totalTokensFree: 1834,
        uniqueUsers: 3456,
        growth50: '+35%',
        growthFree: '+28%',
        growthUsers: '+42%'
      },
      quarter: {
        totalTokens50: 18234,
        totalTokensFree: 5678,
        uniqueUsers: 8934,
        growth50: '+45%',
        growthFree: '+38%',
        growthUsers: '+52%'
      }
    };
    return data[period as keyof typeof data];
  };

  const currentData = getDataForPeriod(selectedPeriod);

  const appPromotionStats = {
    totalDownloads: 45678,
    activeUsers: 23456,
    averageRating: 4.8,
    totalReviews: 1234
  };

  return (
    <div className="space-y-4 lg:space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">Brand Analytics</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">Strategic insights, ROI analysis, and market intelligence</p>
        </div>
        
        {selectedView === 'overview' && (
          /* Period Selector - Only show for overview */
          <div className="flex items-center space-x-1 lg:space-x-2 overflow-x-auto">
            {periods.map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`px-3 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  selectedPeriod === period.id
                    ? 'white-active text-cyan-700 shadow-lg'
                    : 'white-card-secondary text-gray-600 hover:text-gray-900 hover:shadow-md'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Navigation */}
      <div className="white-card p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp, color: 'cyan' },
            { id: 'roi', label: 'ROI Calculator', icon: Calculator, color: 'green' },
            { id: 'competitive', label: 'Competition', icon: Target, color: 'red' },
            { id: 'geographic', label: 'Geographic', icon: MapPin, color: 'blue' },
            { id: 'campaigns', label: 'Campaigns', icon: Calendar, color: 'orange' }
          ].map(view => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id as any)}
                className={`flex flex-col items-center space-y-2 p-3 rounded-xl transition-all duration-300 ${
                  selectedView === view.id
                    ? `bg-${view.color}-100 text-${view.color}-700 shadow-lg border-2 border-${view.color}-200`
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-md'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium text-center">{view.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conditional Content Based on Selected View */}
      {selectedView === 'overview' && (
        <>
          {/* Token Usage Analytics */}
          <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="mr-2 text-cyan-600" size={20} />
          Token Usage Analytics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <StatCard
            icon={Wine}
            label="50% OFF TOKENS"
            value={currentData.totalTokens50.toLocaleString()}
            change={currentData.growth50}
            iconBgColor="from-cyan-500 to-cyan-600"
          />
          
          <StatCard
            icon={Gift}
            label="FREE TOKENS"
            value={currentData.totalTokensFree.toLocaleString()}
            change={currentData.growthFree}
            iconBgColor="from-green-500 to-green-600"
          />
          
          <StatCard
            icon={Users}
            label="UNIQUE USERS"
            value={currentData.uniqueUsers.toLocaleString()}
            change={currentData.growthUsers}
            iconBgColor="from-purple-500 to-purple-600"
          />
        </div>
      </div>

      {/* App Promotion Section */}
      <div className="white-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl">
                <Smartphone className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-lg lg:text-xl font-bold">Drive App Engagement</h2>
                <p className="text-gray-600 text-sm lg:text-base">Encourage users to download and use the CRWD app</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <p className="text-lg lg:text-xl font-bold text-cyan-600">{appPromotionStats.totalDownloads.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Total Downloads</p>
              </div>
              <div className="text-center">
                <p className="text-lg lg:text-xl font-bold text-green-600">{appPromotionStats.activeUsers.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-lg lg:text-xl font-bold text-yellow-600">{appPromotionStats.averageRating}</p>
                <p className="text-xs text-gray-600">App Rating</p>
              </div>
              <div className="text-center">
                <p className="text-lg lg:text-xl font-bold text-purple-600">{appPromotionStats.totalReviews.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Reviews</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
            <button className="white-button-primary px-6 py-3 rounded-xl flex items-center justify-center space-x-2 min-h-[44px]">
              <Download size={18} />
              <span>Generate QR Code</span>
            </button>
            <button className="white-button-secondary px-6 py-3 rounded-xl flex items-center justify-center space-x-2 min-h-[44px]">
              <TrendingUp size={18} />
              <span>View Campaign</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Performance Summary */}
        <div className="white-card">
          <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Token Redemption Rate</span>
              <span className="font-bold text-cyan-600">87.3%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Session Duration</span>
              <span className="font-bold text-gray-900">4m 32s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">User Retention (7-day)</span>
              <span className="font-bold text-green-600">68.4%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Most Active City</span>
              <span className="text-gray-900 font-medium">{mostActiveCity}</span>
            </div>
          </div>
        </div>

        {/* Top Performing Locations */}
        <div className="white-card">
          <h3 className="text-lg font-semibold mb-4">Top Performing Locations</h3>
          <div className="space-y-3">
            {topPerformingLocations.map((location, index) => (
              <div key={index} className="flex items-center justify-between white-card-secondary rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    index === 0 ? 'bg-yellow-100 text-yellow-600' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    index === 2 ? 'bg-orange-100 text-orange-600' :
                    'bg-cyan-100 text-cyan-600'
                  }`}>
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{location.name}</p>
                    <p className="text-xs text-gray-500">{location.city}</p>
                  </div>
                </div>
                <span className="font-bold text-cyan-600">{location.tokens}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
        </>
      )}

      {/* ROI Calculator View */}
      {selectedView === 'roi' && <ROICalculator />}

      {/* Competitive Analysis View */}
      {selectedView === 'competitive' && <CompetitiveAnalysis />}

      {/* Geographic Intelligence View */}
      {selectedView === 'geographic' && <GeographicIntelligence />}

      {/* Campaign Optimization View */}
      {selectedView === 'campaigns' && <CampaignOptimization />}
    </div>
  );
};