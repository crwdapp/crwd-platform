import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building2, 
  Calendar, 
  DollarSign,
  BarChart3,
  Activity,
  Eye,
  Download
} from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalUsers: 1247,
    totalBars: 15,
    totalEvents: 8,
    totalRevenue: 15420.50,
    userGrowth: 12.5,
    revenueGrowth: 8.3,
    eventGrowth: -2.1,
    barGrowth: 0
  },
  userMetrics: {
    newUsers: 89,
    activeUsers: 456,
    premiumUsers: 234,
    userRetention: 78.5
  },
  revenueMetrics: {
    monthlyRevenue: 15420.50,
    averageOrderValue: 45.20,
    topRevenueSource: 'Premium Subscriptions',
    revenueGrowth: 8.3
  },
  engagementMetrics: {
    averageSessionDuration: '24 minutes',
    eventsAttended: 156,
    tokensRedeemed: 89,
    userSatisfaction: 4.6
  }
};

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}> = ({ title, value, change, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className="admin-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <p className={`text-sm flex items-center mt-1 ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {Math.abs(change)}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const SystemAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState(mockAnalytics);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setAnalytics(mockAnalytics);
        setLoading(false);
      }, 1000);
    };

    loadAnalytics();
  }, [timeRange]);

  const recentActivity = [
    { id: 1, type: 'user', action: 'New user registered', value: 'john@example.com', time: '2 hours ago' },
    { id: 2, type: 'event', action: 'Event created', value: 'Electronic Fridays', time: '4 hours ago' },
    { id: 3, type: 'revenue', action: 'Payment received', value: '$45.00', time: '6 hours ago' },
    { id: 4, type: 'bar', action: 'Bar updated', value: 'Control Club', time: '8 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Analytics</h1>
          <p className="text-gray-600">View system-wide analytics and metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="btn-primary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={analytics.overview.totalUsers.toLocaleString()}
          change={analytics.overview.userGrowth}
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Total Revenue"
          value={`$${analytics.overview.totalRevenue.toLocaleString()}`}
          change={analytics.overview.revenueGrowth}
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Total Events"
          value={analytics.overview.totalEvents}
          change={analytics.overview.eventGrowth}
          icon={Calendar}
          color="purple"
        />
        <MetricCard
          title="Total Bars"
          value={analytics.overview.totalBars}
          change={analytics.overview.barGrowth}
          icon={Building2}
          color="orange"
        />
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Metrics */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">User Metrics</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New Users</span>
              <span className="font-semibold">{analytics.userMetrics.newUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Users</span>
              <span className="font-semibold">{analytics.userMetrics.activeUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Premium Users</span>
              <span className="font-semibold">{analytics.userMetrics.premiumUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">User Retention</span>
              <span className="font-semibold">{analytics.userMetrics.userRetention}%</span>
            </div>
          </div>
        </div>

        {/* Revenue Metrics */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Metrics</h3>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Revenue</span>
              <span className="font-semibold">${analytics.revenueMetrics.monthlyRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg Order Value</span>
              <span className="font-semibold">${analytics.revenueMetrics.averageOrderValue}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Top Revenue Source</span>
              <span className="font-semibold">{analytics.revenueMetrics.topRevenueSource}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Revenue Growth</span>
              <span className="font-semibold text-green-600">+{analytics.revenueMetrics.revenueGrowth}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Engagement Metrics</h3>
          <Activity className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{analytics.engagementMetrics.averageSessionDuration}</p>
            <p className="text-sm text-gray-600">Avg Session Duration</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{analytics.engagementMetrics.eventsAttended}</p>
            <p className="text-sm text-gray-600">Events Attended</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{analytics.engagementMetrics.tokensRedeemed}</p>
            <p className="text-sm text-gray-600">Tokens Redeemed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{analytics.engagementMetrics.userSatisfaction}/5</p>
            <p className="text-sm text-gray-600">User Satisfaction</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <Eye className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {activity.action}: <span className="text-blue-600">{activity.value}</span>
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemAnalytics;
