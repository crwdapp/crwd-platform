import React, { useState, useMemo, useEffect } from 'react';
import { Search, Calendar, TrendingUp, Clock, CalendarDays, MapPin } from 'lucide-react';
import { EventCard } from './EventCard';
import { Event, EventCategory, EventStatus } from '../../types/event';
import { useAppStore } from '../../store';
import CalendarPicker from './CalendarPicker';
import { locationService } from '../../services/location/locationService';

interface EventsDiscoveryProps {
  events: Event[];
  loading?: boolean;
  onEventClick?: (event: Event) => void;
}

export const EventsDiscovery: React.FC<EventsDiscoveryProps> = ({ 
  events, 
  loading = false,
  onEventClick 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'tonight' | 'this_week' | 'trending' | 'custom'>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [selectedCity, setSelectedCity] = useState('BUCHAREST');
  const [showMyEvents, setShowMyEvents] = useState(false);

  const { user, events: userEvents } = useAppStore();

  // Auto-select closest city on component mount
  useEffect(() => {
    const selectClosestCity = async () => {
      try {
        // Get user's current location
        const userLocation = await locationService.getCurrentLocation();
        
        // Calculate distances to all cities and find the closest one
        const cityDistances = cities.map(city => {
          const cityCoords = locationService.getCityCoordinates(city);
          if (!cityCoords) return { city, distance: Infinity };
          
          const distance = calculateDistance(
            userLocation.lat, userLocation.lng,
            cityCoords.lat, cityCoords.lng
          );
          
          return { city, distance };
        });
        
        // Sort by distance and select the closest city
        cityDistances.sort((a, b) => a.distance - b.distance);
        const closestCity = cityDistances[0].city;
        
        setSelectedCity(closestCity);
        console.log('Auto-selected closest city:', closestCity);
        
      } catch (error) {
        console.warn('Could not determine closest city, using default:', error);
        // Keep default BUCHAREST if location fails
      }
    };

    selectClosestCity();
  }, []);

  // Helper function to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getEventCountForDate = (dateFilter: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      switch (dateFilter) {
        case 'tonight':
          return eventDate.toDateString() === today.toDateString();
        case 'this_week':
          const weekEnd = new Date(today);
          weekEnd.setDate(today.getDate() + 7);
          return eventDate >= today && eventDate <= weekEnd;
        default:
          return true;
      }
    }).length;
  };

  const getCustomDateCount = () => {
    if (!selectedDate) return 0;
    return events.filter(event => {
      const eventDate = new Date(event.date);
      const customDate = new Date(selectedDate);
      return eventDate.toDateString() === customDate.toDateString();
    }).length;
  };

  const getTrendingCount = () => {
    return events.filter(event => {
      const interactions = event.interestedCount + event.goingCount;
      return interactions >= 200; // Consider trending if interactions >= 200
    }).length;
  };

  // Get user's interacted events (bookmarked, going, interested)
  const getUserInteractedEvents = () => {
    if (!user || !userEvents) return [];
    
    const userBookmarks = userEvents.bookmarks
      .filter(bookmark => bookmark.userId === user.id)
      .map(bookmark => bookmark.eventId);
    
    const userAttendance = userEvents.attendance
      .filter(attendance => attendance.userId === user.id && 
        (attendance.status === 'going' || attendance.status === 'interested'))
      .map(attendance => attendance.eventId);
    
    const allInteractedEventIds = [...new Set([...userBookmarks, ...userAttendance])];
    
    return events.filter(event => allInteractedEventIds.includes(event.id));
  };

  const userInteractedEvents = getUserInteractedEvents();

  // Simplified filters - including custom date
  const filters = [
    { key: 'all', label: 'All', icon: Calendar },
    { key: 'tonight', label: 'Tonight', icon: Clock },
    { key: 'this_week', label: 'This Week', icon: Calendar },
    { key: 'trending', label: 'Trending', icon: TrendingUp },
    { key: 'custom', label: 'Custom Date', icon: CalendarDays }
  ];

  const cities = [
    'BUCHAREST',
    'CONSTANTA',
    'DUBLIN',
    'CLUJ',
    'TIMISOARA',
    'BRASOV'
  ];

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = [...events];

    // My Events filter (highest priority)
    if (showMyEvents) {
      filtered = filtered.filter(event => 
        userInteractedEvents.some(userEvent => userEvent.id === event.id)
      );
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.barName.toLowerCase().includes(query) ||
        event.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Primary filter (only apply if not showing My Events)
    if (!showMyEvents) {
      switch (selectedFilter) {
        case 'tonight':
          filtered = filtered.filter(event => {
            const eventDate = new Date(event.date);
            const today = new Date();
            return eventDate.toDateString() === today.toDateString();
          });
          break;
        case 'this_week':
          filtered = filtered.filter(event => {
            const eventDate = new Date(event.date);
            const today = new Date();
            const weekEnd = new Date(today);
            weekEnd.setDate(today.getDate() + 7);
            return eventDate >= today && eventDate <= weekEnd;
          });
          break;
        case 'custom':
          if (selectedDate) {
            filtered = filtered.filter(event => {
              const eventDate = new Date(event.date);
              const customDate = new Date(selectedDate);
              return eventDate.toDateString() === customDate.toDateString();
            });
          }
          break;
        case 'trending':
          filtered.sort((a, b) => {
            const aInteractions = a.interestedCount + a.goingCount;
            const bInteractions = b.interestedCount + b.goingCount;
            return bInteractions - aInteractions;
          });
          // Only show events with 200+ interactions
          filtered = filtered.filter(event => {
            const interactions = event.interestedCount + event.goingCount;
            return interactions >= 200;
          });
          break;
        default:
          // 'all' - no filtering
          break;
      }
    }

    return filtered;
  }, [events, searchQuery, selectedFilter, selectedDate, showMyEvents, userInteractedEvents]);

  const handleFilterClick = (filterKey: string) => {
    if (filterKey === 'custom') {
      setShowDatePicker(true);
    } else {
      setSelectedFilter(filterKey as any);
      setSelectedDate(''); // Clear custom date when switching to other filters
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedFilter('custom');
    setShowDatePicker(false);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setShowCityPicker(false);
  };

  const formatCustomDate = (dateString: string) => {
    if (!dateString) return 'Select Date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-primary rounded-2xl p-4 animate-pulse">
            <div className="h-48 bg-white/10 rounded-xl mb-4"></div>
            <div className="h-4 bg-white/10 rounded mb-2"></div>
            <div className="h-6 bg-white/10 rounded mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with Search */}
      <div className="p-4 border-b border-white/10">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white">Events</h2>
        </div>
        
        {/* Enhanced Search Bar */}
        <div className="relative mb-4">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          <input
            type="text"
            placeholder="Search events, venues, or DJs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 backdrop-blur-xl border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/50 focus:border-[#5BC0CE] focus:outline-none transition-colors duration-300"
          />
        </div>

        {/* Location and Filters */}
        <div className="mb-4 space-y-3">
          {/* Simplified Filters */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {/* Nearby Button */}
            <button
              onClick={() => setShowCityPicker(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#5BC0CE] text-black rounded-full text-sm font-medium transition-all duration-300 hover:bg-[#6FFFE9] whitespace-nowrap"
            >
              <MapPin size={14} />
              <span>{selectedCity}</span>
            </button>

            {filters.map(({ key, label, icon: Icon }) => {
              const isActive = selectedFilter === key;
               
              return (
                <button
                  key={key}
                  onClick={() => handleFilterClick(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? 'bg-[#5BC0CE] text-black'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Date Display */}
        {selectedFilter === 'custom' && selectedDate && (
          <div className="mb-4 p-3 bg-[#5BC0CE]/10 border border-[#5BC0CE]/20 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#5BC0CE] font-medium">
                Events on {formatCustomDate(selectedDate)}
              </span>
              <button
                onClick={() => {
                  setSelectedDate('');
                  setSelectedFilter('all');
                }}
                className="text-xs text-[#5BC0CE] hover:text-[#6FFFE9] transition-colors duration-300"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Date Picker Modal */}
        {showDatePicker && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Select Date</h3>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="text-white/60 hover:text-white transition-colors duration-300"
                >
                  ✕
                </button>
              </div>
              
              <CalendarPicker 
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                onClose={() => setShowDatePicker(false)}
              />
            </div>
          </div>
        )}

        {/* City Picker Modal */}
        {showCityPicker && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Select City</h3>
                <button
                  onClick={() => setShowCityPicker(false)}
                  className="text-white/60 hover:text-white transition-colors duration-300"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {cities.map(city => (
                  <button
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                      selectedCity === city
                        ? 'bg-[#5BC0CE] text-black'
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Count and My Events Button */}
        <div className="flex items-center justify-between">
          {/* My Events Button - Always visible */}
          <button
            onClick={() => setShowMyEvents(!showMyEvents)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              showMyEvents
                ? 'bg-[#5BC0CE] text-black'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            My Events ({userInteractedEvents.length})
          </button>
          
          {/* Results Count - Only show if there are events */}
          {filteredAndSortedEvents.length > 0 && (
            <span className="text-sm text-white/60">
              {filteredAndSortedEvents.length} events
            </span>
          )}
        </div>
      </div>

      {/* Events Grid */}
      <div className="flex-1 overflow-y-auto">
        {filteredAndSortedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-4">
            <Calendar size={48} className="text-white/30 mb-4" />
            <h3 className="text-lg font-medium text-white/80 mb-2">No events found</h3>
            <p className="text-white/60 text-sm">Try adjusting your search or filters to find more events.</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {filteredAndSortedEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onEventClick={onEventClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};