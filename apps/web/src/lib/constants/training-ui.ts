import {
  Zap,
  TrendingUp,
  Heart,
  LucideIcon,
  Dumbbell,
  Timer,
  Flame,
  CheckCircle2,
  Medal,
  Salad,
  Activity,
  Footprints,
  Flower,
  Bike,
} from 'lucide-react';

import { type PrimaryFitnessGoal as FitnessGoal, type SecondaryFitnessGoal } from '@bene/react-api-client';
import { SECONDARY_GOAL_CATEGORIES } from '@bene/shared';

export const GOAL_UI_CONFIG: Record<FitnessGoal, { label: string; icon: LucideIcon }> = {
  strength: { label: 'Build Strength', icon: Dumbbell },
  hypertrophy: { label: 'Muscle Growth', icon: TrendingUp },
  endurance: { label: 'Improve Endurance', icon: Timer },
  weight_loss: { label: 'Weight Loss', icon: Flame },
  weight_gain: { label: 'Weight Gain', icon: Dumbbell },
  sport_specific: { label: 'Athletic Performance', icon: Zap },
  general_fitness: { label: 'General Health', icon: Heart },
  mobility: { label: 'Mobility', icon: Activity },
  rehabilitation: { label: 'Rehabilitation', icon: Activity },
};



export const SECONDARY_GOAL_LABELS: Record<SecondaryFitnessGoal, string> = {
  increase_power: 'Increase Power',
  improve_speed: 'Improve Speed',
  build_stamina: 'Build Stamina',
  enhance_mobility: 'Enhance Mobility',
  improve_flexibility: 'Improve Flexibility',
  better_balance: 'Better Balance',
  increase_explosiveness: 'Explosiveness',
  tone_muscles: 'Tone Muscles',
  gain_weight: 'Gain Weight',
  body_recomposition: 'Body Recomposition',
  injury_prevention: 'Injury Prevention',
  rehabilitation: 'Rehabilitation',
  improve_posture: 'Improve Posture',
  reduce_stress: 'Reduce Stress',
  better_sleep: 'Better Sleep',
  increase_energy: 'Increase Energy',
  boost_confidence: 'Boost Confidence',
  build_consistency: 'Build Consistency',
  improve_recovery: 'Improve Recovery',
  sport_specific_training: 'Sport Specific',
  functional_fitness: 'Functional Fitness',
};

export const CATEGORIZED_SECONDARY_GOALS: { category: string; goals: readonly SecondaryFitnessGoal[] }[] = Object.entries(
  SECONDARY_GOAL_CATEGORIES
).map(([category, goals]) => ({
  category,
  goals: goals as unknown as readonly SecondaryFitnessGoal[],
}));

// Activity Type Configuration
export const ACTIVITY_TYPE_CONFIG: Record<
  string,
  { icon: LucideIcon; colorClass: string; iconClass: string; size?: number; label?: string }
