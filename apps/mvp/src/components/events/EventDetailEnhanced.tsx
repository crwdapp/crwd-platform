import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Clock, MapPin, Users, Bookmark, Share2, Heart, Star, TrendingUp, ExternalLink, Camera, Users as UsersIcon } from 'lucide-react';
import { Event, EventStatus } from '../../types/event';
import { useAppStore } from '../../store';
import { getEventImage, handleImageError } from '../../utils/imageUtils';

interface EventDetailEnhancedProps {
  event: Event;
  onBack: () => void;
}

export const EventDetailEnhanced: React.FC<EventDetailEnhancedProps> = ({ 
  event, 
  onBack 
}) => {
  const { bookmarkEvent, unbookmarkEvent, setEventAttendance, events, user } = useAppStore();
  const [activeTab, setActiveTab] = useState<'details' | 'photos'>('details');
  
  const isBookmarked = events.bookmarks.some(
    b => b.eventId === event.id && b.userId === user.id
  );
  
  const userAttendance = events.attendance.find(
    a => a.eventId === event.id && a.userId === user.id
  );

  const handleBookmark = () => {
    if (isBookmarked) {
      unbookmarkEvent(event.id);
    } else {
      bookmarkEvent(event.id);
    }
  };

  const handleAttendance = (status: 'going' | 'interested') => {
    if (userAttendance?.status === status) {
      setEventAttendance(event.id, 'not_going');
    } else {
      setEventAttendance(event.id, status);
    }
  };

  const handleShare = () => {
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
        return 'LIVE NOW';
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
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getEngagementScore = () => {
    const engagement = event.views + event.shares + event.goingCount + event.interestedCount;
    if (engagement > 500) return { score: '🔥', label: 'Hot', color: 'text-red-400' };
    if (engagement > 200) return { score: '⭐', label: 'Popular', color: 'text-yellow-400' };
    return { score: '📅', label: 'New', color: 'text-blue-400' };
  };

  const engagement = getEngagementScore();

  return (
    <div className="h-full bg-transparent text-white overflow-auto pb-24">
      {/* Hero Image - Moved to top */}
      <div className="relative">
        <img 
          src={getEventImage(event.image, event.category)} 
          alt={event.name}
          className="w-full h-64 object-cover"
          onError={(e) => handleImageError(e, getEventImage(undefined, event.category))}
        />
        
        {/* Back Button - Moved to top left */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors duration-300"
        >
          <ArrowLeft size={20} />
        </button>
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold text-black bg-[#5BC0CE] flex items-center gap-1">
          <ArrowRight size={14} />
          <span>Meet Here</span>
        </div>
        
        {/* Engagement Badge */}
        <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-sm font-bold text-white bg-black/50 backdrop-blur-sm">
          {engagement.score} {engagement.label}
        </div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-10 bg-transparent">
        <div className="flex items-center justify-end p-4">
          <div className="flex items-center gap-2">
            {/* Action Buttons - Moved from attendance stats */}
            <button
              onClick={() => handleAttendance('interested')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-300 ${
                userAttendance?.status === 'interested'
                  ? 'bg-[#5BC0CE] text-black'
                  : 'bg-black/50 backdrop-blur-sm text-white hover:bg-black/70'
              }`}
            >
              Interested
            </button>
            <button
              onClick={() => handleAttendance('going')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-300 ${
                userAttendance?.status === 'going'
                  ? 'bg-green-500 text-white'
                  : 'bg-black/50 backdrop-blur-sm text-white hover:bg-black/70'
              }`}
            >
              Going
            </button>
            
            <button
              onClick={handleBookmark}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isBookmarked 
                  ? 'bg-[#5BC0CE] text-black' 
                  : 'bg-black/50 backdrop-blur-sm text-white hover:bg-black/70'
              }`}
            >
              <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      {/* Event Info */}
      <div className="p-4 space-y-4">
        {/* Title and Category */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{event.name}</h1>
          <div className="flex items-center gap-2 text-sm text-[#D0D8E0]">
            <MapPin size={16} />
            <span>{event.barName}</span>
            <span>•</span>
            <span>{event.barLocation}</span>
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-[#D0D8E0]">
            <Calendar size={16} />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#D0D8E0]">
            <Clock size={16} />
            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
          </div>
        </div>

        {/* Attendance Stats */}
        <div className="p-4 bg-white/5 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{event.goingCount}</div>
              <div className="text-xs text-[#D0D8E0]">Going</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">{event.interestedCount}</div>
              <div className="text-xs text-[#D0D8E0]">Interested</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {event.price === 0 ? 'FREE' : `$${event.price}`}
              </div>
              <div className="text-xs text-[#D0D8E0]">Entry</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* The Interested and Going buttons are now in the header */}
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-bold text-white mb-2">About this event</h3>
          <p className="text-sm text-[#D0D8E0] leading-relaxed">{event.description}</p>
        </div>

        {/* Additional Info */}
        <div className="space-y-3">
          {event.dj && (
            <div className="flex items-center gap-2 text-sm text-[#D0D8E0]">
              <Star size={16} />
              <span>DJ: {event.dj}</span>
            </div>
          )}
          {event.genre && (
            <div className="flex items-center gap-2 text-sm text-[#D0D8E0]">
              <TrendingUp size={16} />
              <span>Genre: {event.genre}</span>
            </div>
          )}
          {event.ageRestriction && (
            <div className="flex items-center gap-2 text-sm text-[#D0D8E0]">
              <UsersIcon size={16} />
              <span>Age: {event.ageRestriction}</span>
            </div>
          )}
        </div>

        {/* Social Media */}
        {event.socialMedia && (
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Follow</h3>
            <div className="flex items-center gap-3">
              {event.socialMedia.instagram && (
                <a 
                  href={`https://instagram.com/${event.socialMedia.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-300"
                >
                  <span className="text-sm text-white">@{event.socialMedia.instagram}</span>
                  <ExternalLink size={14} />
                </a>
              )}
              {event.socialMedia.facebook && (
                <a 
                  href={`https://facebook.com/${event.socialMedia.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-300"
                >
                  <span className="text-sm text-white">{event.socialMedia.facebook}</span>
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Ticket Information - Only for paid events */}
        {event.price > 0 && (
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Ticket Information</h3>
            <div className="p-4 bg-white/5 rounded-xl">
              {event.isTicketed && event.ticketUrl ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#D0D8E0]">Ticket Price:</span>
                    <span className="text-lg font-bold text-white">${event.price}</span>
                  </div>
                  <a 
                    href={event.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#5BC0CE] text-black font-medium rounded-lg hover:bg-[#6FFFE9] transition-colors duration-300"
                  >
                    <span>Get Tickets</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#D0D8E0]">Entrance Fee:</span>
                    <span className="text-lg font-bold text-white">${event.price}</span>
                  </div>
                  <div className="text-sm text-[#D0D8E0]">
                    Pay at the entrance
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-t border-white/10 pt-4">
          {/* Tab Content */}
          <div className="min-h-[200px]">
            {activeTab === 'details' && (
              <div className="space-y-4">
                {/* Views and Shares Stats */}
                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="text-sm font-bold text-white mb-3 text-center">Event Performance</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{event.views.toLocaleString()}</div>
                      <div className="text-xs text-[#D0D8E0]">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{event.shares}</div>
                      <div className="text-xs text-[#D0D8E0]">Shares</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};