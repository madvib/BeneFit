/// <reference path="../../../../../types/cloudflare-runtime.d.ts" />

import { profile, NewProfile } from './schema/user-profile/profile.js';
import { userStats, NewUserStats } from './schema/user-profile/user_stats.js';
import { achievements, NewAchievement } from './schema/user-profile/achievements.js';
import {
  completedWorkouts,
  NewCompletedWorkout,
} from './schema/workouts/completed_workouts.js';
import {
  workoutActivities,
  NewWorkoutActivity,
} from './schema/workouts/workout_activities.js';
import {
  workoutMetadata,
  NewWorkoutMetadata,
} from './schema/workouts/workout_metadata.js';
import {
  workoutReactions,
  NewWorkoutReaction,
} from './schema/workouts/workout_reactions.js';
import {
  coachingConversation,
  NewCoachConversation,
} from './schema/coach/coaching_conversation.js';
import { coachingMessages, NewCoachMsg } from './schema/coach/coaching_messages.js';
import { checkIns, NewCheckIn } from './schema/coach/check_ins.js';
import {
  connectedServices,
  NewConnectedService,
} from './schema/integrations/connected_services.js';
import {
  integrationSyncLog,
  NewIntegrationSyncLog,
} from './schema/integrations/integration_sync_log.js';
import {
  activeFitnessPlan,
  NewActiveFitnessPlan,
} from './schema/fitness-plan/active_workout_plan.js';
import {
  weeklySchedules,
  NewWeeklySchedule,
} from './schema/fitness-plan/weekly_schedules.js';
import {
  workoutTemplates,
  NewWorkoutTemplate,
} from './schema/fitness-plan/workout_templates.js';

import { SEED_USER_IDS, SEED_USERS, SEED_PERSONAS } from '@bene/shared';

// Fixed reference time for deterministic seeding (Jan 1, 2024 12:00:00 UTC)
const now = 1704110400;

// User state mappings to avoid verbose ternaries
const USER_PROFILES: Record<string, Partial<NewProfile>> = {
  [SEED_USER_IDS.USER_001]: {
    bio: 'Professional boxer turned fitness enthusiast',
    location: 'New York, NY',
    timezone: 'America/New_York',
  },
  [SEED_USER_IDS.USER_002]: {
    bio: 'Marathon runner and coach',
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles',
  },
  [SEED_USER_IDS.USER_003]: {
    bio: 'Powerlifter and gym enthusiast',
    location: 'Austin, TX',
    timezone: 'America/Chicago',
  },
  [SEED_USER_IDS.USER_004]: {
    bio: 'Yoga instructor',
    location: 'Seattle, WA',
    timezone: 'America/Los_Angeles',
  },
  [SEED_USER_IDS.USER_005]: {
    bio: 'Cycling enthusiast',
    location: 'Denver, CO',
    timezone: 'America/Denver',
  },
};

const USER_STATS: Record<string, Partial<NewUserStats>> = {
  [SEED_USER_IDS.USER_001]: {
    currentStreakDays: 15,
    longestStreakDays: 22,
    totalWorkoutsCompleted: 45,
    totalMinutesTrained: 2250,
    totalVolumeKg: 12500,
  },
  [SEED_USER_IDS.USER_002]: {
    currentStreakDays: 8,
    longestStreakDays: 14,
    totalWorkoutsCompleted: 78,
    totalMinutesTrained: 4267,
    totalDistanceMeters: 420000,
  },
  [SEED_USER_IDS.USER_003]: {
    currentStreakDays: 5,
    longestStreakDays: 12,
    totalWorkoutsCompleted: 62,
    totalMinutesTrained: 3117,
    totalVolumeKg: 18700,
  },
  [SEED_USER_IDS.USER_004]: {
    currentStreakDays: 3,
    longestStreakDays: 5,
    totalWorkoutsCompleted: 10,
    totalMinutesTrained: 600,
  },
  [SEED_USER_IDS.USER_005]: {
    currentStreakDays: 20,
    longestStreakDays: 25,
    totalWorkoutsCompleted: 40,
    totalMinutesTrained: 2400,
  },
};

