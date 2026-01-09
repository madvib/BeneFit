export const mockEvents = [
  {
    id: 'evt-1',
    title: 'City Marathon 2025',
    date: 'Oct 15, 2025',
    location: 'Central Park, NY',
    participants: 1240,
    image: '🏃',
    category: 'Running',
  },
  {
    id: 'evt-2',
    title: 'Yoga in the Park',
    date: 'Tomorrow, 8:00 AM', // In a real app this would be computed from ISO
    location: 'Hyde Park',
    participants: 45,
    image: '🧘',
    category: 'Yoga',
  },
  {
    id: 'evt-3',
    title: 'CrossFit Championship',
    date: 'Nov 01, 2025',
    location: 'Metro Gym',
    participants: 300,
    image: '🏋️',
    category: 'Competition',
  },
];

export const mockTeams = [
  {
    id: 'team-1',
    name: 'Early Birds',
    members: 120,
    activityType: 'General Fitness',
    image: '🏃',
  },
  {
    id: 'team-2',
    name: 'Iron Lifters',
    members: 85,
    activityType: 'Strength',
    image: '💪',
  },
  {
    id: 'team-3',
    name: 'Zen Masters',
    members: 230,
    activityType: 'Meditation',
    image: '🧘',
  },
  {
    id: 'team-4',
    name: 'Trail Blazers',
    members: 156,
    activityType: 'Hiking',
    image: '🥾',
  },
];

export const mockRecommendations = [
  {
    id: 'rec-1',
    type: 'workout',
    title: 'Recovery Yoga',
    reason: 'High specialized load yesterday',
  },
  {
    id: 'rec-2',
    type: 'nutrition',
    title: 'Increase Protein',
    reason: 'Hypertrophy phase',
  },
];
