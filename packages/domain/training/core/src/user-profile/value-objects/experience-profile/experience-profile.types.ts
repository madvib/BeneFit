export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface TrainingHistory {
  yearsTraining?: number;
  previousPrograms: string[]; // "Starting Strength", "Couch to 5K", etc.
  sports: string[]; // Sports background
  certifications: string[]; // Any fitness certs
}

export interface CurrentCapabilities {
  canDoFullPushup: boolean;
  canDoFullPullup: boolean;
  canRunMile: boolean;
  canSquatBelowParallel: boolean;
  estimatedMaxes?: {
    squat?: number;
    bench?: number;
    deadlift?: number;
    unit: 'kg' | 'lbs';
  };
}

export interface ExperienceProfile {
  level: ExperienceLevel;
  history: TrainingHistory;
  capabilities: CurrentCapabilities;
  lastAssessmentDate: Date;
}

export interface ExperienceProfileValidation {
  isValid: boolean;
  errors: string[];
}
