import React, { useMemo } from 'react';
import { Calendar, Users, TrendingUp, DollarSign, Star, Clock } from 'lucide-react';
import { EventStatus } from '../../types/event';
import { useAppStore } from '../../store';
import { Link } from 'react-router-dom';

interface EventsAnalyticsProps {
  barId: number;
}

export const EventsAnalytics: React.FC<EventsAnalyticsProps> = ({ barId }) => {
  const { events } = useAppStore();

  // Get events for current bar
  const barEvents = useMemo(() => {
    return events.items.filter(event => event.barId === barId);
  }, [events.items, barId]);

  // Calculate analytics
  const analytics = useMemo(() => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const upcomingEvents = barEvents.filter(e => new Date(e.date) >= now);
    const ongoingEvents = barEvents.filter(e => e.status === EventStatus.ONGOING);
    const thisMonthEvents = barEvents.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate >= thisMonth;
    });
    const lastMonthEvents = barEvents.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate >= lastMonth && eventDate < thisMonth;
    });

    const totalAttendees = barEvents.reduce((sum, e) => sum + e.attendees, 0);
    const totalRevenue = barEvents.reduce((sum, e) => sum + (e.price * e.attendees), 0);
    const thisMonthRevenue = thisMonthEvents.reduce((sum, e) => sum + (e.price * e.attendees), 0);
    const lastMonthRevenue = lastMonthEvents.reduce((sum, e) => sum + (e.price * e.attendees), 0);
    
    const avgAttendanceRate = barEvents.length > 0 
      ? (barEvents.reduce((sum, e) => sum + (e.attendees / e.capacity), 0) / barEvents.length) * 100
      : 0;

    // Growth calculations
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : thisMonthRevenue > 0 ? 100 : 0;

    const eventGrowth = lastMonthEvents.length > 0
      ? ((thisMonthEvents.length - lastMonthEvents.length) / lastMonthEvents.length) * 100
      : thisMonthEvents.length > 0 ? 100 : 0;

    return {
      total: barEvents.length,
      upcoming: upcomingEvents.length,
      ongoing: ongoingEvents.length,
      totalAttendees,
      totalRevenue,
      thisMonthRevenue,
      revenueGrowth,
      eventGrowth,
      avgAttendanceRate,
      thisMonthEvents: thisMonthEvents.length
    };
  }, [barEvents]);

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${growth.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Events Overview</h3>
        <Link 
          to="/dashboard/events"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Manage Events →
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-lg font-bold text-gray-900">{analytics.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Clock size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-lg font-bold text-gray-900">{analytics.upcoming}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Attendees</p>
              <p className="text-lg font-bold text-gray-900">{analytics.totalAttendees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <DollarSign size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-lg font-bold text-gray-900">${analytics.totalRevenue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-800">This Month</h4>
            <TrendingUp size={16} className="text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Events</span>
              <div className="flex items-center gap-1">
                <span className="font-medium">{analytics.thisMonthEvents}</span>
                <span className={`text-xs ${analytics.eventGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatGrowth(analytics.eventGrowth)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Revenue</span>
              <div className="flex items-center gap-1">
                <span className="font-medium">${analytics.thisMonthRevenue}</span>
                <span className={`text-xs ${analytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatGrowth(analytics.revenueGrowth)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-800">Attendance Rate</h4>
            <Users size={16} className="text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average</span>
              <span className="font-medium">{analytics.avgAttendanceRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(analytics.avgAttendanceRate, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-800">Event Status</h4>
            <Clock size={16} className="text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Upcoming</span>
              <span className="font-medium">{analytics.upcoming}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ongoing</span>
              <span className="font-medium text-green-600">{analytics.ongoing}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {analytics.total === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-blue-600" />
            <div>
              <h4 className="font-medium text-blue-900">Ready to create your first event?</h4>
              <p className="text-sm text-blue-700 mb-3">Start engaging your customers with exciting events</p>
              <Link 
                to="/dashboard/events"
                className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
              >
                Create Event
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};