import React from 'react';
import { Calendar, Clock, Users, ExternalLink } from 'lucide-react';
import { Event } from '../../types/event';
import { useNavigate } from 'react-router-dom';

interface BarEventsProps {
  barId: number;
  events: Event[];
}

export const BarEvents: React.FC<BarEventsProps> = ({ barId, events }) => {
  const navigate = useNavigate();
  
  // Filter events for this bar and upcoming events only
  const barEvents = events.filter(event => 
    event.barId === barId && 
    new Date(event.date) >= new Date()
  ).slice(0, 3); // Show max 3 upcoming events

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
        weekday: 'short'
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

  const handleViewAllEvents = () => {
    navigate('/events');
  };

  if (barEvents.length === 0) {
    return null; // Don't show section if no upcoming events
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Upcoming Events</h3>
        <button
          onClick={handleViewAllEvents}
          className="flex items-center gap-1 text-[#6FFFE9] text-sm font-medium hover:text-[#5BC0CE] transition-colors duration-300"
        >
          View All <ExternalLink size={14} />
        </button>
      </div>

      <div className="space-y-3">
        {barEvents.map(event => (
          <div
            key={event.id}
            className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-black/30 hover:border-white/20 transition-all duration-300"
            onClick={() => navigate('/events')}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">{event.name}</h4>
                <div className="flex items-center gap-4 text-sm text-white/70 mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{formatTime(event.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{event.attendees}/{event.capacity}</span>
                  </div>
                </div>
                {event.description && (
                  <p className="text-white/60 text-sm line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
              
              <div className="flex flex-col items-end gap-2 ml-4">
                <div className="text-white font-medium">
                  {event.price === 0 ? (
                    <span className="text-[#6FFFE9]">FREE</span>
                  ) : (
                    <span>${event.price}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Event tags */}
            {event.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {event.tags.slice(0, 3).map(tag => (
                  <span 
                    key={tag}
                    className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
                {event.tags.length > 3 && (
                  <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">
                    +{event.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};