import { workouts } from '@bene/react-api-client';
import type {
  WorkoutPerformance,
  WorkoutVerification,
  ActivityPerformance,
  WorkoutTemplate,
  CompletedWorkout,
  WorkoutSession,
  DailyWorkout,
} from '@bene/shared';

export const mockWorkoutTemplate: WorkoutTemplate = {
  id: 'workout-1',
  weekNumber: 1,
  dayOfWeek: 1,
  scheduledDate: '2026-01-13',
  title: 'Upper Body Strength - Week 1',
  type: 'Upper Body Strength',
  category: 'strength' as const,
  goals: {
    volume: {
      totalSets: 12,
      totalReps: 60,
      targetWeight: 'moderate' as const,
    },
    completionCriteria: {
      mustComplete: true,
      minimumEffort: 80,
      autoVerifiable: false,
    },
  },
  activities: [
    {
      name: 'Barbell Bench Press',
      type: 'main' as const,
      order: 1,
      structure: {
        exercises: [
          {
            name: 'Barbell Bench Press',
            sets: 4,
            reps: 8,
            weight: 100,
            rest: 120,
            notes: 'Focus on controlled descent',
          },
        ],
      },
      instructions: [
        'Lie flat on bench with feet planted',
        'Grip bar slightly wider than shoulder width',
        'Lower bar to mid-chest with control',
        'Press explosively to starting position',
      ],
      equipment: ['barbell', 'bench_press'],
    },
    {
      name: 'Dumbbell Rows',
      type: 'main' as const,
      order: 2,
      structure: {
        exercises: [
          {
            name: 'Dumbbell Rows',
            sets: 3,
            reps: 10,
            weight: 40,
            rest: 90,
          },
        ],
      },
      instructions: [
        'Place one knee and hand on bench',
        'Keep back flat and core engaged',
        'Pull dumbbell to hip with elbow close to body',
        'Control the descent',
      ],
      equipment: ['dumbbells', 'bench_press'],
      alternativeExercises: ['Cable Rows', 'Barbell Rows'],
    },
  ],
  status: 'scheduled' as const,
  coachNotes:
    'This is your first upper body session. Focus on learning proper form rather than pushing for maximum weight. The goal is to establish good movement patterns.',
  importance: 'key' as const,
  alternatives: [
    {
      reason: 'Limited equipment - home workout',
      activities: [
        {
          name: 'Push-ups',
          type: 'main' as const,
          order: 1,
          structure: {
            exercises: [
              {
                name: 'Push-ups',
                sets: 4,
                reps: 15,
                rest: 90,
              },
            ],
          },
          instructions: ['Hands shoulder-width apart', 'Lower chest to ground', 'Push back up'],
          equipment: [],
        },
      ],
    },
  ],
};

export const mockWorkoutVerification: WorkoutVerification = {
  verified: true,
  verifications: [
    {
      method: 'gps',
      data: {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10,
        timestamp: '2026-01-05T11:00:00Z',
      },
    },
  ],
  sponsorEligible: true,
  verifiedAt: '2026-01-05T11:05:00Z',
};

export const mockActivityPerformance: ActivityPerformance = {
  activityType: 'main',
  completed: true,
  durationMinutes: 45,
  notes: 'Felt strong today',
  exercises: [
    {
      name: 'Barbell Squat',
      setsCompleted: 3,
      setsPlanned: 3,
      weight: [100, 100, 100],
      reps: [5, 5, 5],
      rpe: 8,
    },
  ],
};

export const mockWorkoutPerformance: WorkoutPerformance = {
  startedAt: '2026-01-05T10:05:00Z',
  completedAt: '2026-01-05T11:00:00Z',
  durationMinutes: 55,
  activities: [mockActivityPerformance],
  perceivedExertion: 8,
  energyLevel: 'high',
  enjoyment: 9,
  difficultyRating: 'just_right',
  heartRate: {
    average: 145,
    max: 175,
    zones: { '1': 300, '2': 1200, '3': 1800, '4': 600, '5': 100 },
  },
  caloriesBurned: 450,
  notes: 'Great session, hit all targets.',
  injuries: [],
  modifications: [],
};