> = {
  workout: {
    icon: Dumbbell,
    colorClass: 'bg-blue-500/10 border-blue-500/20',
    iconClass: 'text-blue-500',
    size: 18,
  },
  progress: {
    icon: CheckCircle2,
    colorClass: 'bg-emerald-500/10 border-emerald-500/20',
    iconClass: 'text-emerald-500',
    size: 18,
  },
  goal: {
    icon: Flame,
    colorClass: 'bg-orange-500/10 border-orange-500/20',
    iconClass: 'text-orange-500',
    size: 18,
  },
  achievement: {
    icon: Medal,
    colorClass: 'bg-purple-500/10 border-purple-500/20',
    iconClass: 'text-purple-600',
    size: 18,
  },
  nutrition: {
    icon: Salad,
    colorClass: 'bg-yellow500/10 border-yellow500/20',
    iconClass: 'text-yellow-600',
    size: 18,
  },
  warmup: {
    icon: TrendingUp,
    colorClass: 'bg-emerald-500/10 border-emerald-500/20',
    iconClass: 'text-emerald-500',
    size: 16,
  },
  main: {
    icon: Dumbbell,
    colorClass: 'bg-primary/10 border-primary/20',
    iconClass: 'text-primary',
    size: 16,
  },
  cooldown: {
    icon: Zap,
    colorClass: 'bg-orange-500/10 border-orange-500/20',
    iconClass: 'text-orange-500',
    size: 16,
  },
  cardio: {
    label: 'Cardio',
    icon: Heart,
    colorClass: 'bg-red-500/10 border-red-500/20',
    iconClass: 'text-red-500',
    size: 18,
  },
  hiit: {
    label: 'HIIT',
    icon: Timer,
    colorClass: 'bg-orange-600/10 border-orange-600/20',
    iconClass: 'text-orange-600',
    size: 18,
  },
  yoga: {
    label: 'Yoga',
    icon: Flower,
    colorClass: 'bg-rose-400/10 border-rose-400/20',
    iconClass: 'text-rose-400',
    size: 18,
  },
  running: {
    label: 'Running',
    icon: Footprints,
    colorClass: 'bg-green-600/10 border-green-600/20',
    iconClass: 'text-green-600',
    size: 18,
  },
  cycling: {
    label: 'Cycling',
    icon: Bike,
    colorClass: 'bg-blue-400/10 border-blue-400/20',
    iconClass: 'text-blue-400',
    size: 18,
  },
  strength: {
    label: 'Strength',
    icon: Dumbbell,
    colorClass: 'bg-blue-600/10 border-blue-600/20',
    iconClass: 'text-blue-600',
    size: 18,
  },
  flexibility: {
    label: 'Flexibility',
    icon: Flower,
    colorClass: 'bg-indigo-400/10 border-indigo-400/20',
    iconClass: 'text-indigo-400',
    size: 18,
  },
  hybrid: {
    label: 'Hybrid',
    icon: Activity,
    colorClass: 'bg-purple-500/10 border-purple-500/20',
    iconClass: 'text-purple-500',
    size: 18,
  },
  rest: {
    label: 'Rest',
    icon: Salad, // Using Salad as a placeholder for rest/recovery
    colorClass: 'bg-slate-400/10 border-slate-400/20',
    iconClass: 'text-slate-400',
    size: 18,
  },
  custom: {
    label: 'Custom',
    icon: Activity,
    colorClass: 'bg-gray-500/10 border-gray-500/20',
    iconClass: 'text-gray-500',
    size: 18,
  },
  default: {
    icon: Activity,
    colorClass: 'bg-primary/10 border-primary/20',
    iconClass: 'text-primary',
    size: 18,
  },
};

export const getActivityTypeConfig = (type: string) => {
  return ACTIVITY_TYPE_CONFIG[type] ?? ACTIVITY_TYPE_CONFIG.default!;
};

export const ACTIVITY_STATUS_CONFIG: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'outline' | 'success' | 'info' | 'error' | 'warning' }
> = {
  completed: { label: 'Completed', variant: 'success' },
  finished: { label: 'Finished', variant: 'success' },
  in_progress: { label: 'In Progress', variant: 'info' },
  active: { label: 'Active', variant: 'info' },
  live: { label: 'Live', variant: 'info' },
  skipped: { label: 'Skipped', variant: 'error' },
  abandoned: { label: 'Abandoned', variant: 'error' },
  cancelled: { label: 'Cancelled', variant: 'error' },
  scheduled: { label: 'Scheduled', variant: 'secondary' },
  pending: { label: 'Pending', variant: 'secondary' },
  draft: { label: 'Draft', variant: 'outline' },
};

export const getActivityStatusConfig = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  return (
    ACTIVITY_STATUS_CONFIG[normalizedStatus] || {
      label: status.replaceAll('_', ' '),
      variant: 'secondary',
    }
  );
};

export const PROFILE_STATS_CONFIG: Record<
  string,
  { label: string; icon: LucideIcon; colorClass: string; iconClass: string }
> = {
  workouts: {
    label: 'Workouts',
    icon: Dumbbell,
    colorClass: '',
    iconClass: 'text-blue-500',
  },
  streak: {
    label: 'Streak',
    icon: Flame,
    colorClass: '',
    iconClass: 'text-orange-500',
  },
  trophies: {
    label: 'Trophies',
    icon: Medal,
    colorClass: '',
    iconClass: 'text-yellow-500',
  },
};
