import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreVertical, Eye, Edit, Trash2, Grid, List, MapPin, Clock, Users, Calendar, Tag } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { AdminDataTable } from '../../components/DataTable/AdminDataTable';
import { allEvents, EventData } from '../../../../../src/data/events';

const EventList: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load real event data
    setEvents(allEvents);
  }, []);

  const columns = [
    { key: 'name' as keyof EventData, header: 'Event Name' },
    { key: 'barName' as keyof EventData, header: 'Bar' },
    { key: 'date' as keyof EventData, header: 'Date' },
    { key: 'startTime' as keyof EventData, header: 'Start Time' },
    { key: 'status' as keyof EventData, header: 'Status' },
    { key: 'attendees' as keyof EventData, header: 'Attendees' },
    { key: 'capacity' as keyof EventData, header: 'Capacity' },
    { key: 'price' as keyof EventData, header: 'Price' }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.barName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.genre?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleView = (event: EventData) => {
    console.log('View event:', event);
    // Navigate to event detail page
  };

  const handleEdit = (event: EventData) => {
    console.log('Edit event:', event);
    // Open edit modal or navigate to edit page
  };

  const handleDelete = (event: EventData) => {
    if (window.confirm(`Are you sure you want to delete "${event.name}"?`)) {
      setEvents(events.filter(e => e.id !== event.id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'sold_out': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const EventCard: React.FC<{ event: EventData }> = ({ event }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <div className="relative">
        <img 
          src={event.image} 
          alt={event.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
            {event.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded-full">
            {event.price === 0 ? 'FREE' : `$${event.price}`}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{event.name}</h3>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{event.attendees}/{event.capacity}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-2">{event.barName}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{event.barLocation}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>{event.startTime}</span>
          </div>
        </div>
        
        {event.genre && (
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <Tag className="w-4 h-4 mr-1" />
            <span>{event.genre}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {event.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                {tag}
              </span>
            ))}
            {event.tags.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{event.tags.length - 2}
              </span>
            )}
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={() => handleView(event)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEdit(event)}
              className="p-1 text-green-600 hover:bg-green-50 rounded"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(event)}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600">Manage events and activities</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create Event</span>
        </button>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="sold_out">Sold Out</option>
        </select>
        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-2 ${viewMode === 'cards' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-2 ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <AdminDataTable
          data={filteredEvents}
          columns={columns}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          emptyMessage="No events found"
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="admin-card">
          <h3 className="text-sm font-medium text-gray-600">Total Events</h3>
          <p className="text-2xl font-bold text-gray-900">{events.length}</p>
        </div>
        <div className="admin-card">
          <h3 className="text-sm font-medium text-gray-600">Upcoming Events</h3>
          <p className="text-2xl font-bold text-blue-600">
            {events.filter(e => e.status === 'upcoming').length}
          </p>
        </div>
        <div className="admin-card">
          <h3 className="text-sm font-medium text-gray-600">Total Attendees</h3>
          <p className="text-2xl font-bold text-green-600">
            {events.reduce((sum, e) => sum + e.attendees, 0)}
          </p>
        </div>
        <div className="admin-card">
          <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
          <p className="text-2xl font-bold text-purple-600">
            ${events.reduce((sum, e) => sum + (e.price * e.attendees), 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventList;
