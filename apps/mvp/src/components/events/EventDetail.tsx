import React from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Bookmark, 
  Heart, 
  Share2,
  ExternalLink,
  Phone,
  Globe
} from 'lucide-react';
import { Event } from '../../types/event';
import { useAppStore } from '../../store';

interface EventDetailProps {
  event: Event;
  onBack?: () => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({ event, onBack }) => {
  const { bookmarkEvent, unbookmarkEvent, setEventAttendance, events, user } = useAppStore();
  
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

  const handleAttendance = (status: 'going' | 'interested' | 'not_going') => {
    setEventAttendance(event.id, status);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: event.name,
        text: `Check out this event: ${event.name} at ${event.barName}`,
        url: window.location.href
      });
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

  const attendancePercentage = (event.attendees / event.capacity) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/95 to-black">
      {/* Header */}
      <div className="relative">
        <img 
          src={event.image} 
          alt={event.name}
          className="w-full h-80 object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-3 bg-black/50 backdrop-blur-xl rounded-full text-white hover:bg-black/70 transition-all duration-300"
        >
          <ArrowLeft size={20} />
        </button>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleShare}
            className="p-3 bg-black/50 backdrop-blur-xl rounded-full text-white hover:bg-black/70 transition-all duration-300"
          >
            <Share2 size={20} />
          </button>
          <button
            onClick={handleBookmark}
            className={`p-3 backdrop-blur-xl rounded-full transition-all duration-300 ${
              isBookmarked 
                ? 'bg-[#6FFFE9]/20 text-[#6FFFE9]' 
                : 'bg-black/50 text-white hover:bg-black/70'
            }`}
          >
            <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-[#6FFFE9] text-black text-xs font-medium rounded-full">
              {event.category.toUpperCase()}
            </span>
            <span className={`px-3 py-1 text-white text-xs font-medium rounded-full ${
              event.status === 'ongoing' ? 'bg-green-500' :
              event.status === 'upcoming' ? 'bg-blue-500' :
              event.status === 'sold_out' ? 'bg-red-500' : 'bg-gray-500'
            }`}>
              {event.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{event.name}</h1>
          <p className="text-white/80 text-lg">{event.barName}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Event Info Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 text-[#6FFFE9] mb-2">
              <Calendar size={16} />
              <span className="text-sm font-medium">Date</span>
            </div>
            <p className="text-white font-medium">{formatDate(event.date)}</p>
          </div>
          
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 text-[#6FFFE9] mb-2">
              <Clock size={16} />
              <span className="text-sm font-medium">Time</span>
            </div>
            <p className="text-white font-medium">
              {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </p>
          </div>
          
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 text-[#6FFFE9] mb-2">
              <MapPin size={16} />
              <span className="text-sm font-medium">Location</span>
            </div>
            <p className="text-white font-medium">{event.barLocation}</p>
          </div>
          
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 text-[#6FFFE9] mb-2">
              <Users size={16} />
              <span className="text-sm font-medium">Attendance</span>
            </div>
            <p className="text-white font-medium">{event.attendees}/{event.capacity}</p>
            <div className="w-full bg-white/10 rounded-full h-2 mt-2">
              <div 
                className="bg-[#6FFFE9] h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">About This Event</h3>
          <p className="text-white/80 leading-relaxed">{event.description}</p>
          
          {event.dj && (
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <p className="text-[#6FFFE9] font-medium">Featured DJ: {event.dj}</p>
              {event.genre && (
                <p className="text-white/60 text-sm">Genre: {event.genre}</p>
              )}
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Event Details</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/60">Price</span>
              <span className="text-white font-medium">
                {event.price === 0 ? 'FREE' : `$${event.price}`}
              </span>
            </div>
            
            {event.ageRestriction && (
              <div className="flex justify-between">
                <span className="text-white/60">Age Restriction</span>
                <span className="text-white font-medium">{event.ageRestriction}</span>
              </div>
            )}
            
            {event.dressCode && (
              <div className="flex justify-between">
                <span className="text-white/60">Dress Code</span>
                <span className="text-white font-medium">{event.dressCode}</span>
              </div>
            )}
            
            {event.isTicketed && event.ticketUrl && (
              <button 
                onClick={() => window.open(event.ticketUrl, '_blank')}
                className="w-full flex items-center justify-center gap-2 bg-[#6FFFE9] text-black font-medium py-3 rounded-lg hover:bg-[#5BC0CE] transition-all duration-300"
              >
                <ExternalLink size={16} />
                Buy Tickets
              </button>
            )}
          </div>
        </div>

        {/* Tags */}
        {event.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {event.tags.map(tag => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Attendance Actions */}
        <div className="sticky bottom-6 bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleAttendance('interested')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all duration-300 ${
                userAttendance?.status === 'interested'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <Heart size={16} fill={userAttendance?.status === 'interested' ? 'currentColor' : 'none'} />
              Interested
            </button>
            
            <button
              onClick={() => handleAttendance('going')}
              className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${
                userAttendance?.status === 'going'
                  ? 'bg-[#6FFFE9] text-black'
                  : 'bg-[#6FFFE9]/20 text-[#6FFFE9] hover:bg-[#6FFFE9]/30'
              }`}
            >
              {userAttendance?.status === 'going' ? 'Going!' : 'Mark as Going'}
            </button>
          </div>
          
          {userAttendance?.status === 'going' && (
            <button
              onClick={() => handleAttendance('not_going')}
              className="w-full mt-2 py-2 text-white/60 text-sm hover:text-white/80 transition-all duration-300"
            >
              Change my mind
            </button>
          )}
        </div>
      </div>
    </div>
  );
};