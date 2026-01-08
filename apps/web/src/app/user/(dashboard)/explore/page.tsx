import ExploreView from './explore-view';

const EVENTS = [
  {
    id: '1',
    title: 'City Marathon 2025',
    date: 'Oct 15, 2025',
    location: 'Central Park, NY',
    attendees: 1240,
    image: '🏃',
    category: 'Running',
  },
  {
    id: '2',
    title: 'Yoga in the Park',
    date: 'Tomorrow, 8:00 AM',
    location: 'Hyde Park',
    attendees: 45,
    image: '🧘',
    category: 'Yoga',
  },
  {
    id: '3',
    title: 'CrossFit Championship',
    date: 'Nov 01, 2025',
    location: 'Metro Gym',
    attendees: 300,
    image: '🏋️',
    category: 'Competition',
  },
];

const FEATURED_TEAMS = [
  { id: '1', name: 'Early Birds', members: 120, category: 'General Fitness' },
  { id: '2', name: 'Iron Lifters', members: 85, category: 'Strength' },
  { id: '3', name: 'Zen Masters', members: 230, category: 'Meditation' },
  { id: '4', name: 'Trail Blazers', members: 156, category: 'Hiking' },
];

export default async function ExplorePage() {
  return <ExploreView events={EVENTS} featuredTeams={FEATURED_TEAMS} />;
}