export const mockCompletedWorkout: CompletedWorkout = {
  id: 'completed-1',
  planId: 'plan-123',
  workoutTemplateId: 'workout-1',
  weekNumber: 1,
  dayNumber: 1,
  workoutType: 'Upper Body Strength',
  description: 'Great session, felt strong on the bench press.',
  performance: mockWorkoutPerformance,
  verification: mockWorkoutVerification,
  reactions: [],
  isPublic: true,
  recordedAt: '2026-01-05T11:00:00Z',
};

export const mockWorkoutSession: WorkoutSession = {
  id: 'session-1',
  workoutType: 'Vinyasa Yoga',
  state: 'in_progress',
  currentActivityIndex: 0,
  activities: [],
  completedActivities: [],
  configuration: {
    isMultiplayer: false,
    isPublic: false,
    maxParticipants: 1,
    allowSpectators: false,
    enableChat: false,
    enableVoiceAnnouncements: true,
    showOtherParticipantsProgress: false,
    autoAdvanceActivities: true,
  },
  participants: [],
  activityFeed: [],
  startedAt: '2026-01-07T10:00:00Z',
  totalPausedSeconds: 0,
  liveProgress: {
    activityType: 'main',
    activityIndex: 0,
    totalActivities: 1,
    activityStartedAt: '2026-01-07T10:00:00Z',
    elapsedSeconds: 1200, // 20 mins
  },
};

export const mockPushIntensitySession: WorkoutSession = {
  id: 'session-123',
  workoutType: 'Push Intensity',
  state: 'in_progress',
  currentActivityIndex: 0,
  completedActivities: [],
  totalPausedSeconds: 0,
  configuration: {
    isMultiplayer: false,
    isPublic: false,
    maxParticipants: 1,
    allowSpectators: false,
    enableChat: false,
    enableVoiceAnnouncements: true,
    showOtherParticipantsProgress: false,
    autoAdvanceActivities: false,
  },
  participants: [],
  activityFeed: [],
  activities: [
    {
      name: 'Dynamic Warmup',
      type: 'warmup',
      order: 0,
      duration: 10,
      instructions: ['Focus on shoulder mobility and light chest activation.'],
      structure: {
        exercises: [
          {
            name: 'Shoulder Dislocates',
            sets: 2,
            reps: 15,
            rest: 30,
            notes: 'Use a resistance band or PVC pipe.',
          },
          { name: 'Pushups', sets: 2, reps: 10, rest: 60, notes: 'Slow and controlled' },
        ],
      },
    },
    {
      name: 'Main Strength',
      type: 'main',
      order: 1,
      duration: 35,
      instructions: ['Execute compound movements with explosive intent.'],
      structure: {
        exercises: [
          {
            name: 'Bench Press',
            sets: 4,
            reps: 8,
            weight: 80,
            rest: 90,
            notes: 'Focus on leg drive',
          },
          { name: 'Overhead Press', sets: 3, reps: 10, weight: 45, rest: 90 },
        ],
      },
    },
    {
      name: 'Cooldown',
      type: 'cooldown',
      order: 2,
      duration: 10,
      instructions: ['Static stretching and parasympathetic breathing.'],
      structure: {
        exercises: [{ name: 'Pec Stretch', sets: 2, reps: '30s', rest: 15 }],
      },
    },
  ],
};

export const mockDetailedWorkoutSession: WorkoutSession = {
  id: 'session-123',
  workoutType: 'Hypertrophy Upper',
  state: 'in_progress',
  currentActivityIndex: 0,
  completedActivities: [],
  totalPausedSeconds: 0,
  configuration: {
    isPublic: false,
    isMultiplayer: false,
    maxParticipants: 1,
    allowSpectators: false,
    enableChat: false,
    enableVoiceAnnouncements: true,
    showOtherParticipantsProgress: false,
    autoAdvanceActivities: true,
  },
  participants: [],
  activityFeed: [],
  activities: [
    {
      name: 'Dynamic Warmup',
      type: 'warmup',
      order: 0,
      duration: 10,
      instructions: ['Increase heart rate and mobilize joints.'],
      structure: {
        exercises: [{ name: 'Band Pullaparts', sets: 2, reps: 20, rest: 30 }],
      },
    },
    {
      name: 'Primary Lifts',
      type: 'main',
      order: 1,
      duration: 45,
      instructions: ['Focus on contraction and tempo.'],
      structure: {
        exercises: [
          {
            name: 'Incline Bench Press',
            sets: 3,
            reps: 10,
            weight: 60,
            rest: 90,
            notes: '3-0-1-0 tempo',
          },
          { name: 'Pullups', sets: 3, reps: 'To Failure', rest: 120 },
        ],
      },
    },
  ],
};

