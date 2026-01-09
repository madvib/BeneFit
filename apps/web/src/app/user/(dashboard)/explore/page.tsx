import ExploreView from './explore-view';

import { mockEvents, mockTeams } from '@/lib/testing/fixtures/explore';

export default async function ExplorePage() {
  return <ExploreView events={mockEvents} featuredTeams={mockTeams} />;
}
