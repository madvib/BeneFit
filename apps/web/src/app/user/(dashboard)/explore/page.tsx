'use client';

import ExploreView from './explore-view';
import { useExplore } from '@bene/react-api-client';

export default function ExplorePage() {
  const { data } = useExplore();
  // Handle loading/undefined if needed, or rely on initialData/suspense
  if (!data) return null; 
  return <ExploreView events={data.events} featuredTeams={data.featuredTeams} />;
}
