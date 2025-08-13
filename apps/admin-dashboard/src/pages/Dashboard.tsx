import React, { useEffect } from 'react';
import { 
  Building2, 
  Calendar, 
  Users, 
  Megaphone, 
  TrendingUp, 
  DollarSign,
  BarChart3,
  Activity
} from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import { AdminStats } from '../types';

// Mock data for demonstration
const mockStats: AdminStats = {
  totalBars: 15,
  activeEvents: 8,
  totalUsers: 1247,
  tokenRedemptions: 89,
  totalRevenue: 15420.50,
  activeCampaigns: 12
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  change?: string;
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
          {change && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              {change}
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

const Dashboard: React.FC = () => {
  const { stats, setStats, setStatsLoading } = useAdminStore();

  useEffect(() => {
    const loadStats = async () => {
      setStatsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setStats(mockStats);
      }, 1000);
    };

    loadStats();
  }, [setStats, setStatsLoading]);

  const recentActivity = [
    { id: 1, type: 'bar', action: 'New bar added', name: 'Control Club', time: '2 hours ago' },
    { id: 2, type: 'event', action: 'Event created', name: 'Electronic Fridays', time: '4 hours ago' },
    { id: 3, type: 'campaign', action: 'Campaign launched', name: 'Summer Drinks', time: '6 hours ago' },
    { id: 4, type: 'user', action: 'New user registered', name: 'john.doe@email.com', time: '8 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to the CRWD Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard
          title="Total Bars"
          value={stats.data?.totalBars || 0}
          change="+2 this week"
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Active Events"
          value={stats.data?.activeEvents || 0}
          change="+3 today"
          icon={Calendar}
          color="green"
        />
        <StatCard
          title="Total Users"
          value={stats.data?.totalUsers || 0}
          change="+12% this month"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Token Redemptions"
          value={stats.data?.tokenRedemptions || 0}
          change="+8 today"
          icon={Activity}
          color="orange"
        />
        <StatCard
          title="Total Revenue"
          value={`$${(stats.data?.totalRevenue || 0).toLocaleString()}`}
          change="+15% this month"
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Active Campaigns"
          value={stats.data?.activeCampaigns || 0}
          change="+2 this week"
          icon={Megaphone}
          color="red"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Placeholder */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart will be implemented here</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}: <span className="text-blue-600">{activity.name}</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="btn-primary flex items-center justify-center space-x-2">
            <Building2 className="w-4 h-4" />
            <span>Add New Bar</span>
          </button>
          <button className="btn-primary flex items-center justify-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Create Event</span>
          </button>
          <button className="btn-primary flex items-center justify-center space-x-2">
            <Megaphone className="w-4 h-4" />
            <span>Launch Campaign</span>
          </button>
          <button className="btn-primary flex items-center justify-center space-x-2">
            <Users className="w-4 h-4" />
            <span>View Users</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
