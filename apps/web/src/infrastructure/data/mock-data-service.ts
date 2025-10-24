// Data service functions to access mock data from JSON files
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
} from "./types/data-types";

// Activity Feed Data
export async function getActivityFeed(): Promise<ActivityItem[]> {
  // In a real app, this would be an API call
  // For now, we'll simulate a network request with a delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/activityFeed.json");
  return data.default as ActivityItem[];
}

// Workout History Data
export async function getWorkoutHistory(): Promise<Workout[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/workoutHistory.json");
  return data.default;
}

// Service Connections Data
export async function getServices(): Promise<ServiceConnection[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/services.json");
  return data.default;
}

// Plan Data
export async function getPlanData(): Promise<{
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

// Goals Data
export async function getGoals(): Promise<Goal[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/goals.json");
  return data.default as Goal[];
}

// Chat Data
export async function getSavedChats(): Promise<Chat[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/savedChats.json");
  return data.default;
}

// Message Data
export async function getInitialMessages(): Promise<Message[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/messages.json");
  return data.default as Message[];
}

// Recommendation Data
export async function getRecommendations(): Promise<Recommendation[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/recommendations.json");
  return data.default;
}

// Blog Posts Data
export async function getBlogPosts(): Promise<BlogPost[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/blogPosts.json");
  return data.default;
}

// Chart Data
export async function getChartData(): Promise<ChartData[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/chartData.json");
  return data.default;
}

// Current Goal Data
export async function getCurrentGoal(): Promise<Goal> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/currentGoal.json");
  return data.default as Goal;
}

// Blog Categories
export async function getBlogCategories(): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await import("./mock/blogCategories.json");
  return data.default;
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
