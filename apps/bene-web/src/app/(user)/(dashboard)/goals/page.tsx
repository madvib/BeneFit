// Server Component - fetches data on the server
import { fetchGoals, fetchRecommendations } from '@/data/services/nextDataService';
import type { Goal, Recommendation } from '@/data/types/dataTypes';
import GoalsClient from '@/components/goals/GoalsClient';

// This page can be mostly server-rendered since it doesn't require much client interaction
export default async function GoalsPage() {
  // Fetch data on the server
  const [goals, recommendations] = await Promise.all([
    fetchGoals(),
    fetchRecommendations()
  ]);

  return <GoalsClient initialGoals={goals} recommendations={recommendations} />;
}