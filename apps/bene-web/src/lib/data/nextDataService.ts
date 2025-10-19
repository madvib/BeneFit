// Next.js App Router data fetching service
// Uses Server Components where possible, Client Components only when needed

import {
  ActivityItem,
  Workout,
  ServiceConnection,
  Plan,
  WorkoutPlan,
  Goal,
  Chat,
  Message,
  Recommendation,
  BlogPost,
  ChartData,
  FilterOption,
  PlanSuggestion,
} from "./types/dataTypes";

// Server-side data fetching functions (for Server Components)
// These can be called directly in Server Components

export async function fetchActivityFeed() {
  // In Next.js, we'd typically fetch from an API endpoint
  // For mock data, we'll import the JSON
  const data = await import("./mock/activityFeed.json");
  return data.default as ActivityItem[];
}

export async function fetchWorkoutHistory() {
  const data = await import("./mock/workoutHistory.json");
  return data.default as Workout[];
}

export async function fetchServices() {
  const data = await import("./mock/services.json");
  return data.default as ServiceConnection[];
}

export async function fetchPlanData() {
  const data = await import("./mock/planData.json");
  return data.default as {
    currentPlan: Plan;
    weeklyWorkouts: WorkoutPlan[];
    planSuggestions: PlanSuggestion[];
  };
}

export async function fetchGoals() {
  const data = await import("./mock/goals.json");
  return data.default as Goal[];
}

export async function fetchSavedChats() {
  const data = await import("./mock/savedChats.json");
  return data.default as Chat[];
}

export async function fetchInitialMessages() {
  const data = await import("./mock/messages.json");
  return data.default as Message[];
}

export async function fetchRecommendations() {
  const data = await import("./mock/recommendations.json");
  return data.default as Recommendation[];
}

export async function fetchBlogPosts() {
  const data = await import("./mock/blogPosts.json");
  return data.default as BlogPost[];
}

export async function fetchChartData() {
  const data = await import("./mock/chartData.json");
  return data.default as ChartData[];
}

export async function fetchCurrentGoal() {
  const data = await import("./mock/currentGoal.json");
  return data.default as Goal;
}

export async function fetchBlogCategories() {
  const data = await import("./mock/blogCategories.json");
  return data.default as string[];
}

// Client-side data fetching functions (for Client Components that need to re-fetch)
// These are for components that need to update data after initial load

export async function getClientActivityFeed(): Promise<ActivityItem[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/activityFeed.json");
  return data.default as ActivityItem[];
}

export async function getClientWorkoutHistory(): Promise<Workout[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/workoutHistory.json");
  return data.default as Workout[];
}

export async function getClientServices(): Promise<ServiceConnection[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/services.json");
  return data.default as ServiceConnection[];
}

export async function getClientPlanData(): Promise<{
  currentPlan: Plan;
  weeklyWorkouts: WorkoutPlan[];
  planSuggestions: PlanSuggestion[];
}> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/planData.json");
  return data.default as {
    currentPlan: Plan;
    weeklyWorkouts: WorkoutPlan[];
    planSuggestions: PlanSuggestion[];
  };
}

export async function getClientGoals(): Promise<Goal[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/goals.json");
  return data.default as Goal[];
}

export async function getClientSavedChats(): Promise<Chat[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/savedChats.json");
  return data.default as Chat[];
}

export async function getClientInitialMessages(): Promise<Message[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/messages.json");
  return data.default as Message[];
}

export async function getClientRecommendations(): Promise<Recommendation[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/recommendations.json");
  return data.default as Recommendation[];
}

export async function getClientBlogPosts(): Promise<BlogPost[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/blogPosts.json");
  return data.default as BlogPost[];
}

export async function getClientChartData(): Promise<ChartData[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/chartData.json");
  return data.default as ChartData[];
}

export async function getClientCurrentGoal(): Promise<Goal> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/currentGoal.json");
  return data.default as Goal;
}

export async function getClientBlogCategories(): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/blogCategories.json");
  return data.default as string[];
}

// Filter options for history page
export const getFilterOptions = (): FilterOption[] => {
  return [
    { value: "all", label: "All Time" },
    { value: "week", label: "Last 7 Days" },
    { value: "month", label: "Last 30 Days" },
    { value: "quarter", label: "Last 90 Days" },
  ];
};
