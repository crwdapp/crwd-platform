import React from 'react';
import { Calendar, Clock, MapPin, Users, Bookmark, Heart, Share2, Star, TrendingUp } from 'lucide-react';
import { Event, EventStatus } from '../../types/event';
import { useAppStore } from '../../store';
import { getEventImage, handleImageError } from '../../utils/imageUtils';

interface EventCardProps {
  event: Event;
  onEventClick?: (event: Event) => void;
  compact?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onEventClick,
  compact = false 
}) => {
  const { bookmarkEvent, unbookmarkEvent, setEventAttendance, events, user } = useAppStore();
  
  const isBookmarked = events.bookmarks.some(
    b => b.eventId === event.id && b.userId === user.id
  );
  
  const userAttendance = events.attendance.find(
    a => a.eventId === event.id && a.userId === user.id
  );

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBookmarked) {
      unbookmarkEvent(event.id);
    } else {
      bookmarkEvent(event.id);
    }
  };

  const handleAttendance = (e: React.MouseEvent, status: 'going' | 'interested') => {
    e.stopPropagation();
    
    if (userAttendance?.status === status) {
      setEventAttendance(event.id, 'not_going');
    } else {
      setEventAttendance(event.id, status);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Share functionality
    console.log('Share event:', event.name);
  };

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case EventStatus.ONGOING:
        return 'bg-green-500';
      case EventStatus.UPCOMING:
        return 'bg-blue-500';
      case EventStatus.SOLD_OUT:
        return 'bg-red-500';
      case EventStatus.CANCELLED:
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: EventStatus) => {
    switch (status) {
      case EventStatus.ONGOING:
        return 'LIVE';
      case EventStatus.UPCOMING:
        return 'UPCOMING';
      case EventStatus.SOLD_OUT:
        return 'SOLD OUT';
      case EventStatus.CANCELLED:
        return 'CANCELLED';
      default:
        return status.replace('_', ' ').toUpperCase();
    }
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

  const getTimeRemaining = () => {
    const eventDate = new Date(`${event.date}T${event.startTime}`);
    const now = new Date();
    const diff = eventDate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return 'Starting soon';
    }
  };

  const getEngagementScore = () => {
    const engagement = event.views + event.shares + event.goingCount + event.interestedCount;
    if (engagement > 500) return { score: '🔥', label: 'Hot' };
    if (engagement > 200) return { score: '⭐', label: 'Popular' };
    return { score: '📅', label: 'New' };
  };

  const engagement = getEngagementScore();

  return (
    <div 
      className={`glass-primary rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:bg-black/30 hover:border-white/20 group ${
        compact ? 'p-3' : 'p-0'
      }`}
      onClick={() => onEventClick?.(event)}
    >
      {/* Event Image with Overlays */}
      <div className="relative">
        <img 
          src={getEventImage(event.image, event.category)} 
          alt={event.name}
          className={`w-full object-cover ${compact ? 'h-32' : 'h-48'}`}
          onError={(e) => handleImageError(e, getEventImage(undefined, event.category))}
        />
        
        {/* Status Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(event.status)}`}>
          {getStatusText(event.status)}
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold text-black bg-[#5BC0CE]">
          {event.price === 0 ? 'FREE' : `$${event.price}`}
        </div>
        
        {/* Engagement Badge */}
        <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-bold text-white bg-black/50 backdrop-blur-sm">
          {engagement.score} {engagement.label}
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleBookmark}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
              isBookmarked 
                ? 'bg-[#5BC0CE] text-black' 
                : 'bg-black/50 backdrop-blur-sm text-white hover:bg-[#5BC0CE] hover:text-black'
            }`}
          >
            <Bookmark size={14} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-[#5BC0CE] hover:text-black flex items-center justify-center transition-colors duration-300"
          >
            <Share2 size={14} />
          </button>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-4">
        {/* Event Title and Category */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{event.name}</h3>
            <div className="flex items-center gap-2 text-sm text-[#D0D8E0]">
              <MapPin size={14} />
              <span>{event.barName}</span>
            </div>
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex items-center gap-4 mb-3 text-sm text-[#D0D8E0]">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{formatTime(event.startTime)}</span>
          </div>
        </div>

        {/* Time Remaining */}
        <div className="mb-3">
          <span className="text-xs text-[#5BC0CE] font-medium">{getTimeRemaining()}</span>
        </div>

        {/* Attendance and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm text-[#D0D8E0]">
              <Users size={14} />
              <span>{event.goingCount} going</span>
            </div>
          </div>
          
          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => handleAttendance(e, 'interested')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-300 ${
                userAttendance?.status === 'interested'
                  ? 'bg-[#5BC0CE] text-black'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Interested
            </button>
            <button
              onClick={(e) => handleAttendance(e, 'going')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-300 ${
                userAttendance?.status === 'going'
                  ? 'bg-green-500 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Going
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};