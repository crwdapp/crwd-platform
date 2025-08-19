import { create } from 'zustand';

export interface EventType {
  id: number;
  name: string;
  date: string;
  price: number;
  attendees: number;
  capacity: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  barId: number;
}

export interface ReviewType {
  id: number;
  barId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface AppState {
  events: {
    items: EventType[];
  };
  reviews: {
    items: ReviewType[];
  };
}

export const useAppStore = create<AppState>((set) => ({
  events: {
    items: [
      {
        id: 1,
        name: 'Electronic Music Night',
        date: '2024-01-15',
        price: 15,
        attendees: 120,
        capacity: 150,
        status: 'upcoming',
        barId: 1
      },
      {
        id: 2,
        name: 'House Party Weekend',
        date: '2024-01-20',
        price: 20,
        attendees: 200,
        capacity: 250,
        status: 'upcoming',
        barId: 1
      }
    ]
  },
  reviews: {
    items: [
      {
        id: 1,
        barId: 1,
        userName: 'Alex M.',
        rating: 5,
        comment: 'Amazing atmosphere and great drinks!',
        date: '2024-01-10'
      },
      {
        id: 2,
        barId: 1,
        userName: 'Sarah K.',
        rating: 4,
        comment: 'Love the electronic music events',
        date: '2024-01-08'
      },
      {
        id: 3,
        barId: 1,
        userName: 'Mike R.',
        rating: 5,
        comment: 'Best club in the city!',
        date: '2024-01-05'
      }
    ]
  }
}));