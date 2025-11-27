import { Entity, Result, Guard } from '@shared';
import { WorkoutActivity } from '../../value-objects/workout-activity/workout-activity.js';
import { WorkoutGoals } from '../../value-objects/workout-goals/workout-goals.js';
import {
  WorkoutTemplateValidationError,
  WorkoutStateTransitionError,
  WorkoutModificationError,
  WorkoutActivityError,
} from '../../../../errors/workout-plan-errors.js';

export type WorkoutType =
  | 'running'
  | 'cycling'
  | 'swimming'
  | 'strength'
  | 'hiit'
  | 'yoga'
  | 'pilates'
  | 'walking'
  | 'rest'
  | 'stretching'
  | 'sports'
  | 'cross_training'
  | 'custom';

export type WorkoutCategory =
  | 'cardio'
  | 'strength'
  | 'flexibility'
  | 'recovery'
  | 'skill'
  | 'mixed';

export type WorkoutStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'skipped'
  | 'rescheduled';

export type WorkoutImportance =
  | 'optional'
  | 'recommended'
  | 'key'
  | 'critical';

export interface WorkoutAlternative {
  reason: string;
  activities: WorkoutActivity[];
}

export interface WorkoutTemplateProps {
  planId: string;
  weekNumber: number;
  dayOfWeek: number;
  scheduledDate: string;
  title: string;
  type: WorkoutType;
  category: WorkoutCategory;
  goals: WorkoutGoals;
  activities: WorkoutActivity[];
  status: WorkoutStatus;
  completedWorkoutId?: string;
  userNotes?: string;
  rescheduledTo?: string;
  coachNotes?: string;
  importance: WorkoutImportance;
  alternatives?: WorkoutAlternative[];
}

export class WorkoutTemplate extends Entity<WorkoutTemplateProps> {
  private constructor(props: WorkoutTemplateProps, id: string) {
    super(props, id);
  }

  public static create(
    props: Omit<WorkoutTemplateProps, 'status'> & { id: string }
  ): Result<WorkoutTemplate> {
    const guardResult = Guard.combine([
      Guard.againstEmptyString(props.title, 'title'),
      Guard.againstEmptyString(props.planId, 'planId'),
      Guard.againstNullOrUndefined(props.type, 'type'),
      Guard.againstNullOrUndefined(props.category, 'category'),
      Guard.againstNullOrUndefined(props.weekNumber, 'weekNumber'),
      Guard.againstNullOrUndefined(props.dayOfWeek, 'dayOfWeek'),
    ]);

    if (guardResult.isFailure) {
      return Result.fail(guardResult.error);
    }

    // Validate day of week
    if (props.dayOfWeek < 0 || props.dayOfWeek > 6) {
      return Result.fail(new WorkoutTemplateValidationError('Day of week must be 0-6', { dayOfWeek: props.dayOfWeek }));
    }

    // Validate week number
    if (props.weekNumber < 1) {
      return Result.fail(new WorkoutTemplateValidationError('Week number must be >= 1', { weekNumber: props.weekNumber }));
    }

    // Validate activities array is not empty (unless it's a rest day)
    if (props.type !== 'rest' && props.activities.length === 0) {
      return Result.fail(new WorkoutTemplateValidationError('Non-rest workouts must have at least one activity', { type: props.type }));
    }

    // Validate scheduled date
    try {
      new Date(props.scheduledDate);
    } catch {
      return Result.fail(new WorkoutTemplateValidationError('Invalid scheduled date', { scheduledDate: props.scheduledDate }));
    }

    return Result.ok(new WorkoutTemplate({
      ...props,
      status: 'scheduled',
    }, props.id));
  }

  public static fromPersistence(
    props: WorkoutTemplateProps,
    id: string
  ): Result<WorkoutTemplate> {
    return Result.ok(new WorkoutTemplate(props, id));
  }

  // Getters
  get planId(): string {
    return this.props.planId;
  }

  get weekNumber(): number {
    return this.props.weekNumber;
  }

  get dayOfWeek(): number {
    return this.props.dayOfWeek;
  }

  get scheduledDate(): string {
    return this.props.scheduledDate;
  }

  get title(): string {
    return this.props.title;
  }

  get type(): WorkoutType {
    return this.props.type;
  }

  get category(): WorkoutCategory {
    return this.props.category;
  }

  get status(): WorkoutStatus {
    return this.props.status;
  }

  get importance(): WorkoutImportance {
    return this.props.importance;
  }

