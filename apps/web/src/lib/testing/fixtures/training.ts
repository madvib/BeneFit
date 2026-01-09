import type {
  FitnessGoals,
  TrainingConstraints,
  ExperienceProfile,
} from '@bene/shared';

export const mockFitnessGoals: FitnessGoals = {
  primary: 'strength',
  secondary: ['muscle_growth', 'athletic_performance'],
  motivation: 'Get stronger for everyday activities',
  successCriteria: ['Squat 150kg', 'Deadlift 200kg'],
  targetDate: '2026-06-01',
};

export const mockTrainingConstraints: TrainingConstraints = {
  availableDays: ['Monday', 'Wednesday', 'Friday'],
  preferredTime: 'morning',
  maxDuration: 60,
  location: 'gym',
  availableEquipment: ['barbell', 'dumbbells', 'squat_rack'],
  injuries: [],
};

export const mockExperienceProfile: ExperienceProfile = {
  level: 'intermediate',
  history: {
    yearsTraining: 2,
    previousPrograms: ['Starting Strength', '5/3/1'],
    sports: ['Soccer'],
    certifications: [],
  },
  capabilities: {
    canDoFullPushup: true,
    canDoFullPullup: true,
    canRunMile: true,
    canSquatBelowParallel: true,
  },
  lastAssessmentDate: new Date('2026-01-01').toISOString(),
};

// Mock session data for workout view
export const mockTrainingSession = {
  id: 'session-123',
  workoutId: 'workout-1',
  startedAt: '2026-01-08T09:00:00Z',
  exercises: [
    {
      id: 'ex-1',
      name: 'Barbell Squat',
      targetSets: 3,
      targetReps: [5, 5, 5],
      targetWeight: [100, 100, 100],
      completedSets: [],
    },
  ],
  status: 'in_progress',
};
