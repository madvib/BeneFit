import type {
  GetTodaysWorkoutResponse,
  GetUpcomingWorkoutsResponse,
  GetWorkoutHistoryResponse,
  StartWorkoutResponse,
} from './use-workouts';

export type WorkoutSession = StartWorkoutResponse['session'];
export type WorkoutActivity = WorkoutSession['activities'][number];
export type WorkoutActivityType = WorkoutActivity['type'];
export type WorkoutActivityStructure = NonNullable<WorkoutActivity['structure']>;
export type Exercise = NonNullable<WorkoutActivityStructure['exercises']>[number];

export type TodaysWorkoutTemplate = NonNullable<GetTodaysWorkoutResponse['workout']>;
export type UpcomingWorkoutTemplate = GetUpcomingWorkoutsResponse['workouts'][number];
export type DailyWorkout = TodaysWorkoutTemplate | UpcomingWorkoutTemplate;
export type WorkoutTemplate = DailyWorkout;

export type CompletedWorkout = GetWorkoutHistoryResponse['workouts'][number];
export type WorkoutPerformance = CompletedWorkout['performance'];
export type ActivityPerformance = WorkoutPerformance['activities'][number];
export type ExercisePerformance = NonNullable<ActivityPerformance['exercises']>[number];

export type SessionState = WorkoutSession['state'];
export type SessionFeedItem = WorkoutSession['activityFeed'][number];
export type LiveActivityProgress = WorkoutSession['liveProgress'];
export type SessionParticipant = WorkoutSession['participants'][number];
export type WorkoutType = WorkoutSession['workoutType'];
export type HeartRateData = NonNullable<WorkoutPerformance['heartRate']>;
export type DifficultyRating = WorkoutPerformance['difficultyRating'];
export type EnergyLevel = WorkoutPerformance['energyLevel'];
export type ActivityPerformanceStatus = ActivityPerformance['completed'];
