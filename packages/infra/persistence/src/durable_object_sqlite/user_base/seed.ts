import { createDOClient } from '../../client.js';
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
import {
  coachingMessages,
  NewCoachMsg,
} from './schema/coach/coaching_messages.js';
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

const now = Math.floor(Date.now() / 1000);

// Use your schema types for type safety
const profilesData: NewProfile[] = [
  {
    userId: 'user_001',
    displayName: 'Mike Tyson',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    bio: 'Professional boxer turned fitness enthusiast',
    location: 'New York, NY',
    timezone: 'America/New_York',
    createdAt: now - 86400,
    updatedAt: now,
  },
  {
    userId: 'user_002',
    displayName: 'Jane Doe',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    bio: 'Marathon runner and coach',
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles',
    createdAt: now - 172800,
    updatedAt: now,
  },
  {
    userId: 'user_003',
    displayName: 'Dave Smith',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dave',
    bio: 'Powerlifter and gym enthusiast',
    location: 'Austin, TX',
    timezone: 'America/Chicago',
    createdAt: now - 259200,
    updatedAt: now,
  },
];

const userStatsData: NewUserStats[] = [
  {
    userId: 'user_001',
    displayName: 'Mike Tyson',
    currentStreakDays: 15,
    longestStreakDays: 22,
    totalWorkoutsCompleted: 45,
    totalMinutesTrained: 2250, // 135000 seconds / 60
    totalVolumeKg: 12500,
    totalDistanceMeters: 0,
    totalCaloriesBurned: 0,
    updatedAt: now,
  },
  {
    userId: 'user_002',
    displayName: 'Jane Doe',
    currentStreakDays: 8,
    longestStreakDays: 14,
    totalWorkoutsCompleted: 78,
    totalMinutesTrained: 4267, // 256000 seconds / 60
    totalVolumeKg: 0,
    totalDistanceMeters: 420000, // 420km
    totalCaloriesBurned: 0,
    updatedAt: now,
  },
  {
    userId: 'user_003',
    displayName: 'Dave Smith',
    currentStreakDays: 5,
    longestStreakDays: 12,
    totalWorkoutsCompleted: 62,
    totalMinutesTrained: 3117, // 187000 seconds / 60
    totalVolumeKg: 18700,
    totalDistanceMeters: 0,
    totalCaloriesBurned: 0,
    updatedAt: now,
  },
];

const achievementsData: NewAchievement[] = [
  {
    id: 'ach_001',
    userId: 'user_001',
    name: 'First Workout',
    description: 'Completed your first workout',
    achievementType: 'first_workout',
    earnedAt: now - 86400,
    metadataJson: { progress: { current: 1, target: 1 } },
  },
  {
    id: 'ach_002',
    userId: 'user_001',
    name: 'Week Streak',
    description: 'Worked out for 7 consecutive days',
    achievementType: 'streak_7',
    earnedAt: now - 43200,
    metadataJson: { progress: { current: 7, target: 7 } },
  },
  {
    id: 'ach_003',
    userId: 'user_002',
    name: 'Marathon Master',
    description: 'Completed a marathon',
    achievementType: 'pr_distance',
    earnedAt: now - 172800,
    metadataJson: { progress: { current: 42195, target: 42195 }, distance: 42195 },
  },
  {
    id: 'ach_004',
    userId: 'user_003',
    name: 'Heavy Lifter',
    description: 'Lifted 1000kg total in a workout',
    achievementType: 'pr_strength',
    earnedAt: now - 259200,
    metadataJson: { progress: { current: 1000, target: 1000 }, volume: 1000 },
  },
];

const completedWorkoutsData: NewCompletedWorkout[] = [
  {
    id: 'cw_001',
    userId: 'user_001',
    workoutId: 'wo_001',
    planId: 'plan_001',
    workoutTemplateId: 'wt_001',
    workoutType: 'strength',
    completedAt: now - 1800,
    recordedAt: now - 1800,
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
    createdAt: now - 1800,
  },
  {
    id: 'cw_002',
    userId: 'user_002',
    workoutId: 'wo_002',
    planId: 'plan_002',
    workoutTemplateId: 'wt_002',
    workoutType: 'cardio',
    completedAt: now - 3600,
    recordedAt: now - 3600,
    durationSeconds: 3600,
    notes: 'Morning Run',
    totalVolume: 0,
    distanceMeters: 10000, // 10km
    caloriesBurned: 0,
    performanceJson: {
      totalReps: 0,
      totalSets: 0,
      rpeAverage: 7.0,
      exertionScore: 6.5,
    },
    createdAt: now - 3600,
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
    completedAt: now - 3500,
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
    completedAt: now - 3000,
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
    completedAt: now - 7000,
  },
];

