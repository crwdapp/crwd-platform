import React, { useMemo } from 'react';
import { Calendar, Filter, Map, List } from 'lucide-react';
import { EventCard } from './EventCard';
import { Event, EventFilter } from '../../types/event';
import { useAppStore } from '../../store';

interface EventsListProps {
  events: Event[];
  loading?: boolean;
  onEventClick?: (event: Event) => void;
}

export const EventsList: React.FC<EventsListProps> = ({ 
  events, 
  loading = false,
  onEventClick 
}) => {
  const { events: eventsState, setEventsViewMode, setEventFilters } = useAppStore();
  const { viewMode, filters } = eventsState;

  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Apply category filter
    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(event => 
        filters.category!.includes(event.category)
      );
    }

    // Apply date filter
    if (filters.date) {
      const startDate = new Date(filters.date.start);
      const endDate = new Date(filters.date.end);
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= startDate && eventDate <= endDate;
      });
    }

    // Apply price filter
    if (filters.priceRange) {
      filtered = filtered.filter(event => 
        event.price >= filters.priceRange!.min && 
        event.price <= filters.priceRange!.max
      );
    }


    // Sort by date (upcoming first)
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return filtered;
  }, [events, filters]);

  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: Event[] } = {};
    
    filteredEvents.forEach(event => {
      const eventDate = new Date(event.date);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      let groupKey: string;
      
      if (eventDate.toDateString() === today.toDateString()) {
        groupKey = 'Today';
      } else if (eventDate.toDateString() === tomorrow.toDateString()) {
        groupKey = 'Tomorrow';
      } else {
        groupKey = eventDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        });
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(event);
    });
    
    return groups;
  }, [filteredEvents]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-4 animate-pulse">
              <div className="h-48 bg-white/10 rounded-xl mb-4"></div>
              <div className="h-4 bg-white/10 rounded mb-2"></div>
              <div className="h-6 bg-white/10 rounded mb-2"></div>
              <div className="h-4 bg-white/10 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Events</h2>
          
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setEventFilters({ 
              priceRange: filters.priceRange?.min === 0 ? undefined : { min: 0, max: 0 }
            })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${
              filters.priceRange?.min === 0 && filters.priceRange?.max === 0
                ? 'bg-[#6FFFE9] text-black'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            Free Events
          </button>
          <button className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap bg-white/10 text-white/80 hover:bg-white/20 transition-all duration-300">
            <Filter size={12} className="inline mr-1" />
            More Filters
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto">
        {Object.keys(groupedEvents).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Calendar size={48} className="text-white/30 mb-4" />
            <h3 className="text-lg font-medium text-white/80 mb-2">No events found</h3>
            <p className="text-white/60">Try adjusting your filters or check back later for new events.</p>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {Object.entries(groupedEvents).map(([dateGroup, groupEvents]) => (
              <div key={dateGroup}>
                <h3 className="text-lg font-semibold text-white mb-3 sticky top-0 bg-black/50 backdrop-blur-xl py-2 -mx-4 px-4 border-b border-white/10">
                  {dateGroup} ({groupEvents.length})
                </h3>
                <div className="grid gap-4">
                  {groupEvents.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onEventClick={onEventClick}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};