// Map SEED_USERS to Profiles
const profilesData: NewProfile[] = SEED_USERS.map((u, index) => ({
  userId: u.id,
  displayName: u.name,
  avatarUrl: u.avatarUrl,
  bio: USER_PROFILES[u.id]?.bio || 'Fitness Enthusiast',
  location: USER_PROFILES[u.id]?.location || 'Planet Earth',
  timezone: USER_PROFILES[u.id]?.timezone || 'UTC',
  createdAt: new Date((now - 86400 * (index + 1)) * 1000),
  updatedAt: new Date(now * 1000),
}));

// Map SEED_USERS to User Stats
const userStatsData: NewUserStats[] = SEED_USERS.map((u) => {
  const stats = USER_STATS[u.id] || {};
  return {
    userId: u.id,
    displayName: u.name,
    currentStreakDays: stats.currentStreakDays || 0,
    longestStreakDays: stats.longestStreakDays || 0,
    totalWorkoutsCompleted: stats.totalWorkoutsCompleted || 0,
    totalMinutesTrained: stats.totalMinutesTrained || 0,
    totalVolumeKg: stats.totalVolumeKg || 0,
    totalDistanceMeters: stats.totalDistanceMeters || 0,
    totalCaloriesBurned: 0,
    updatedAt: new Date(now * 1000),
  };
});

const achievementsData: NewAchievement[] = [
  {
    id: 'ach_001',
    userId: SEED_USER_IDS.USER_001,
    name: 'First Workout',
    description: 'Completed your first workout',
    achievementType: 'first_workout',
    earnedAt: new Date((now - 86400) * 1000),
    metadataJson: { progress: { current: 1, target: 1 } },
  },
  {
    id: 'ach_002',
    userId: SEED_USER_IDS.USER_001,
    name: 'Week Streak',
    description: 'Worked out for 7 consecutive days',
    achievementType: 'streak_7',
    earnedAt: new Date((now - 43200) * 1000),
    metadataJson: { progress: { current: 7, target: 7 } },
  },
  {
    id: 'ach_003',
    userId: SEED_USER_IDS.USER_002,
    name: 'Marathon Master',
    description: 'Completed a marathon',
    achievementType: 'pr_distance',
    earnedAt: new Date((now - 172800) * 1000),
    metadataJson: { progress: { current: 42195, target: 42195 }, distance: 42195 },
  },
  {
    id: 'ach_004',
    userId: SEED_USER_IDS.USER_003,
    name: 'Heavy Lifter',
    description: 'Lifted 1000kg total in a workout',
    achievementType: 'pr_strength',
    earnedAt: new Date((now - 259200) * 1000),
    metadataJson: { progress: { current: 1000, target: 1000 }, volume: 1000 },
  },
];

const completedWorkoutsData: NewCompletedWorkout[] = [
  {
    id: 'cw_001',
    userId: SEED_USER_IDS.USER_001,
    workoutId: 'wo_001',
    planId: 'plan_001',
    workoutTemplateId: 'wt_001',
    workoutType: 'strength',
    completedAt: new Date((now - 1800) * 1000),
    recordedAt: new Date((now - 1800) * 1000),
    durationSeconds: 1800,
    notes: 'Leg Day Destruction',
    totalVolume: 2450,
    distanceMeters: 0,
    caloriesBurned: 0,
    performanceJson: {
      totalReps: 85,
      totalSets: 15,
      rpeAverage: 8.5,
      exertionScore: 7.8,
    },
    createdAt: new Date((now - 3600) * 1000),
  },
  {
    id: 'cw_002',
    userId: SEED_USER_IDS.USER_002,
    workoutId: 'wo_002',
    planId: 'afp_002',
    workoutTemplateId: 'wt_002',
    workoutType: 'cardio',
    completedAt: new Date((now - 7000) * 1000),
    recordedAt: new Date((now - 7000) * 1000),
    durationSeconds: 3600,
    notes: 'Long run, felt good',
    totalVolume: 0,
    distanceMeters: 10000,
    caloriesBurned: 800,
    performanceJson: {
      totalReps: 0,
      totalSets: 0,
      rpeAverage: 7.0,
      exertionScore: 6.5,
    },
    createdAt: new Date((now - 7200) * 1000),
  },
  {
    id: 'cw_004',
    userId: SEED_USER_IDS.USER_004,
    workoutId: 'wo_004',
    planId: 'afp_004',
    workoutTemplateId: 'wt_004',
    workoutType: 'rest',
    completedAt: new Date((now - 172800) * 1000),
    recordedAt: new Date((now - 172800) * 1000),
    durationSeconds: 1200,
    notes: 'Feeling a bit stiff in the shoulders.',
    totalVolume: 0,
    distanceMeters: 0,
    caloriesBurned: 150,
    performanceJson: {
      totalReps: 0,
      totalSets: 0,
      rpeAverage: 4.0,
      exertionScore: 3.5,
    },
    createdAt: new Date((now - 172800) * 1000),
  },
  {
    id: 'cw_005',
    userId: SEED_USER_IDS.USER_005,
    workoutId: 'wo_005',
    planId: 'afp_005',
    workoutTemplateId: 'wt_005',
    workoutType: 'cardio',
    completedAt: new Date((now - 86400) * 1000),
    recordedAt: new Date((now - 86400) * 1000),
    durationSeconds: 2400,
    notes: 'Last workout of the challenge! Emptied the tank.',
    totalVolume: 0,
    distanceMeters: 0,
    caloriesBurned: 450,
    performanceJson: {
      totalReps: 120,
      totalSets: 8,
      rpeAverage: 9.5,
      exertionScore: 9.8,
    },
    createdAt: new Date((now - 86400) * 1000),
  },
];

