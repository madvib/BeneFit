export type TemplateDuration =
  | { type: 'fixed'; weeks: number }
  | { type: 'variable'; min: number; max: number };

export type TemplateFrequency =
  | { type: 'fixed'; workoutsPerWeek: number }
  | { type: 'flexible'; min: number; max: number };

export interface WorkoutActivityTemplate {
  activityType: 'warmup' | 'main' | 'cooldown';
  template: string; // Template string with {{variables}}
  variables: Record<string, unknown>; // Default variable values
}

export interface WorkoutDayTemplate {
  dayOfWeek?: number; // 0-6, undefined = flexible
  type: 'strength' | 'cardio' | 'mobility' | 'sport' | 'rest';
  durationMinutes: number | string; // number or formula: "{{baseMinutes}} + ({{weekNumber}} * 5)"
  activities: WorkoutActivityTemplate[];
}

export interface WeekTemplate {
  weekNumber: number | '*'; // * = applies to all weeks not explicitly defined
  workouts: WorkoutDayTemplate[];
}

interface TemplateStructureData {
  duration: TemplateDuration;
  frequency: TemplateFrequency;
  weeks: WeekTemplate[];
  deloadWeeks?: number[]; // Which week numbers are deload weeks
  progressionFormula?: string; // e.g., "{{volume}} * 1.1" per week
}

export type TemplateStructure = Readonly<TemplateStructureData>;

// View Interface
export interface TemplateStructureView {
  duration: TemplateDuration;
  frequency: TemplateFrequency;
  weeks: WeekTemplate[];
  deloadWeeks?: number[];
  progressionFormula?: string;
}