const workoutMetadataData: NewWorkoutMetadata[] = [
  {
    id: 'wm_001',
    userId: 'user_001',
    teamId: null,
    workoutType: 'strength',
    completedAt: now - 1800,
    durationSeconds: 1800,
    distanceMeters: 0,
    totalVolume: 2450,
    personalRecords: ["squat_1rm_225"],
    feelingRating: 4,
    createdAt: now - 1800,
  },
  {
    id: 'wm_002',
    userId: 'user_002',
    teamId: 'team_001',
    workoutType: 'cardio',
    completedAt: now - 3600,
    durationSeconds: 3600,
    distanceMeters: 10000,
    totalVolume: 0,
    personalRecords: ["10k_best_time"],
    feelingRating: 5,
    createdAt: now - 3600,
  },
];

const workoutReactionsData: NewWorkoutReaction[] = [
  {
    id: 'wr_001',
    workoutId: 'cw_001',
    userId: 'user_002',
    userName: 'Jane Doe',
    reactionType: 'fire',
    createdAt: now - 1700,
  },
  {
    id: 'wr_002',
    workoutId: 'cw_002',
    userId: 'user_003',
    userName: 'Dave Smith',
    reactionType: 'strong',
    createdAt: now - 3500,
  },
];

const coachingConversationsData: NewCoachConversation[] = [
  {
    id: 'conv_001',
    userId: 'user_001',
    contextJson: {
      currentStreak: 15,
      recentWorkouts: ['cw_001'],
      goals: ['increase_volume'],
    },
    totalMessages: 5,
    totalUserMessages: 3,
    totalCoachMessages: 2,
    lastMessageAt: now - 1800,
    startedAt: now - 7200,
  },
  {
    id: 'conv_002',
    userId: 'user_002',
    contextJson: {
      currentStreak: 8,
      recentWorkouts: ['cw_002'],
      goals: ['improve_endurance'],
    },
    totalMessages: 3,
    totalUserMessages: 2,
    totalCoachMessages: 1,
    lastMessageAt: now - 3600,
    startedAt: now - 14400,
  },
];

const coachingMessagesData: NewCoachMsg[] = [
  {
    id: 'cm_001',
    conversationId: 'conv_001',
    role: 'user',
    content: 'How can I safely increase the weight on my squats?',
    createdAt: now - 7000,
  },
  {
    id: 'cm_002',
    conversationId: 'conv_001',
    role: 'assistant',
    content:
      'Based on your form, I recommend increasing by 2.5kg increments and focusing on the eccentric phase.',
    createdAt: now - 6800,
  },
  {
    id: 'cm_003',
    conversationId: 'conv_002',
    role: 'user',
    content: 'I feel like my endurance could be better. Any tips?',
    createdAt: now - 14000,
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
    createdAt: now - 3600,
    respondedAt: now - 3500,
  },
  {
    id: 'ci_002',
    conversationId: 'conv_002',
    type: 'scheduled',
    triggeredBy: 'weekly_review',
    question: 'Weekly check-in: How did your training go this week?',
    userResponse: null,
    status: 'pending',
    createdAt: now - 10800,
    respondedAt: null,
  },
];

const connectedServicesData: NewConnectedService[] = [
  {
    id: 'cs_001',
    userId: 'user_001',
    serviceType: 'strava',
    accessTokenEncrypted: 'encrypted_fake_token',
    refreshTokenEncrypted: 'encrypted_fake_refresh',
    serviceUserId: 'strava_user_001',
    lastSyncAt: now - 7200,
    createdAt: now - 86400,
    updatedAt: now - 7200,
  },
  {
    id: 'cs_002',
    userId: 'user_002',
    serviceType: 'garmin',
    accessTokenEncrypted: 'encrypted_fake_token2',
    refreshTokenEncrypted: 'encrypted_fake_refresh2',
    serviceUserId: 'garmin_user_002',
    lastSyncAt: now - 3600,
    createdAt: now - 172800,
    updatedAt: now - 3600,
  },
];

const integrationSyncLogsData: NewIntegrationSyncLog[] = [
  {
    id: 'isl_001',
    userId: 'user_001',
    serviceType: 'strava',
    syncStartedAt: now - 7200,
    syncCompletedAt: now - 7100,
    status: 'success',
    workoutsSyncedCount: 2,
    createdAt: now - 7200,
  },
  {
    id: 'isl_002',
    userId: 'user_002',
    serviceType: 'garmin',
    syncStartedAt: now - 3600,
    syncCompletedAt: now - 3550,
    status: 'success',
    workoutsSyncedCount: 1,
    createdAt: now - 3600,
  },
];