const workoutActivitiesData: NewWorkoutActivity[] = [
  {
    id: 'wa_001',
    completedWorkoutId: 'cw_001',
    activityType: 'strength',
    exerciseId: 'ex_001',
    exerciseName: 'Squats',
    orderIndex: 0,
    setsJson: [{ reps: 5, weight: 100, rpe: 9, restSeconds: 180 }],
    notes: 'Working up to 110kg PR next week',
    completedAt: new Date((now - 3500) * 1000),
  },
  {
    id: 'wa_002',
    completedWorkoutId: 'cw_001',
    activityType: 'strength',
    exerciseId: 'ex_002',
    exerciseName: 'Bench Press',
    orderIndex: 1,
    setsJson: [{ reps: 6, weight: 80, rpe: 8, restSeconds: 180 }],
    notes: 'Good form, felt strong',
    completedAt: new Date((now - 3000) * 1000),
  },
  {
    id: 'wa_003',
    completedWorkoutId: 'cw_002',
    activityType: 'cardio',
    exerciseId: 'ex_003',
    exerciseName: 'Running',
    orderIndex: 0,
    durationSeconds: 3600,
    distanceMeters: 10000,
    heartRateAvg: 155,
    notes: 'Steady pace, felt great',
    completedAt: new Date((now - 7000) * 1000),
  },
];

const workoutMetadataData: NewWorkoutMetadata[] = [
  {
    id: 'wm_001',
    userId: SEED_USER_IDS.USER_001,
    teamId: null,
    workoutType: 'strength',
    completedAt: new Date((now - 1800) * 1000),
    durationSeconds: 1800,
    distanceMeters: 0,
    totalVolume: 2450,
    personalRecords: ['squat_1rm_225'],
    feelingRating: 4,
    createdAt: new Date((now - 1800) * 1000),
  },
  {
    id: 'wm_002',
    userId: SEED_USER_IDS.USER_002,
    teamId: 'team_001',
    workoutType: 'cardio',
    completedAt: new Date((now - 3600) * 1000),
    durationSeconds: 3600,
    distanceMeters: 10000,
    totalVolume: 0,
    personalRecords: ['10k_best_time'],
    feelingRating: 5,
    createdAt: new Date((now - 3600) * 1000),
  },
];

const workoutReactionsData: NewWorkoutReaction[] = [
  {
    id: 'wr_001',
    workoutId: 'cw_001',
    userId: SEED_USER_IDS.USER_002,
    userName: 'Jane Doe',
    reactionType: 'fire',
    createdAt: new Date((now - 1700) * 1000),
  },
  {
    id: 'wr_002',
    workoutId: 'cw_002',
    userId: SEED_USER_IDS.USER_003,
    userName: 'Dave Smith',
    reactionType: 'strong',
    createdAt: new Date((now - 3500) * 1000),
  },
  {
    id: 'wr_003',
    workoutId: 'cw_005',
    userId: SEED_USER_IDS.USER_001,
    userName: 'Test User',
    reactionType: 'clap', // Fix: 'celebrate' was a hallucination, not in enum
    createdAt: new Date((now - 86000) * 1000),
  },
];

