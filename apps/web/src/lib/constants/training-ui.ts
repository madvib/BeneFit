import { Target, Zap, TrendingUp, Heart, LucideIcon, Dumbbell, Timer, Flame } from 'lucide-react';
import { FitnessGoal } from '@bene/shared';

export const GOAL_UI_CONFIG: Record<FitnessGoal, { label: string; icon: LucideIcon }> = {
  strength: { label: 'Build Strength', icon: Dumbbell },
  endurance: { label: 'Improve Endurance', icon: Timer },
  muscle_growth: { label: 'Muscle Growth', icon: TrendingUp },
  weight_loss: { label: 'Weight Loss', icon: Flame },
  athletic_performance: { label: 'Athletic Performance', icon: Zap },
  general_health: { label: 'General Health', icon: Heart },
};

// Fallback for any missing keys if enum expands
export const getGoalConfig = (goal: string) => {

  return GOAL_UI_CONFIG[goal as FitnessGoal] || { label: goal, icon: Target };
};

export const SECONDARY_GOAL_LABELS: Record<string, string> = {
  consistency: 'Build Consistency',
  flexibility: 'Improve Flexibility',
  mobility: 'Enhance Mobility',
  recovery: 'Better Recovery',
  injury_prevention: 'Prevent Injuries',
  increase_power: 'Increase Power',
  improve_speed: 'Improve Speed',
  build_stamina: 'Build Stamina',
  enhance_mobility: 'Enhance Mobility',
  improve_flexibility: 'Improve Flexibility',
  better_balance: 'Better Balance',
  increase_explosiveness: 'Explosiveness',
  tone_muscles: 'Tone Muscles',
  gain_weight: 'Gain Weight',
  body_recomposition: 'Body Recomp',
  rehabilitation: 'Rehab',
  improve_posture: 'Posture',
  reduce_stress: 'Reduce Stress',
  better_sleep: 'Better Sleep',
  increase_energy: 'Energy Boost',
  boost_confidence: 'Confidence',
  build_consistency: 'Consistency',
  improve_recovery: 'Recovery',
  sport_specific_training: 'Sport Specific',
  functional_fitness: 'Functional Fit',
};