const activeFitnessPlansData: NewActiveFitnessPlan[] = [
  {
    id: 'afp_001',
    userId: 'user_001',
    title: 'Strength Building Phase',
    description: 'Focus on compound lifts and progressive overload',
    planType: 'strength_program',
    templateId: 'plan_001',
    goalsJson: { focus: 'strength', target: 'increase_5rm' },
    progressionJson: { type: 'linear_periodization', intensity: 'progressive' },
    constraintsJson: { availability: ['Mon', 'Wed', 'Fri'], maxHoursPerWeek: 6 },
    currentPositionJson: { week: 3, day: 2 },
    status: 'active',
    completedWorkouts: 12,
    totalScheduledWorkouts: 36,
    startDate: now - 172800,
    endDate: now + 1209600, // 2 weeks in the future
    createdAt: now - 172800,
    updatedAt: now - 3600,
  },
  {
    id: 'afp_002',
    userId: 'user_002',
    title: 'Marathon Training Plan',
    description: '18-week plan to prepare for a marathon',
    planType: 'event_training',
    templateId: 'plan_002',
    goalsJson: { focus: 'endurance', target: 'finish_under_4_hours' },
    progressionJson: { type: 'pyramidal', intensity: 'periodized' },
    constraintsJson: { availability: ['Tue', 'Thu', 'Sat'], maxHoursPerWeek: 10 },
    currentPositionJson: { week: 8, day: 4 },
    status: 'active',
    completedWorkouts: 52,
    totalScheduledWorkouts: 144,
    startDate: now - 259200,
    endDate: now + 604800, // 1 week in the future
    createdAt: now - 259200,
    updatedAt: now - 7200,
  },
];

const weeklySchedulesData: NewWeeklySchedule[] = [
  {
    id: 'ws_001',
    planId: 'afp_001',
    weekNumber: 3,
    startDate: now - 259200, // Beginning of week 3
    endDate: now - 200800, // End of week 3
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
    createdAt: now - 259200,
    updatedAt: now - 259200,
  },
  {
    id: 'ws_002',
    planId: 'afp_002',
    weekNumber: 8,
    startDate: now - 172800, // Beginning of week 8
    endDate: now - 114400, // End of week 8
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
    createdAt: now - 172800,
    updatedAt: now - 172800,
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
    createdAt: now - 518400,
    updatedAt: now - 518000,
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
    createdAt: now - 172800,
    updatedAt: now - 172400,
  },
];

/**
 * Seeds the User Base database using Drizzle ORM and Durable Object Storage.
 * @param storage - The DurableObjectStorage instance to seed
 */
export async function seedUserBase(storage: DurableObjectStorage) {
  console.log('🌱 Seeding User Base database with Drizzle ORM...');

  // Create the Drizzle client using the provided storage
  const db = createDOClient(storage);

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
    console.log(`  - Inserting ${profilesData.length} profiles...`);
    await db.insert(profile).values(profilesData);

    console.log(`  - Inserting ${userStatsData.length} user stats...`);
    await db.insert(userStats).values(userStatsData);

    console.log(`  - Inserting ${achievementsData.length} achievements...`);
    await db.insert(achievements).values(achievementsData);

    console.log(`  - Inserting ${completedWorkoutsData.length} completed workouts...`);
    await db.insert(completedWorkouts).values(completedWorkoutsData);

    console.log(`  - Inserting ${workoutActivitiesData.length} workout activities...`);
    await db.insert(workoutActivities).values(workoutActivitiesData);

    console.log(`  - Inserting ${workoutMetadataData.length} workout metadata...`);
    await db.insert(workoutMetadata).values(workoutMetadataData);

    console.log(`  - Inserting ${workoutReactionsData.length} workout reactions...`);
    await db.insert(workoutReactions).values(workoutReactionsData);

    console.log(
      `  - Inserting ${coachingConversationsData.length} coaching conversations...`,
    );
    await db.insert(coachingConversation).values(coachingConversationsData);

    console.log(`  - Inserting ${coachingMessagesData.length} coaching messages...`);
    await db.insert(coachingMessages).values(coachingMessagesData);

    console.log(`  - Inserting ${checkInsData.length} check-ins...`);
    await db.insert(checkIns).values(checkInsData);

    console.log(`  - Inserting ${connectedServicesData.length} connected services...`);
    await db.insert(connectedServices).values(connectedServicesData);

    console.log(`  - Inserting ${integrationSyncLogsData.length} integration sync logs...`);
    await db.insert(integrationSyncLog).values(integrationSyncLogsData);

    console.log(`  - Inserting ${activeFitnessPlansData.length} active fitness plans...`);
    await db.insert(activeFitnessPlan).values(activeFitnessPlansData);

    console.log(`  - Inserting ${weeklySchedulesData.length} weekly schedules...`);
    await db.insert(weeklySchedules).values(weeklySchedulesData);

    console.log(`  - Inserting ${workoutTemplatesData.length} workout templates...`);
    await db.insert(workoutTemplates).values(workoutTemplatesData);

    console.log('✅ User Base database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding User Base database:', error);
    throw error;
  }
}