const coachingConversationsData: NewCoachConversation[] = [
  {
    id: 'conv_001',
    userId: SEED_USER_IDS.USER_001,
    contextJson: {
      currentStreak: 15,
      recentWorkouts: ['cw_001'],
      goals: ['increase_volume'],
    },
    totalMessages: 5,
    totalUserMessages: 3,
    totalCoachMessages: 2,
    lastMessageAt: new Date((now - 1800) * 1000),
    startedAt: new Date((now - 7200) * 1000),
  },
  {
    id: 'conv_002',
    userId: SEED_USER_IDS.USER_002,
    contextJson: {
      currentStreak: 8,
      recentWorkouts: ['cw_002'],
      goals: ['improve_endurance'],
    },
    totalMessages: 3,
    totalUserMessages: 2,
    totalCoachMessages: 1,
    lastMessageAt: new Date((now - 3600) * 1000),
    startedAt: new Date((now - 14400) * 1000),
  },
  {
    id: 'conv_003',
    userId: SEED_USER_IDS.USER_003,
    contextJson: {
      currentStreak: 5,
      recentWorkouts: [],
      goals: ['get_started'],
    },
    totalMessages: 0,
    totalUserMessages: 0,
    totalCoachMessages: 0,
    lastMessageAt: null,
    startedAt: new Date(now * 1000),
  },
  {
    id: 'conv_005',
    userId: SEED_USER_IDS.USER_005,
    contextJson: {
      currentStreak: 20,
      recentWorkouts: ['cw_005'],
      goals: ['maintain_results'],
    },
    totalMessages: 12,
    totalUserMessages: 6,
    totalCoachMessages: 6,
    lastMessageAt: new Date((now - 3600) * 1000),
    startedAt: new Date((now - 2592000) * 1000),
  },
];

const coachingMessagesData: NewCoachMsg[] = [
  {
    id: 'cm_001',
    conversationId: 'conv_001',
    role: 'user',
    content: 'How can I safely increase the weight on my squats?',
    createdAt: new Date((now - 7000) * 1000),
  },
  {
    id: 'cm_002',
    conversationId: 'conv_001',
    role: 'assistant',
    content:
      'Based on your form, I recommend increasing by 2.5kg increments and focusing on the eccentric phase.',
    createdAt: new Date((now - 6800) * 1000),
  },
  {
    id: 'cm_003',
    conversationId: 'conv_002',
    role: 'user',
    content: 'I feel like my endurance could be better. Any tips?',
    createdAt: new Date((now - 14000) * 1000),
  },
];

const checkInsData: NewCheckIn[] = [
  {
    id: 'ci_001',
    conversationId: 'conv_001',
    type: 'proactive',
    triggeredBy: 'progress_review',
    question: "Noticed you've been consistent with your training. How are you feeling?",
    userResponse: 'Feeling strong and motivated!',
    status: 'responded',
    createdAt: new Date((now - 3600) * 1000),
    respondedAt: new Date((now - 3500) * 1000),
  },
  {
    id: 'ci_002',
    conversationId: 'conv_002',
    type: 'scheduled',
    triggeredBy: 'weekly_review',
    question: 'Weekly check-in: How did your training go this week?',
    userResponse: null,
    status: 'pending',
    createdAt: new Date((now - 10800) * 1000),
    respondedAt: null,
  },
  {
    id: 'ci_003',
    conversationId: 'conv_003',
    type: 'proactive',
    triggeredBy: 'onboarding',
    question: "Welcome to BeneFit! What's your primary goal for the next 30 days?",
    userResponse: null,
    status: 'pending',
    createdAt: new Date(now * 1000),
    respondedAt: null,
  },
  {
    id: 'ci_005',
    conversationId: 'conv_005',
    type: 'proactive',
    triggeredBy: 'completion_survey',
    question:
      'Congratulations on finishing the Shred Challenge! How would you rate your experience?',
    userResponse: 'It was tough but rewarding. Loved it!',
    status: 'responded',
    createdAt: new Date((now - 82800) * 1000),
    respondedAt: new Date((now - 82000) * 1000),
  },
];