  get goals(): WorkoutGoals {
    return this.props.goals;
  }

  get completedWorkoutId(): string | undefined {
    return this.props.completedWorkoutId;
  }

  // Commands - State Transitions

  public start(): Result<void> {
    // Can only start scheduled workouts
    if (this.props.status !== 'scheduled') {
      return Result.fail(new WorkoutStateTransitionError(
        `Cannot start workout with status: ${ this.props.status }`,
        { currentStatus: this.props.status, workoutId: this.id }
      ));
    }

    // Check if workout is in the past (more than a day late)
    const scheduled = new Date(this.props.scheduledDate);
    const now = new Date();
    const daysDiff = (now.getTime() - scheduled.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff > 7) {
      return Result.fail(new WorkoutTemplateValidationError(
        'Cannot start workout more than 7 days late',
        { daysDiff, scheduledDate: this.props.scheduledDate }
      ));
    }

    this.props.status = 'in_progress';
    return Result.ok();
  }

  public markComplete(completedWorkoutId: string): Result<void> {
    const guardResult = Guard.againstEmptyString(completedWorkoutId, 'completedWorkoutId');
    if (guardResult.isFailure) {
      return Result.fail(guardResult.error);
    }

    // Can complete from scheduled or in_progress
    if (this.props.status !== 'scheduled' && this.props.status !== 'in_progress') {
      return Result.fail(new WorkoutStateTransitionError(
        `Cannot complete workout with status: ${ this.props.status }`,
        { currentStatus: this.props.status, workoutId: this.id }
      ));
    }

    this.props.status = 'completed';
    this.props.completedWorkoutId = completedWorkoutId;

    return Result.ok();
  }

  public skip(reason: string): Result<void> {
    const guardResult = Guard.againstEmptyString(reason, 'reason');
    if (guardResult.isFailure) {
      return Result.fail(guardResult.error);
    }

    // Can only skip scheduled workouts
    if (this.props.status !== 'scheduled') {
      return Result.fail(new WorkoutStateTransitionError(
        `Cannot skip workout with status: ${ this.props.status }`,
        { currentStatus: this.props.status, workoutId: this.id }
      ));
    }

    this.props.status = 'skipped';
    this.props.userNotes = reason;

    return Result.ok();
  }

  public reschedule(newDate: string): Result<void> {
    const guardResult = Guard.againstEmptyString(newDate, 'newDate');
    if (guardResult.isFailure) {
      return Result.fail(guardResult.error);
    }

    // Can only reschedule scheduled workouts
    if (this.props.status !== 'scheduled') {
      return Result.fail(new WorkoutStateTransitionError(
        `Cannot reschedule workout with status: ${ this.props.status }`,
        { currentStatus: this.props.status, workoutId: this.id }
      ));
    }

    // Validate new date
    let rescheduleDate: Date;
    try {
      rescheduleDate = new Date(newDate);
    } catch {
      return Result.fail(new WorkoutTemplateValidationError('Invalid reschedule date', { newDate }));
    }

    // Can't reschedule to the past
    const now = new Date();
    if (rescheduleDate < now) {
      return Result.fail(new WorkoutTemplateValidationError('Cannot reschedule to a past date', { newDate, currentDate: now.toISOString() }));
    }

    this.props.status = 'rescheduled';
    this.props.rescheduledTo = newDate;

    return Result.ok();
  }

  // Modifications (AI coach adjustments)

  public updateGoals(newGoals: WorkoutGoals): Result<void> {
    // Can only modify future workouts
    if (this.props.status !== 'scheduled') {
      return Result.fail(new WorkoutModificationError('Can only modify scheduled workouts', { currentStatus: this.props.status, workoutId: this.id }));
    }

    this.props.goals = newGoals;
    return Result.ok();
  }

  public updateActivities(newActivities: WorkoutActivity[]): Result<void> {
    if (this.props.status !== 'scheduled') {
      return Result.fail(new WorkoutModificationError('Can only modify scheduled workouts', { currentStatus: this.props.status, workoutId: this.id }));
    }

    if (this.props.type !== 'rest' && newActivities.length === 0) {
      return Result.fail(new WorkoutTemplateValidationError('Non-rest workouts must have at least one activity', { type: this.props.type }));
    }

    this.props.activities = newActivities;
    return Result.ok();
  }

  public addActivity(activity: WorkoutActivity): Result<void> {
    if (this.props.status !== 'scheduled') {
      return Result.fail(new WorkoutModificationError('Can only modify scheduled workouts', { currentStatus: this.props.status, workoutId: this.id }));
    }

    this.props.activities.push(activity);
    return Result.ok();
  }

