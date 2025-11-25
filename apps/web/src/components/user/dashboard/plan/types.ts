export interface PlanData {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  duration: string;
  category: string;
  progress: number;
  // New fields for PlanOverview
  weeklyProgress: number;
  totalWorkouts: number;
  currentWeek: number;
  totalWeeks: number;
  phase: string;
  stats: {
    streak: number;
    minutes: number;
    calories: number;
  };
}

export interface WeeklyWorkoutPlan {
  id: string;
  day: string;
  date: string;
  completed: boolean;
  exercise: string;
  sets: number;
  reps: number;
  duration?: string;
  // New fields for WeeklySchedule
  intensity?: string;
  status?: 'completed' | 'active' | 'upcoming';
}

export interface PlanSuggestion {
  id: string;
  name: string; // Component uses title, need to map or rename
  title?: string; // Optional for now to ease transition
  difficulty: string;
  duration: string;
  category: string;
  // New fields for PlanSuggestions
  image?: React.ReactNode;
  rating?: number;
  users?: string;
}
