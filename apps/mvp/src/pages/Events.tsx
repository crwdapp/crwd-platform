import React, { useState, useEffect } from 'react';
import { EventsDiscovery } from '../components/events/EventsDiscovery';
import { EventDetailEnhanced } from '../components/events/EventDetailEnhanced';
import { Event, EventCategory, EventStatus } from '../types/event';
import { useAppStore } from '../store';

export const Events: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { events, setEvents, setEventsLoading, setSelectedEvent: setSelectedEventId, user } = useAppStore();

  useEffect(() => {
    // Load mock events data
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setEventsLoading(true);
    
    // Simulate API call with mock data
    setTimeout(() => {
      const mockEvents: Event[] = [
        {
          id: 1,
          name: 'Electronic Nights: Underground Vibes',
          description: 'Experience the best electronic music in the city with top local and international DJs. A night of pulsating beats, incredible visuals, and an unforgettable atmosphere. Join us for an immersive journey through the underground electronic scene featuring state-of-the-art sound systems, mesmerizing light shows, and the most talented artists in the industry.',
          date: '2025-08-03',
          startTime: '22:00',
          endTime: '04:00',
          barId: 1,
          barName: 'CTRL Club',
          barLocation: 'Bucharest Old Town',
          barLat: 44.4268,
          barLng: 26.1025,
          dj: 'Alex Chen',
          genre: 'Techno, House',
          price: 25,
          image: '/src/assets/image.png',
          images: ['/src/assets/image.png', '/src/assets/image.png', '/src/assets/image.png'],
          category: EventCategory.MUSIC,
          tags: ['electronic', 'techno', 'nightlife', 'dance'],
          capacity: 300,
          attendees: 187,
          interestedCount: 89,
          goingCount: 187,
          isTicketed: true,
          ticketUrl: 'https://example.com/tickets',
          status: EventStatus.UPCOMING,
          ageRestriction: '21+',
          dressCode: 'Smart Casual',
          socialMedia: {
            instagram: '@ctrlclub',
            facebook: 'CTRL Club Bucharest'
          },
          isPublic: true,
          canGuestsInviteFriends: true,
          hostMessage: 'Get ready for the most epic electronic night of the year! We\'ve prepared something special for all you music lovers. See you on the dancefloor! 🎵🔥',
          discussionEnabled: true,
          photosEnabled: true,
          views: 2547,
          shares: 89,
          createdBy: 'CTRL Club',
          coHosts: ['Alex Chen', 'Sarah DJ'],
          createdAt: '2025-07-20T10:00:00Z',
          updatedAt: '2025-07-25T15:30:00Z'
        },
        {
          id: 2,
          name: 'Rooftop Summer Session',
          description: 'Join us for an exclusive rooftop party with stunning city views, craft cocktails, and chill summer vibes. Perfect for networking and meeting new people.',
          date: '2025-08-02',
          startTime: '18:00',
          endTime: '23:00',
          barId: 2,
          barName: 'SkyBar Bucharest',
          barLocation: 'Herastrau Area',
          barLat: 44.4675,
          barLng: 26.0979,
          dj: 'Sarah Williams',
          genre: 'Deep House, Nu-Disco',
          price: 0,
          image: '/src/assets/image.png',
          images: ['/src/assets/image.png', '/src/assets/image.png'],
          category: EventCategory.PARTY,
          tags: ['rooftop', 'summer', 'cocktails', 'sunset'],
          capacity: 150,
          attendees: 89,
          interestedCount: 156,
          goingCount: 89,
          isTicketed: false,
          status: EventStatus.UPCOMING,
          ageRestriction: '18+',
          socialMedia: {
            instagram: '@skybar_buc'
          },
          isPublic: true,
          canGuestsInviteFriends: true,
          discussionEnabled: true,
          photosEnabled: true,
          views: 1832,
          shares: 43,
          createdBy: 'SkyBar Bucharest',
          createdAt: '2025-07-18T14:00:00Z',
          updatedAt: '2025-07-22T09:15:00Z'
        },
        {
          id: 3,
          name: 'Happy Hour Trivia Night',
          description: 'Test your knowledge while enjoying discounted drinks! Teams of up to 4 people compete for prizes in our weekly trivia challenge.',
          date: '2025-08-02',
          startTime: '19:00',
          endTime: '22:00',
          barId: 3,
          barName: 'The Craft Corner',
          barLocation: 'Amzei Square',
          barLat: 44.4394,
          barLng: 26.0990,
          price: 0,
          image: '/src/assets/image.png',
          images: ['/src/assets/image.png'],
          category: EventCategory.TRIVIA,
          tags: ['trivia', 'happy-hour', 'prizes', 'teams'],
          capacity: 80,
          attendees: 45,
          interestedCount: 72,
          goingCount: 45,
          isTicketed: false,
          status: EventStatus.ONGOING,
          isPublic: true,
          canGuestsInviteFriends: true,
          hostMessage: 'Think you know it all? Come prove it at our weekly trivia night! Great prizes and even better drinks await. Bring your smartest friends!',
          discussionEnabled: true,
          photosEnabled: true,
          views: 1256,
          shares: 31,
          createdBy: 'The Craft Corner',
          coHosts: ['Quiz Master Mike'],
          createdAt: '2025-07-15T12:00:00Z',
          updatedAt: '2025-08-02T18:00:00Z'
        },
        {
          id: 4,
          name: 'Jazz & Wine Evening',
          description: 'An intimate evening featuring live jazz performances paired with our curated wine selection. Perfect for a sophisticated night out.',
          date: '2025-08-04',
          startTime: '20:00',
          endTime: '23:30',
          barId: 4,
          barName: 'Vintage Lounge',
          barLocation: 'Calea Victoriei',
          barLat: 44.4378,
          barLng: 26.0969,
          price: 35,
          image: '/src/assets/image.png',
          images: ['/src/assets/image.png'],
          category: EventCategory.LIVE_SHOW,
          tags: ['jazz', 'wine', 'live-music', 'intimate'],
          capacity: 60,
          attendees: 58,
          interestedCount: 134,
          goingCount: 58,
          isTicketed: true,
          ticketUrl: 'https://example.com/jazz-tickets',
          status: EventStatus.SOLD_OUT,
          ageRestriction: '21+',
          dressCode: 'Business Casual',
          isPublic: true,
          canGuestsInviteFriends: true,
          hostMessage: 'An unforgettable evening of smooth jazz and exquisite wines awaits. Join us for this sold-out intimate experience in our vintage setting.',
          discussionEnabled: true,
          photosEnabled: true,
          views: 2891,
          shares: 76,
          createdBy: 'Vintage Lounge',
          coHosts: ['Marcus Jazz Trio', 'Sommelier Elena'],
          createdAt: '2025-07-10T16:00:00Z',
          updatedAt: '2025-07-30T11:20:00Z'
        },
        {
          id: 5,
          name: 'Karaoke Championship',
          description: 'Show off your vocal skills in our monthly karaoke competition! Winner gets a $100 bar tab and bragging rights.',
          date: '2025-08-05',
          startTime: '21:00',
          endTime: '01:00',
          barId: 5,
          barName: 'Mic Drop Bar',
          barLocation: 'University Square',
          barLat: 44.4355,
          barLng: 26.1009,
          price: 10,
          image: '/src/assets/image.png',
          images: ['/src/assets/image.png'],
          category: EventCategory.KARAOKE,
          tags: ['karaoke', 'competition', 'prizes', 'fun'],
          capacity: 100,
          attendees: 23,
          interestedCount: 95,
          goingCount: 23,
          isTicketed: false,
          status: EventStatus.UPCOMING,
          ageRestriction: '18+',
          isPublic: true,
          canGuestsInviteFriends: true,
          discussionEnabled: true,
          photosEnabled: true,
          views: 1643,
          shares: 52,
          createdBy: 'Mic Drop Bar',
          createdAt: '2025-07-25T13:30:00Z',
          updatedAt: '2025-07-28T10:45:00Z'
        }
      ];

      setEvents(mockEvents);
    }, 1000);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setSelectedEventId(event.id);
  };

  const handleEventMarkerClick = (eventId: number) => {
    const event = events.items.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setSelectedEventId(eventId);
    }
  };

  const handleBackToList = () => {
    setSelectedEvent(null);
    setSelectedEventId(null);
  };

  if (selectedEvent) {
    return (
      <EventDetailEnhanced 
        event={selectedEvent} 
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="h-full bg-transparent overflow-auto pb-24">
      <EventsDiscovery 
        events={events.items}
        loading={events.loading}
        onEventClick={handleEventClick}
      />
    </div>
  );
};