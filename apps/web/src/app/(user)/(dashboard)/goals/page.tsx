// Server Component - fetches data on the server
import {
  fetchGoals,
  fetchRecommendations,
} from "@/infrastructure/data/next-data-service";
import GoalsClient from "@/presentation/goals/goals-client";

// This page can be mostly server-rendered since it doesn't require much client interaction
export default async function GoalsPage() {
  // Fetch data on the server
  const [goals, recommendations] = await Promise.all([
    fetchGoals(),
    fetchRecommendations(),
  ]);

  return <GoalsClient initialGoals={goals} recommendations={recommendations} />;
}
