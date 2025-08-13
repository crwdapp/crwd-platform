import React, { useState, useMemo } from 'react';
import { Plus, Search, Calendar, Users, DollarSign, MoreVertical, Edit2, Trash2, Eye, Star, Clock, MapPin } from 'lucide-react';
import { EventCreateForm } from '../../components/dashboard/EventCreateForm';
import { Event, EventStatus } from '../../types/event';
import { useAppStore } from '../../store';

export const EventsManagementPage: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | EventStatus>('all');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const { events, deleteEvent, updateEvent } = useAppStore();

  // Mock bar data - in real app this would come from authenticated user/bar context
  const currentBar = {
    id: 1,
    name: 'CTRL Club',
    location: 'Bucharest Old Town',
    lat: 44.4268,
    lng: 26.1025
  };

  // Get events for current bar
  const barEvents = useMemo(() => {
    return events.items.filter(event => event.barId === currentBar.id);
  }, [events.items, currentBar.id]);

  // Filter and search events
  const filteredEvents = useMemo(() => {
    let filtered = barEvents;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.dj?.toLowerCase().includes(query) ||
        event.genre?.toLowerCase().includes(query)
      );
    }

    // Sort by date (upcoming first, then by date)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      const now = new Date();

      // Separate upcoming and past events
      const aUpcoming = dateA >= now;
      const bUpcoming = dateB >= now;

      if (aUpcoming && !bUpcoming) return -1;
      if (!aUpcoming && bUpcoming) return 1;

      // For events in the same category (both upcoming or both past), sort by date
      if (aUpcoming) {
        return dateA.getTime() - dateB.getTime(); // Upcoming: earliest first
      } else {
        return dateB.getTime() - dateA.getTime(); // Past: latest first
      }
    });
  }, [barEvents, statusFilter, searchQuery]);

  // Event statistics
  const stats = useMemo(() => {
    const now = new Date();
    const upcoming = barEvents.filter(e => new Date(e.date) >= now);
    const ongoing = barEvents.filter(e => e.status === EventStatus.ONGOING);
    const totalAttendees = barEvents.reduce((sum, e) => sum + e.attendees, 0);
    const totalRevenue = barEvents.reduce((sum, e) => sum + (e.price * e.attendees), 0);

    return {
      total: barEvents.length,
      upcoming: upcoming.length,
      ongoing: ongoing.length,
      totalAttendees,
      totalRevenue
    };
  }, [barEvents]);

  const handleCreateEvent = () => {
    setShowCreateForm(true);
    setEditingEvent(null);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowCreateForm(true);
    setActiveDropdown(null);
  };

  const handleDeleteEvent = (eventId: number) => {
    deleteEvent(eventId);
    setShowDeleteConfirm(null);
    setActiveDropdown(null);
  };


  const handleFormSuccess = () => {
    setShowCreateForm(false);
    setEditingEvent(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case EventStatus.ONGOING: return 'bg-green-500';
      case EventStatus.UPCOMING: return 'bg-blue-500';
      case EventStatus.COMPLETED: return 'bg-gray-500';
      case EventStatus.CANCELLED: return 'bg-red-500';
      case EventStatus.SOLD_OUT: return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 lg:mb-2">Events Management</h1>
          <p className="text-gray-600 text-sm lg:text-base">Manage your bar's events and track attendance</p>
        </div>
        <button
          onClick={handleCreateEvent}
          className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors duration-300 min-h-[44px]"
        >
          <Plus size={20} />
          <span>Create Event</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Events</p>
              <p className="text-gray-900 text-lg lg:text-xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Clock size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Upcoming</p>
              <p className="text-gray-900 text-lg lg:text-xl font-bold">{stats.upcoming}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Eye size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Ongoing</p>
              <p className="text-gray-900 text-lg lg:text-xl font-bold">{stats.ongoing}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Attendees</p>
              <p className="text-gray-900 text-lg lg:text-xl font-bold">{stats.totalAttendees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-50 rounded-lg">
              <DollarSign size={20} className="text-cyan-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Revenue</p>
              <p className="text-gray-900 text-lg lg:text-xl font-bold">${stats.totalRevenue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-colors duration-300"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | EventStatus)}
          className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-colors duration-300 min-w-[140px]"
        >
          <option value="all">All Status</option>
          <option value={EventStatus.UPCOMING}>Upcoming</option>
          <option value={EventStatus.ONGOING}>Ongoing</option>
          <option value={EventStatus.COMPLETED}>Completed</option>
          <option value={EventStatus.CANCELLED}>Cancelled</option>
          <option value={EventStatus.SOLD_OUT}>Sold Out</option>
        </select>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredEvents.length === 0 ? (
          <div className="p-8 lg:p-12 text-center">
            <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No events found' : 'No events yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first event to get started'
              }
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button
                onClick={handleCreateEvent}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors duration-300"
              >
                Create Event
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <div key={event.id} className="p-4 lg:p-6 hover:bg-gray-50 transition-colors duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                      
                      {/* Status Badge */}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(event.status)}`}>
                        {event.status.replace('_', ' ').toUpperCase()}
                      </span>
                      
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>

                    {/* Event Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={14} className="text-gray-400" />
                        <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users size={14} className="text-gray-400" />
                        <span>{event.attendees}/{event.capacity} attendees</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign size={14} className="text-gray-400" />
                        <span className="font-medium">{event.price === 0 ? 'FREE' : `$${event.price}`}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {event.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                        {event.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{event.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Dropdown */}
                  <div className="relative ml-4">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === event.id ? null : event.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                    >
                      <MoreVertical size={20} className="text-gray-400" />
                    </button>

                    {activeDropdown === event.id && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="w-full flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-300 rounded-t-lg"
                        >
                          <Edit2 size={16} />
                          Edit Event
                        </button>
                        
                        
                        <button
                          onClick={() => setShowDeleteConfirm(event.id)}
                          className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-300 rounded-b-lg"
                        >
                          <Trash2 size={16} />
                          Delete Event
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Event Modal */}
      {showCreateForm && (
        <EventCreateForm
          onClose={() => {
            setShowCreateForm(false);
            setEditingEvent(null);
          }}
          onSuccess={handleFormSuccess}
          barId={currentBar.id}
          barName={currentBar.name}
          barLocation={currentBar.location}
          barLat={currentBar.lat}
          barLng={currentBar.lng}
          editingEvent={editingEvent}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md border border-gray-200 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Event</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this event? This action cannot be undone and will remove all associated data.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteEvent(showDeleteConfirm)}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-300"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
};