export interface Bar {
  id: number;
  name: string;
  description: string;
  image: string;
  events: Array<{
    id: number;
    name: string;
    date: string;
  }>;
}

export const allBars: Bar[] = [
  {
    id: 1,
    name: 'Control Club',
    description: 'Electronic Music Club',
    image: 'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg',
    events: [
      { id: 1, name: 'Electronic Music Night', date: '2024-01-15' },
      { id: 2, name: 'House Party Weekend', date: '2024-01-20' }
    ]
  }
];