const connectedServicesData: NewConnectedService[] = [
  {
    id: 'cs_001',
    userId: SEED_USER_IDS.USER_001,
    serviceType: 'strava',
    accessTokenEncrypted: 'encrypted_fake_token',
    refreshTokenEncrypted: 'encrypted_fake_refresh',
    serviceUserId: 'strava_user_001',
    lastSyncAt: new Date((now - 7200) * 1000),
    createdAt: new Date((now - 86400) * 1000),
    updatedAt: new Date((now - 7200) * 1000),
  },
  {
    id: 'cs_002',
    userId: SEED_USER_IDS.USER_002,
    serviceType: 'garmin',
    accessTokenEncrypted: 'encrypted_fake_token2',
    refreshTokenEncrypted: 'encrypted_fake_refresh2',
    serviceUserId: 'garmin_user_002',
    lastSyncAt: new Date((now - 3600) * 1000),
    createdAt: new Date((now - 172800) * 1000),
    updatedAt: new Date((now - 3600) * 1000),
  },
];

const integrationSyncLogsData: NewIntegrationSyncLog[] = [
  {
    id: 'isl_001',
    userId: SEED_USER_IDS.USER_001,
    serviceType: 'strava',
    syncStartedAt: new Date((now - 7200) * 1000),
    syncCompletedAt: new Date((now - 7100) * 1000),
    status: 'success',
    workoutsSyncedCount: 2,
    createdAt: new Date((now - 7200) * 1000),
  },
  {
    id: 'isl_002',
    userId: SEED_USER_IDS.USER_002,
    serviceType: 'garmin',
    syncStartedAt: new Date((now - 3600) * 1000),
    syncCompletedAt: new Date((now - 3550) * 1000),
    status: 'success',
    workoutsSyncedCount: 1,
    createdAt: new Date((now - 3600) * 1000),
  },
];

const activeFitnessPlansData: NewActiveFitnessPlan[] = SEED_USERS.map((u) => {
  const persona = SEED_PERSONAS[u.id as keyof typeof SEED_PERSONAS];
  if (!persona.plan) return null;

  const isActive = persona.plan.status === 'active';
  const isPaused = persona.plan.status === 'paused';
  const isCompleted = persona.plan.status === 'completed';

  // Deterministic dates based on status
  let startDate = new Date((now - 172800) * 1000); // Default 2 days ago
  let endDate = new Date((now + 1209600) * 1000); // Default 2 weeks future

  if (isCompleted) {
    startDate = new Date((now - 2592000) * 1000); // 30 days ago
    endDate = new Date((now - 86400) * 1000); // Ended yesterday
  } else if (isPaused) {
    startDate = new Date((now - 604800) * 1000); // Started 1 week ago
    endDate = new Date((now + 604800) * 1000); // Ends 1 week future
  }

  const activePlan: NewActiveFitnessPlan = {
    id: `afp_${ u.id.split('_').pop() }`,
    userId: u.id,
    title: persona.plan.title as string,
    description: `${ persona.role } training plan`,
    planType: persona.plan.type as string,
    templateId: `plan_${ u.id.split('_').pop() }`,
    goalsJson: { focus: 'general', target: 'improve' },
    progressionJson: { type: 'standard', intensity: 'moderate' },
    constraintsJson: { availability: ['Mon', 'Wed', 'Fri'], maxHoursPerWeek: 5 },
    currentPositionJson: { week: 1, day: 1 },
    status: persona.plan.status as 'active' | 'paused' | 'completed',
    completedWorkouts: isCompleted ? 20 : 5,
    totalScheduledWorkouts: 20,
    startDate,
    endDate,
    createdAt: startDate,
    updatedAt: new Date(now * 1000),
  };

  return activePlan;
}).filter((plan): plan is NewActiveFitnessPlan => plan !== null);

