import { CompletedWorkout as DomainCompletedWorkout, ActivityPerformance, ExercisePerformance, VerificationData } from '@bene/training-core';
import { CompletedWorkout as SchemaCompletedWorkout } from '@bene/shared';

export class CompletedWorkoutMapper {
  static toResponse(workout: DomainCompletedWorkout): SchemaCompletedWorkout {
    return {
      id: workout.id,
      planId: workout.planId,
      workoutTemplateId: workout.workoutTemplateId,
      weekNumber: workout.weekNumber,
      dayNumber: workout.dayNumber,
      workoutType: workout.workoutType,
      description: workout.description,
      isPublic: workout.isPublic,
      multiplayerSessionId: workout.multiplayerSessionId,
      recordedAt: workout.recordedAt?.toISOString() || new Date().toISOString(),
      performance: {
        startedAt: workout.performance.startedAt?.toISOString() || workout.recordedAt?.toISOString() || new Date().toISOString(),
        completedAt: workout.performance.completedAt?.toISOString() || workout.recordedAt?.toISOString() || new Date().toISOString(),
        durationMinutes: workout.performance.durationMinutes,
        perceivedExertion: workout.performance.perceivedExertion,
        energyLevel: workout.performance.energyLevel,
        enjoyment: workout.performance.enjoyment,
        difficultyRating: workout.performance.difficultyRating,
        caloriesBurned: workout.performance.caloriesBurned,
        notes: workout.performance.notes,
        injuries: workout.performance.injuries,
        modifications: workout.performance.modifications,
        activities: workout.performance.activities.map((activity: ActivityPerformance) => ({
          activityType: activity.activityType,
          completed: activity.completed,
          durationMinutes: activity.durationMinutes,
          notes: activity.notes,
          intervalsCompleted: activity.intervalsCompleted,
          intervalsPlanned: activity.intervalsPlanned,
          exercises: activity.exercises?.map((exercise: ExercisePerformance) => ({
            name: exercise.name,
            setsCompleted: exercise.setsCompleted,
            setsPlanned: exercise.setsPlanned,
            reps: exercise.reps ? [...exercise.reps] : undefined,
            weight: exercise.weight ? [...exercise.weight] : undefined,
            distance: exercise.distance,
            duration: exercise.duration,
          })),
        })),
        heartRate: workout.performance.heartRate
          ? {
            average: workout.performance.heartRate.average,
            max: workout.performance.heartRate.max,
            zones: workout.performance.heartRate.zones
              ? { ...workout.performance.heartRate.zones }
              : undefined,
          }
          : undefined,
      },
      verification: {
        verified: workout.verification.verified,
        sponsorEligible: workout.verification.sponsorEligible,
        verifiedAt: workout.verification.verifiedAt?.toISOString(),
        verifications: workout.verification.verifications.map((v: VerificationData) => {
          if (v.method === 'gps') {
            return {
              method: 'gps',
              data: {
                ...v.data,
                timestamp: v.data.timestamp?.toISOString() || '',
              },
            };
          }
          if (v.method === 'gym_checkin') {
            return {
              method: 'gym_checkin',
              data: {
                ...v.data,
                checkinTime: v.data.checkinTime?.toISOString() || '',
                checkoutTime: v.data.checkoutTime?.toISOString(),
              },
            };
          }
          if (v.method === 'wearable') {
            return {
              method: 'wearable',
              data: {
                ...v.data,
                syncedAt: v.data.syncedAt?.toISOString() || '',
              },
            };
          }
          if (v.method === 'photo') {
            return {
              method: 'photo',
              data: {
                ...v.data,
                uploadedAt: v.data.uploadedAt?.toISOString() || '',
              },
            };
          }
          if (v.method === 'witness') {
            return {
              method: 'witness',
              data: {
                ...v.data,
                verifiedAt: v.data.verifiedAt?.toISOString() || '',
              },
            };
          }
          return v;
        }),
      },
      reactions: workout.reactions.map((r) => ({
        id: r.id,
        userId: r.userId,
        userName: r.userName,
        type: r.type,
        createdAt: r.createdAt?.toISOString() || new Date().toISOString(),
      })),
    };
  }
}
