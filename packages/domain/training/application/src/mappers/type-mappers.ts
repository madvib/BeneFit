import { z } from 'zod';
import {
  FitnessGoals,
  TrainingConstraints,
  ExperienceProfile,
  PlanGoals,
  WorkoutPerformance,
  WorkoutVerification,
} from '@bene/training-core';
import {
  FitnessGoalsSchema,
  TrainingConstraintsSchema,
  ExperienceProfileSchema,
  PlanGoalsSchema,
  WorkoutPerformanceSchema,
  WorkoutVerificationSchema,
} from '../schemas/index.js';

export function toDomainFitnessGoals(
  fitnessGoals: z.infer<typeof FitnessGoalsSchema>,
): FitnessGoals {
  return {
    primary: fitnessGoals.primary,
    secondary: fitnessGoals.secondary,
    targetWeight: fitnessGoals.targetWeight,
    targetBodyFat: fitnessGoals.targetBodyFat,
    targetDate: fitnessGoals.targetDate ? new Date(fitnessGoals.targetDate) : undefined,
    motivation: fitnessGoals.motivation,
    successCriteria: fitnessGoals.successCriteria,
  };
}

export function toDomainTrainingConstraints(
  constraints: z.infer<typeof TrainingConstraintsSchema>,
): TrainingConstraints {
  return {
    injuries: constraints.injuries,
    availableDays: constraints.availableDays,
    preferredTime: constraints.preferredTime,
    maxDuration: constraints.maxDuration,
    availableEquipment: constraints.availableEquipment,
    location: constraints.location,
  };
}

export function toDomainExperienceProfile(
  experience: z.infer<typeof ExperienceProfileSchema>,
): ExperienceProfile {
  return {
    level: experience.level,
    history: experience.history,
    capabilities: experience.capabilities,
    lastAssessmentDate: new Date(experience.lastAssessmentDate),
  };
}

export function toDomainPlanGoals(goals: z.infer<typeof PlanGoalsSchema>): PlanGoals {
  return {
    primary: goals.primary,
    secondary: goals.secondary,
    targetMetrics: {
      targetWeights: goals.targetMetrics.targetWeights,
      targetDuration: goals.targetMetrics.targetDuration,
      targetPace: goals.targetMetrics.targetPace,
      targetDistance: goals.targetMetrics.targetDistance,
      totalWorkouts: goals.targetMetrics.totalWorkouts,
      minStreakDays: goals.targetMetrics.minStreakDays,
    },
    targetDate: goals.targetDate ? new Date(goals.targetDate) : undefined,
  };
}

// For WorkoutPerformance, we'll create a converter focusing on date and structure conversion
export function toDomainWorkoutPerformance(
  performance: z.infer<typeof WorkoutPerformanceSchema>,
): WorkoutPerformance {
  return {
    startedAt: new Date(), // Default, as this may not be in the schema
    completedAt: new Date(performance.completedAt),
    durationMinutes: performance.durationMinutes,
    perceivedExertion: performance.perceivedExertion,
    energyLevel: 'medium' as const, // Default, as this may not be in the schema
    enjoyment: performance.enjoyment,
    difficultyRating: performance.activities[0]?.difficultyRating || 'just_right' as const, // Use first activity's rating or default
    activities: performance.activities.map((activity) => ({
      activityType: 'main' as const, // Default to main, since activityType doesn't exist in schema
      completed: true, // Default to true
      durationMinutes: activity.duration || 30, // Use duration from schema or default to 30 min
      exercises: activity.exercises?.map(exercise => ({
        name: exercise.name,
        setsPlanned: exercise.setsCompleted,
        setsCompleted: exercise.setsCompleted,
        reps: exercise.reps,
        weight: exercise.weight,
        distance: exercise.distance,
        duration: exercise.duration,
      })),
      notes: activity.notes,
    })),
    notes: performance.notes,
  };
}

export function toDomainWorkoutVerification(
  verification: z.infer<typeof WorkoutVerificationSchema>,
): WorkoutVerification {
  // Handle different verification types based on the method
  let verificationData: any;

  switch(verification.method) {
    case 'gps':
      // If we have GPS data in the schema, use it; otherwise create minimal GPS verification
      verificationData = {
        latitude: verification.data.location?.lat || 0,
        longitude: verification.data.location?.lng || 0,
        accuracy: verification.data.location?.accuracy || 100,
        timestamp: new Date(verification.data.timestamp),
      };
      break;
    case 'gym_checkin':
      verificationData = {
        gymId: '',
        gymName: '',
        checkinTime: new Date(verification.data.timestamp),
      };
      break;
    case 'wearable':
      verificationData = {
        device: '',
        activityId: '',
        source: 'other' as const,
        syncedAt: new Date(verification.data.timestamp),
      };
      break;
    case 'photo':
      verificationData = {
        photoUrl: verification.data.proof || '',
        uploadedAt: new Date(verification.data.timestamp),
        verified: verification.verified,
      };
      break;
    case 'witness':
      verificationData = {
        witnessUserId: '',
        witnessName: '',
        verifiedAt: new Date(verification.data.timestamp),
      };
      break;
    case 'manual':
      verificationData = null;
      break;
    default:
      verificationData = null;
  }

  return {
    verified: verification.verified,
    verifications: [
      {
        method: verification.method as any,
        data: verificationData,
      },
    ],
    sponsorEligible: verification.sponsorEligible ?? false,
    verifiedAt: new Date(verification.verifiedAt),
  };
}