const weeklySchedulesData: NewWeeklySchedule[] = [
  {
    id: 'ws_001',
    planId: 'afp_001',
    weekNumber: 3,
    startDate: new Date((now - 259200) * 1000), // Beginning of week 3
    endDate: new Date((now - 200800) * 1000), // End of week 3
    focus: 'Leg Strength',
    targetWorkouts: 4,
    workoutsJson: [
      {
        id: 'wt_001',
        dayOfWeek: 1, // Monday
        title: 'Leg Day',
        workoutType: 'strength',
        exercises: [
          { name: 'Squats', sets: 5, reps: 5, weightKg: 100 },
          { name: 'Romanian Deadlifts', sets: 4, reps: 6, weightKg: 80 },
        ],
      },
      {
        id: 'wt_002',
        dayOfWeek: 3, // Wednesday
        title: 'Upper Body',
        workoutType: 'strength',
        exercises: [
          { name: 'Bench Press', sets: 4, reps: 6, weightKg: 80 },
          { name: 'Pull-ups', sets: 3, reps: 8 },
        ],
      },
    ],
    createdAt: new Date((now - 259200) * 1000),
    updatedAt: new Date((now - 259200) * 1000),
  },
  {
    id: 'ws_002',
    planId: 'afp_002',
    weekNumber: 8,
    startDate: new Date((now - 172800) * 1000), // Beginning of week 8
    endDate: new Date((now - 114400) * 1000), // End of week 8
    focus: 'Long Run Build',
    targetWorkouts: 5,
    workoutsJson: [
      {
        id: 'wt_003',
        dayOfWeek: 1, // Monday
        title: 'Easy Run',
        workoutType: 'cardio',
        exercises: [
          { name: 'Warm-up', duration: 15, type: 'easy_jog' },
          { name: 'Main Run', duration: 45, distance: 8000, type: 'steady' },
          { name: 'Cool-down', duration: 15, type: 'easy_jog' },
        ],
      },
      {
        id: 'wt_004',
        dayOfWeek: 3, // Wednesday
        title: 'Speed Work',
        workoutType: 'cardio',
        exercises: [
          { name: 'Warm-up', duration: 15, type: 'easy_jog' },
          { name: 'Intervals', details: '6 x 800m @ 5K pace', type: 'intervals' },
          { name: 'Cool-down', duration: 15, type: 'easy_jog' },
        ],
      },
    ],
    createdAt: new Date((now - 172800) * 1000),
    updatedAt: new Date((now - 172800) * 1000),
  },
  {
    id: 'ws_004',
    planId: 'afp_004',
    weekNumber: 2,
    startDate: new Date((now - 172800) * 1000),
    endDate: new Date((now + 432000) * 1000),
    focus: 'Flexibility',
    targetWorkouts: 2,
    workoutsJson: [
      {
        id: 'wt_004_1',
        dayOfWeek: 1,
        title: 'Morning Yoga',
        workoutType: 'recovery',
        exercises: [{ name: 'Sun Salutations', duration: 15 }, { name: 'Deep Stretching', duration: 25 }],
      },
      {
        id: 'wt_004_2',
        dayOfWeek: 4,
        title: 'Evening Flow',
        workoutType: 'recovery',
        exercises: [{ name: 'Cat-Cow', duration: 10 }, { name: 'Childs Pose', duration: 10 }],
      },
    ],
    createdAt: new Date((now - 172800) * 1000),
    updatedAt: new Date((now - 172800) * 1000),
  },
];

const workoutTemplatesData: NewWorkoutTemplate[] = [
  {
    id: 'wt_001',
    planId: 'afp_001',
    weekId: 'ws_001',
    weekNumber: 3,
    dayOfWeek: 1, // Monday
    scheduledDate: new Date(now * 1000 - 518400000).toISOString(), // 6 days ago
    title: 'Leg Day',
    type: 'strength',
    category: 'strength',
    status: 'completed',
    importance: 'key',
    activitiesJson: [
      { name: 'Squats', sets: 5, reps: 5, weightKg: 100 },
      { name: 'Romanian Deadlifts', sets: 4, reps: 6, weightKg: 80 },
    ],
    createdAt: new Date((now - 518400) * 1000),
    updatedAt: new Date((now - 518000) * 1000),
  },
  {
    id: 'wt_002',
    planId: 'afp_002',
    weekId: 'ws_002',
    weekNumber: 8,
    dayOfWeek: 3, // Wednesday
    scheduledDate: new Date(now * 1000 - 172800000).toISOString(), // 2 days ago
    title: 'Speed Work',
    type: 'cardio',
    category: 'cardio',
    status: 'completed',
    importance: 'key',
    activitiesJson: [
      { name: 'Warm-up', duration: 15, type: 'easy_jog' },
      { name: 'Intervals', details: '6 x 800m @ 5K pace', type: 'intervals' },
      { name: 'Cool-down', duration: 15, type: 'easy_jog' },
    ],
    createdAt: new Date((now - 172800) * 1000),
    updatedAt: new Date((now - 172400) * 1000),
  },
  {
    id: 'wt_004_1',
    planId: 'afp_004',
    weekId: 'ws_004',
    weekNumber: 2,
    dayOfWeek: 1,
    scheduledDate: new Date(now * 1000 - 86400000).toISOString(),
    title: 'Morning Yoga',
    type: 'recovery',
    category: 'recovery',
    status: 'completed',
    importance: 'key',
    activitiesJson: [{ name: 'Sun Salutations', duration: 15 }, { name: 'Deep Stretching', duration: 25 }],
    createdAt: new Date((now - 86400) * 1000),
    updatedAt: new Date((now - 86000) * 1000),
  },
];

