export type InjurySeverity = 'minor' | 'moderate' | 'serious';
export type PreferredTime = 'morning' | 'afternoon' | 'evening';
export type TrainingLocation = 'home' | 'gym' | 'outdoor' | 'mixed';

export interface Injury {
  readonly bodyPart: string;
  readonly severity: InjurySeverity;
  readonly avoidExercises: readonly string[];
  readonly notes?: string;
  readonly reportedDate: string; // ISO date
}

export interface TrainingConstraints {
  readonly injuries?: readonly Injury[];
  readonly availableDays: readonly string[]; // ['Monday', 'Wednesday', 'Friday']
  readonly preferredTime?: PreferredTime;
  readonly maxDuration?: number; // minutes per workout
  readonly availableEquipment: readonly string[];
  readonly location: TrainingLocation;
}
