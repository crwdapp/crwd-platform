import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Wine, Calendar, Clock, Star, MapPin, Download, FileText, Calendar as CalendarIcon } from 'lucide-react';
import { useAppStore } from '../../store';
import { allBars } from '../../data/barsData';

export const AnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const { reviews } = useAppStore();
  
  // Get Control Club data (assuming this dashboard is for Control Club - ID 1)
  const controlClub = allBars.find(bar => bar.id === 1);
  const controlClubReviews = reviews.items.filter(review => review.barId === 1);
  
  // Calculate average rating from actual reviews
  const averageRating = controlClubReviews.length > 0 
    ? (controlClubReviews.reduce((sum, review) => sum + review.rating, 0) / controlClubReviews.length).toFixed(1)
    : controlClub?.rating.toFixed(1) || '4.8';

  // Mock analytics data
  const analyticsData = {
    overview: {
      drinksServed: 156,
      redemptionRate: 48.8,
      newCustomers: 23,
      averageRating: parseFloat(averageRating),
      totalRevenue: 2340
    },
    dailyRedemptions: [
      { day: 'Mon', redemptions: 12, offered: 30 },
      { day: 'Tue', redemptions: 18, offered: 35 },
      { day: 'Wed', redemptions: 25, offered: 40 },
      { day: 'Thu', redemptions: 32, offered: 50 },
      { day: 'Fri', redemptions: 45, offered: 60 },
      { day: 'Sat', redemptions: 38, offered: 55 },
      { day: 'Sun', redemptions: 28, offered: 45 }
    ],
    topDrinks: (controlClub?.availableDrinksMenu || []).slice(0, 5).map((drink, index) => {
      const baseRedemptions = 50 - (index * 8); // Decreasing redemptions
      const totalRedemptions = 156; // Total from overview
      return {
        name: drink.name,
        redemptions: baseRedemptions,
        percentage: ((baseRedemptions / totalRedemptions) * 100).toFixed(1)
      };
    }),
    peakHours: [
      { hour: '18:00', redemptions: 8 },
      { hour: '19:00', redemptions: 12 },
      { hour: '20:00', redemptions: 18 },
      { hour: '21:00', redemptions: 25 },
      { hour: '22:00', redemptions: 32 },
      { hour: '23:00', redemptions: 28 },
      { hour: '00:00', redemptions: 22 },
      { hour: '01:00', redemptions: 15 }
    ],
    customerInsights: {
      returningCustomers: 67,
      averageAge: 28,
      malePercentage: 52,
      femalePercentage: 48
    }
  };

  const periods = [
    { id: 'day', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden pb-20 lg:pb-0">
      <div className="space-y-4 lg:space-y-8 p-3 sm:p-4 lg:p-6">
        {/* Floating Header Card */}
        <div className="white-card">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl lg:text-3xl font-bold text-gray-900">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1 lg:mt-2 text-sm lg:text-base">Track your bar's performance and customer engagement</p>
            </div>
            
            {/* Floating Period Selector */}
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
          </div>
        </div>

        {/* Floating Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 lg:gap-6">
          {[
            { icon: Wine, label: 'DRINKS SERVED', value: analyticsData.overview.drinksServed, change: '+12%', color: 'from-cyan-500 to-cyan-600' },
            { icon: TrendingUp, label: 'RATE', value: `${analyticsData.overview.redemptionRate}%`, change: '+5%', color: 'from-cyan-400 to-cyan-500' },
            { icon: Users, label: 'NEW CUSTOMERS', value: analyticsData.overview.newCustomers, change: '+8%', color: 'from-cyan-500 to-cyan-600' },
            { icon: Star, label: 'RATING', value: analyticsData.overview.averageRating, change: '+0.2', color: 'from-yellow-400 to-yellow-500' },
            { icon: MapPin, label: 'REVENUE', value: `${analyticsData.overview.totalRevenue} RON`, change: '+15%', color: 'from-green-500 to-green-600' }
          ].map((metric, index) => (
            <div key={index} className="white-card group hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 lg:p-3 rounded-xl bg-gradient-to-r ${metric.color} shadow-lg`}>
                  <metric.icon size={20} className="text-white" />
                </div>
                <span className="text-xs text-gray-600 uppercase tracking-wider font-medium hidden lg:block">{metric.label}</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg lg:text-2xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">
                  {metric.value}
                </h3>
                <p className="text-xs text-gray-600 uppercase tracking-wider font-medium lg:hidden">{metric.label}</p>
                <p className={`text-xs font-medium ${
                  metric.change.includes('+') ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {metric.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Daily Redemptions Chart */}
          <div className="white-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-2">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900">Daily Redemptions</h2>
              <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-600">
                <Calendar size={16} />
                <span>Last 7 days</span>
              </div>
            </div>
            <div className="space-y-4">
              {analyticsData.dailyRedemptions.map((day, index) => (
                <div key={day.day} className="group">
                  <div className="flex items-center justify-between mb-1 lg:mb-2">
                    <span className="text-xs lg:text-sm font-medium text-gray-700 w-8 lg:w-12">{day.day}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs lg:text-sm text-gray-600">{day.redemptions}/{day.offered}</span>
                      <span className="text-xs lg:text-sm font-bold text-cyan-600 w-8 lg:w-12 text-right">
                        {Math.round((day.redemptions / day.offered) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="h-2 lg:h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${(day.redemptions / day.offered) * 100}%`,
                          animationDelay: `${index * 100}ms`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Drinks Chart */}
          <div className="white-card">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900">Most Popular Drinks</h2>
              <Wine className="text-cyan-600" size={20} />
            </div>
            <div className="space-y-3 lg:space-y-5">
              {analyticsData.topDrinks.map((drink, index) => (
                <div key={drink.name} className="group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 lg:w-10 h-8 lg:h-10 rounded-xl bg-gradient-to-r ${
                      index === 0 ? 'from-yellow-400 to-yellow-600' :
                      index === 1 ? 'from-gray-300 to-gray-500' :
                      index === 2 ? 'from-amber-600 to-amber-800' :
                      'from-cyan-500 to-cyan-600'
                    } flex items-center justify-center shadow-lg`}>
                      <span className="text-white text-xs lg:text-sm font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1 lg:mb-2">
                        <span className="font-medium text-gray-900 group-hover:text-cyan-600 transition-colors text-sm lg:text-base truncate">
                          {drink.name}
                        </span>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs lg:text-sm font-bold text-cyan-600">{drink.redemptions}</span>
                          <span className="text-xs lg:text-sm text-gray-600 w-8 lg:w-12 text-right">{drink.percentage}%</span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full transition-all duration-1000 ease-out"
                            style={{ 
                              width: `${drink.percentage}%`,
                              animationDelay: `${index * 150}ms`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Peak Hours & Customer Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Peak Hours */}
          <div className="white-card">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900">Peak Hours</h2>
              <Clock className="text-cyan-600" size={20} />
            </div>
            <div className="space-y-4">
              {analyticsData.peakHours.map((hour, index) => (
                <div key={hour.hour} className="group">
                  <div className="flex items-center justify-between mb-1 lg:mb-2">
                    <span className="text-xs lg:text-sm font-medium text-gray-700 w-12 lg:w-16">{hour.hour}</span>
                    <span className="text-xs lg:text-sm font-bold text-cyan-600 w-6 lg:w-8 text-right">{hour.redemptions}</span>
                  </div>
                  <div className="relative">
                    <div className="h-2 lg:h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${(hour.redemptions / 32) * 100}%`,
                          animationDelay: `${index * 100}ms`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Insights */}
          <div className="white-card">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900">Customer Insights</h2>
              <Users className="text-cyan-600" size={20} />
            </div>
            <div className="space-y-4 lg:space-y-8">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs lg:text-sm text-gray-600">Returning Customers</span>
                  <span className="font-bold text-cyan-600 text-base lg:text-lg">{analyticsData.customerInsights.returningCustomers}%</span>
                </div>
                <div className="relative">
                  <div className="h-2 lg:h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${analyticsData.customerInsights.returningCustomers}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="white-card-secondary p-4 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs lg:text-sm text-gray-600">Average Age</span>
                  <span className="font-bold text-gray-900 text-base lg:text-lg">{analyticsData.customerInsights.averageAge} years</span>
                </div>
              </div>

              <div>
                <h3 className="text-xs lg:text-sm text-gray-600 mb-4">Gender Distribution</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs lg:text-sm text-gray-700">Male</span>
                      <span className="text-xs lg:text-sm font-medium text-cyan-600">{analyticsData.customerInsights.malePercentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${analyticsData.customerInsights.malePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs lg:text-sm text-gray-700">Female</span>
                      <span className="text-xs lg:text-sm font-medium text-cyan-500">{analyticsData.customerInsights.femalePercentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${analyticsData.customerInsights.femalePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Export & Actions Card */}
        <div className="white-card">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">Export & Reports</h2>
              <p className="text-gray-600 text-sm lg:text-base">Download detailed analytics reports and schedule automated insights</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-4">
              <button className="white-button-secondary px-4 lg:px-6 py-2 lg:py-3 rounded-xl flex items-center justify-center space-x-2 group min-h-[44px]">
                <Download size={18} className="group-hover:text-cyan-600 transition-colors" />
                <span className="text-sm lg:text-base">Export CSV</span>
              </button>
              <button className="white-button-secondary px-4 lg:px-6 py-2 lg:py-3 rounded-xl flex items-center justify-center space-x-2 group min-h-[44px]">
                <FileText size={18} className="group-hover:text-cyan-500 transition-colors" />
                <span className="text-sm lg:text-base">Generate Report</span>
              </button>
              <button className="white-button-primary px-4 lg:px-6 py-2 lg:py-3 rounded-xl flex items-center justify-center space-x-2 min-h-[44px]">
                <CalendarIcon size={18} />
                <span className="text-sm lg:text-base">Schedule Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};