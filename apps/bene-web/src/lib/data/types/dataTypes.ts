// Define all application data types in one place

// Activity Feed types
export interface ActivityItem {
  id: number;
  type: "workout" | "nutrition" | "goal" | "achievement" | "progress";
  title: string;
  description: string;
  timestamp: string; // ISO date string
  user: string;
  avatar: string;
  duration?: string;
  calories?: number;
  value?: number;
  goal?: number;
}

// Workout history types
export interface Workout {
  id: number;
  date: string;
  type: string;
  duration: string;
  distance?: string;
  sets?: number;
  laps?: number;
  calories: number;
}

// Service connections types
export interface ServiceConnection {
  id: number;
  name: string;
  description: string;
  connected: boolean;
  logo: string;
  lastSync?: string;
  dataType: string[];
}

// Plan types
export interface Plan {
  id: number;
  name: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  progress: number;
}

export interface PlanSuggestion {
  id: number;
  name: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  category: string;
}

export interface WorkoutPlan {
  id: number;
  day: string;
  date: string;
  exercise: string;
  sets: number;
  reps: number;
  duration?: string;
  completed: boolean;
}

// Goals types
export interface Goal {
  id: number;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: "active" | "completed" | "overdue";
}

// Chat and messaging types
export interface Chat {
  id: number;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export interface Message {
  id: number;
  content: string;
  sender: "user" | "coach";
  timestamp: string;
}

// Recommendation types
export interface Recommendation {
  id: number;
  title: string;
  description: string;
  category: string;
}

// Blog post types
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  category: string;
  image: string;
}

// Chart data types
export interface ChartData {
  date: string;
  value: number;
}

// Other types that might be needed elsewhere
export interface FilterOption {
  value: string;
  label: string;
}