  public removeActivity(activityOrder: number): Result<void> {
    if (this.props.status !== 'scheduled') {
      return Result.fail(new WorkoutModificationError('Can only modify scheduled workouts', { currentStatus: this.props.status, workoutId: this.id }));
    }

    const index = this.props.activities.findIndex(a => a.order === activityOrder);
    if (index === -1) {
      return Result.fail(new WorkoutActivityError('Activity not found', { activityOrder, workoutId: this.id }));
    }

    this.props.activities.splice(index, 1);
    return Result.ok();
  }

  public setCoachNotes(notes: string): void {
    this.props.coachNotes = notes;
  }

  public addUserNotes(notes: string): void {
    if (this.props.userNotes) {
      this.props.userNotes += '\n' + notes;
    } else {
      this.props.userNotes = notes;
    }
  }

  public setImportance(importance: WorkoutImportance): void {
    this.props.importance = importance;
  }

  // For AI coach to reduce intensity
  public reduceIntensity(factor: number): Result<void> {
    if (factor <= 0 || factor > 1) {
      return Result.fail(new WorkoutTemplateValidationError('Intensity factor must be between 0 and 1', { factor }));
    }

    if (this.props.status !== 'scheduled') {
      return Result.fail(new WorkoutModificationError('Can only modify scheduled workouts', { currentStatus: this.props.status, workoutId: this.id }));
    }

    // Update goals with reduced intensity
    const adjustedGoalsResult = this.props.goals.adjustIntensity(factor);
    if (adjustedGoalsResult.isFailure) {
      return Result.fail(adjustedGoalsResult.error);
    }

    this.props.goals = adjustedGoalsResult.value;
    return Result.ok();
  }

  public addAlternative(alternative: WorkoutAlternative): Result<void> {
    const guardResult = Guard.againstEmptyString(alternative.reason, 'reason');
    if (guardResult.isFailure) {
      return Result.fail(guardResult.error);
    }

    if (alternative.activities.length === 0) {
      return Result.fail(new WorkoutTemplateValidationError('Alternative must have at least one activity', { reason: alternative.reason }));
    }

    if (!this.props.alternatives) {
      this.props.alternatives = [];
    }

    this.props.alternatives.push(alternative);
    return Result.ok();
  }

  // Queries

  public getActivities(): readonly WorkoutActivity[] {
    return this.props.activities;
  }

  public getAlternatives(): readonly WorkoutAlternative[] | undefined {
    return this.props.alternatives;
  }

  public isCompleted(): boolean {
    return this.props.status === 'completed';
  }

  public isSkipped(): boolean {
    return this.props.status === 'skipped';
  }

  public isScheduled(): boolean {
    return this.props.status === 'scheduled';
  }

  public isInProgress(): boolean {
    return this.props.status === 'in_progress';
  }

  public isPastDue(): boolean {
    if (this.props.status !== 'scheduled') {
      return false;
    }

    const scheduled = new Date(this.props.scheduledDate);
    const now = new Date();

    return now > scheduled;
  }

  public getDaysUntilScheduled(): number {
    const scheduled = new Date(this.props.scheduledDate);
    const now = new Date();
    const diff = scheduled.getTime() - now.getTime();

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  public canBeModified(): boolean {
    return this.props.status === 'scheduled';
  }

  public requiresEquipment(): boolean {
    return this.props.activities.some(activity =>
      activity.equipment && activity.equipment.length > 0
    );
  }

  public getEstimatedDuration(): number {
    // Sum duration from all activities
    return this.props.activities.reduce((total, activity) => {
      return total + (activity.duration || 0);
    }, 0);
  }

  public matchesType(type: WorkoutType): boolean {
    return this.props.type === type;
  }

  public matchesCategory(category: WorkoutCategory): boolean {
    return this.props.category === category;
  }

  // For displaying to user
  public getDisplayInfo(): {
    title: string;
    type: WorkoutType;
    status: WorkoutStatus;
    scheduledDate: string;
    importance: WorkoutImportance;
    estimatedDuration: number;
    isPastDue: boolean;
  } {
    return {
      title: this.props.title,
      type: this.props.type,
      status: this.props.status,
      scheduledDate: this.props.scheduledDate,
      importance: this.props.importance,
      estimatedDuration: this.getEstimatedDuration(),
      isPastDue: this.isPastDue(),
    };
  }
}