export const mockAbandonedSession: WorkoutSession = {
  id: 'session-2',
  workoutType: 'HIIT Blast',
  state: 'abandoned',
  currentActivityIndex: 0,
  activities: [],
  completedActivities: [],
  configuration: {
    isMultiplayer: false,
    isPublic: false,
    maxParticipants: 1,
    allowSpectators: false,
    enableChat: false,
    enableVoiceAnnouncements: true,
    showOtherParticipantsProgress: false,
    autoAdvanceActivities: true,
  },
  participants: [],
  activityFeed: [],
  startedAt: '2026-01-05T08:00:00Z',
  abandonedAt: '2026-01-05T08:05:00Z',
  totalPausedSeconds: 0,
};

export const mockWorkoutHistory: workouts.GetWorkoutHistoryResponse = {
  workouts: [
    {
      id: 'workout-history-1',
      workoutType: 'strength',
      performance: {
        startedAt: '2026-01-05T09:05:00Z',
        completedAt: '2026-01-05T10:00:00Z',
        durationMinutes: 55,
        perceivedExertion: 8,
        enjoyment: 9,
        energyLevel: 'high',
        difficultyRating: 'just_right',
        caloriesBurned: 450,
        heartRate: {
          average: 145,
          max: 178,
          zones: { '1': 300, '2': 1200, '3': 1800, '4': 600, '5': 100 },
        },
        notes: 'Felt strong today, increased weight on bench press.',
        activities: [
          {
            activityType: 'warmup',
            completed: true,
            durationMinutes: 10,
            notes: 'Dynamic stretching',
            exercises: [],
          },
          {
            activityType: 'main',
            completed: true,
            durationMinutes: 45,
            exercises: [
              {
                name: 'Barbell Bench Press',
                setsCompleted: 4,
                setsPlanned: 4,
                reps: [10, 10, 8, 8],
                weight: [60, 60, 65, 65],
              },
              {
                name: 'Incline Dumbbell Fly',
                setsCompleted: 3,
                setsPlanned: 3,
                reps: [12, 12, 12],
                weight: [16, 16, 16],
              },
            ],
          },
        ],
      },
      verification: {
        verified: true,
        verifications: [],
        sponsorEligible: false,
      },
      reactions: [],
      isPublic: true,
      recordedAt: '2026-01-05T10:00:00Z',
    },
    {
      id: 'workout-history-2',
      workoutType: 'cardio',
      performance: {
        startedAt: '2026-01-03T07:30:00Z',
        completedAt: '2026-01-03T08:00:00Z',
        durationMinutes: 30,
        perceivedExertion: 8,
        enjoyment: 6,
        energyLevel: 'medium',
        difficultyRating: 'too_hard',
        caloriesBurned: 320,
        heartRate: {
          average: 155,
          max: 180,
        },
        activities: [
          {
            activityType: 'main',
            completed: true,
            durationMinutes: 30,
            exercises: [],
            notes: 'Steady state run',
          }
        ],
      },
      verification: {
        verified: false,
        verifications: [],
        sponsorEligible: false,
      },
      reactions: [],
      isPublic: false,
      recordedAt: '2026-01-03T08:00:00Z',
    },
  ],
  total: 2,
};

export const mockDailyWorkout: DailyWorkout = {
  workoutId: 'workout-1',
  planId: 'plan-123',
  type: 'Upper Body Strength',
  durationMinutes: 45,
  activities: [
    {
      type: 'warmup',
      instructions: 'Dynamic stretching and light cardio.',
      durationMinutes: 10,
    },
    {
      type: 'main',
      instructions: 'Focus on Barbell Bench Press and Dumbbell Rows.',
      durationMinutes: 30,
    },
    {
      type: 'cooldown',
      instructions: 'Static stretching and breathing exercises.',
      durationMinutes: 5,
    },
  ],
};
