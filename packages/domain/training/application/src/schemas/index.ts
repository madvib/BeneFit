import { z } from 'zod';
import { EQUIPMENT_OPTIONS, FITNESS_GOALS } from '@bene/shared';

// Fitness Goals Schemas
export const PrimaryFitnessGoalSchema = z.enum(FITNESS_GOALS as unknown as [string, ...string[]]);

export const TargetWeightSchema = z.object({
  current: z.number(),
  target: z.number(),
  unit: z.enum(['kg', 'lbs']),
});

export const FitnessGoalsSchema = z.object({
  primary: PrimaryFitnessGoalSchema,
  secondary: z.array(z.string()), // Additional goals
  // Specific targets
  targetWeight: TargetWeightSchema.optional(),
  targetBodyFat: z.number().optional(), // Percentage
  targetDate: z.string().optional(), // Date serialized as ISO string
  // Qualitative
  motivation: z.string(), // Why they're doing this
  successCriteria: z.array(z.string()), // How they'll know they succeeded
});

// Training Constraints Schemas
export const InjurySeveritySchema = z.enum(['minor', 'moderate', 'serious']);
export const PreferredTimeSchema = z.enum(['morning', 'afternoon', 'evening']);
export const TrainingLocationSchema = z.enum(['home', 'gym', 'outdoor', 'mixed']);

export const InjurySchema = z.object({
  bodyPart: z.string(),
  severity: InjurySeveritySchema,
  avoidExercises: z.array(z.string()),
  notes: z.string().optional(),
  reportedDate: z.string(), // ISO date
});

export const TrainingConstraintsSchema = z.object({
  injuries: z.array(InjurySchema).optional(),
  availableDays: z.array(z.string()), // ['Monday', 'Wednesday', 'Friday']
  preferredTime: PreferredTimeSchema.optional(),
  maxDuration: z.number().optional(), // minutes per workout
  availableEquipment: z.array(z.enum(EQUIPMENT_OPTIONS as unknown as [string, ...string[]])),
  location: TrainingLocationSchema,
});

// Experience Profile Schemas
export const ExperienceLevelSchema = z.enum(['beginner', 'intermediate', 'advanced']);

export const TrainingHistorySchema = z.object({
  yearsTraining: z.number().optional(),
  previousPrograms: z.array(z.string()), // "Starting Strength", "Couch to 5K", etc.
  sports: z.array(z.string()), // Sports background
  certifications: z.array(z.string()), // Any fitness certs
});

export const CurrentCapabilitiesSchema = z.object({
  canDoFullPushup: z.boolean(),
  canDoFullPullup: z.boolean(),
  canRunMile: z.boolean(),
  canSquatBelowParallel: z.boolean(),
  estimatedMaxes: z.object({
    squat: z.number().optional(),
    bench: z.number().optional(),
    deadlift: z.number().optional(),
    unit: z.enum(['kg', 'lbs']),
  }).optional(),
});

export const ExperienceProfileSchema = z.object({
  level: ExperienceLevelSchema,
  history: TrainingHistorySchema,
  capabilities: CurrentCapabilitiesSchema,
  lastAssessmentDate: z.string(), // Date serialized as ISO string
});

// Plan Goals Schemas
export const TargetLiftWeightSchema = z.object({
  exercise: z.string(),
  weight: z.number(), // kg or lbs
});

export const TargetDurationSchema = z.object({
  activity: z.string(),
  duration: z.number(), // minutes
});

export const TargetMetricsSchema = z.object({
  targetWeights: z.array(TargetLiftWeightSchema).optional(),
  targetDuration: TargetDurationSchema.optional(),
  targetPace: z.number().optional(), // seconds per km/mile
  targetDistance: z.number().optional(), // meters for running/cycling goals
  totalWorkouts: z.number().optional(), // for consistency goals
  minStreakDays: z.number().optional(), // for habit building
});

export const PlanGoalsSchema = z.object({
  primary: PrimaryFitnessGoalSchema,
  secondary: z.array(z.string()),
  targetMetrics: TargetMetricsSchema,
  targetDate: z.string().optional(), // Date serialized as ISO string
});

// Workout Performance Schema
export const ExercisePerformanceSchema = z.object({
  name: z.string(),
  setsCompleted: z.number(),
  weight: z.array(z.number()).optional(),
  reps: z.array(z.number()).optional(),
  duration: z.number().optional(), // seconds
  distance: z.number().optional(), // meters
  rpe: z.number().optional(), // Rate of Perceived Exertion
  rir: z.number().optional(), // Reps in Reserve
});

export const ActivityPerformanceSchema = z.object({
  activityId: z.string(),
  exercises: z.array(ExercisePerformanceSchema).optional(),
  duration: z.number().optional(), // minutes
  perceivedExertion: z.number(), // 1-10 scale
  enjoyment: z.number(), // 1-10 scale
  difficultyRating: z.enum(['too_easy', 'just_right', 'too_hard']),
  notes: z.string().optional(),
});

export const WorkoutPerformanceSchema = z.object({
  completedAt: z.string(), // ISO date string
  durationMinutes: z.number(),
  perceivedExertion: z.number(),
  enjoyment: z.number(),
  activities: z.array(ActivityPerformanceSchema),
  notes: z.string().optional(),
});

// Workout Verification Schema
export const VerificationDataSchema = z.object({
  proof: z.string().optional(), // URL to photo, GPS coordinate, etc.
  timestamp: z.string(), // ISO date string
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    accuracy: z.number().optional(), // meters
  }).optional(),
  duration: z.number().optional(), // seconds
});

export const WorkoutVerificationSchema = z.object({
  method: z.enum(['gps', 'photo', 'wearable', 'witness', 'gym_checkin', 'manual']),
  verified: z.boolean(),
  data: VerificationDataSchema,
  verifiedAt: z.string(), // ISO date string
  verifierId: z.string().optional(), // For witness/gym_checkin verification
  sponsorEligible: z.boolean().optional(), // Add the sponsorEligible field
});

// User Stats Schema
export const AchievementSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  earnedAt: z.string(), // ISO date string
});