/**
 * Seeds the User Base database using Drizzle ORM and Durable Object Storage.
 * @param storage - The DurableObjectStorage instance to seed
 */
import { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';

/**
 * Seeds the User Base database using Drizzle ORM.
 * @param db - The Drizzle database instance to seed
 */
export async function seedUserHub(db: BaseSQLiteDatabase<any, any>) {
  console.log('🌱 Seeding User Hub database with Drizzle ORM...');


  try {
    console.log('  - Clearing existing data...');
    // Use Drizzle ORM for clear operations
    await db.delete(workoutTemplates);
    await db.delete(weeklySchedules);
    await db.delete(activeFitnessPlan);
    await db.delete(integrationSyncLog);
    await db.delete(connectedServices);
    await db.delete(checkIns);
    await db.delete(coachingMessages);
    await db.delete(coachingConversation);
    await db.delete(workoutReactions);
    await db.delete(workoutMetadata);
    await db.delete(workoutActivities);
    await db.delete(completedWorkouts);
    await db.delete(achievements);
    await db.delete(userStats);
    await db.delete(profile);

    // Insert data
    console.log(`  - Inserting ${ profilesData.length } profiles...`);
    await db.insert(profile).values(profilesData);

    console.log(`  - Inserting ${ userStatsData.length } user stats...`);
    await db.insert(userStats).values(userStatsData);

    console.log(`  - Inserting ${ achievementsData.length } achievements...`);
    await db.insert(achievements).values(achievementsData);

    console.log(`  - Inserting ${ completedWorkoutsData.length } completed workouts...`);
    await db.insert(completedWorkouts).values(completedWorkoutsData);

    console.log(`  - Inserting ${ workoutActivitiesData.length } workout activities...`);
    await db.insert(workoutActivities).values(workoutActivitiesData);

    console.log(`  - Inserting ${ workoutMetadataData.length } workout metadata...`);
    await db.insert(workoutMetadata).values(workoutMetadataData);

    console.log(`  - Inserting ${ workoutReactionsData.length } workout reactions...`);
    await db.insert(workoutReactions).values(workoutReactionsData);

    console.log(
      `  - Inserting ${ coachingConversationsData.length } coaching conversations...`,
    );
    await db.insert(coachingConversation).values(coachingConversationsData);

    console.log(`  - Inserting ${ coachingMessagesData.length } coaching messages...`);
    await db.insert(coachingMessages).values(coachingMessagesData);

    console.log(`  - Inserting ${ checkInsData.length } check-ins...`);
    await db.insert(checkIns).values(checkInsData);

    console.log(`  - Inserting ${ connectedServicesData.length } connected services...`);
    await db.insert(connectedServices).values(connectedServicesData);

    console.log(
      `  - Inserting ${ integrationSyncLogsData.length } integration sync logs...`,
    );
    await db.insert(integrationSyncLog).values(integrationSyncLogsData);

    console.log(
      `  - Inserting ${ activeFitnessPlansData.length } active fitness plans...`,
    );
    await db.insert(activeFitnessPlan).values(activeFitnessPlansData);

    console.log(`  - Inserting ${ weeklySchedulesData.length } weekly schedules...`);
    await db.insert(weeklySchedules).values(weeklySchedulesData);

    console.log(`  - Inserting ${ workoutTemplatesData.length } workout templates...`);
    await db.insert(workoutTemplates).values(workoutTemplatesData);

    console.log('✅ User Base database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding User Base database:', error);
    throw error;
  }
}
