import { Entity, Result, Guard } from '@shared';
import { WorkoutTemplate } from '../workout-template/workout-template.deprecated.js';
import {
  ScheduleValidationError,
  ScheduleConflictError,
  WorkoutNotFoundError,
  ScheduleModificationError,
} from '../../../../errors/workout-plan-errors.js';

export interface WeeklyScheduleProps {
  weekNumber: number;
  planId: string;
  startDate: string;
  endDate: string;
  focus: string;
  targetWorkouts: number;
  notes?: string;
  workouts: WorkoutTemplate[];
  workoutsCompleted: number;
}

export class WeeklySchedule extends Entity<WeeklyScheduleProps> {
  private constructor(props: WeeklyScheduleProps, id: string) {
    super(props, id);
  }

  public static create(
    props: Omit<WeeklyScheduleProps, 'workoutsCompleted'> & { id: string }
  ): Result<WeeklySchedule> {
    const guardResult = Guard.combine([
      Guard.againstEmptyString(props.planId, 'planId'),
      Guard.againstEmptyString(props.focus, 'focus'),
      Guard.againstNullOrUndefined(props.weekNumber, 'weekNumber'),
    ]);

    if (guardResult.isFailure) {
      return Result.fail(guardResult.error);
    }

    if (props.weekNumber < 1) {
      return Result.fail(new ScheduleValidationError('Week number must be >= 1', { weekNumber: props.weekNumber }));
    }

    if (props.targetWorkouts < 0) {
      return Result.fail(new ScheduleValidationError('Target workouts must be >= 0', { targetWorkouts: props.targetWorkouts }));
    }

    // Validate date range
    const start = new Date(props.startDate);
    const end = new Date(props.endDate);
    if (start >= end) {
      return Result.fail(new ScheduleValidationError('Start date must be before end date', { startDate: props.startDate, endDate: props.endDate }));
    }

    return Result.ok(new WeeklySchedule({
      ...props,
      workoutsCompleted: 0,
    }, props.id));
  }

  public static fromPersistence(
    props: WeeklyScheduleProps,
    id: string
  ): Result<WeeklySchedule> {
    return Result.ok(new WeeklySchedule(props, id));
  }

  // Getters
  get weekNumber(): number {
    return this.props.weekNumber;
  }

  get planId(): string {
    return this.props.planId;
  }

  get focus(): string {
    return this.props.focus;
  }

  get targetWorkouts(): number {
    return this.props.targetWorkouts;
  }

  get completedWorkouts(): number {
    return this.props.workoutsCompleted;
  }

  get totalWorkouts(): number {
    return this.props.workouts.length;
  }

  get startDate(): string {
    return this.props.startDate;
  }

  get endDate(): string {
    return this.props.endDate;
  }

  // Commands
  public addWorkout(workout: WorkoutTemplate): Result<void> {
    // Validate workout belongs to this plan
    if (workout.planId !== this.props.planId) {
      return Result.fail(new ScheduleConflictError('Workout does not belong to this plan', { workoutPlanId: workout.planId, schedulePlanId: this.props.planId }));
    }

    // Validate workout is for this week
    if (workout.weekNumber !== this.props.weekNumber) {
      return Result.fail(new ScheduleConflictError(
        `Workout is for week ${ workout.weekNumber }, not week ${ this.props.weekNumber }`,
        { workoutWeek: workout.weekNumber, scheduleWeek: this.props.weekNumber }
      ));
    }

    // Validate day slot is available (0-6 for Sunday-Saturday)
    if (workout.dayOfWeek < 0 || workout.dayOfWeek > 6) {
      return Result.fail(new ScheduleValidationError('Day of week must be 0-6', { dayOfWeek: workout.dayOfWeek }));
    }

    // Check if day slot already has a workout
    const existingWorkout = this.props.workouts.find(
      w => w.dayOfWeek === workout.dayOfWeek
    );

    if (existingWorkout) {
      return Result.fail(new ScheduleConflictError(
        `Day ${ workout.dayOfWeek } already has a workout scheduled`,
        { dayOfWeek: workout.dayOfWeek, existingWorkoutId: existingWorkout.id, newWorkoutId: workout.id }
      ));
    }

    // Validate workout date is within week's range
    const workoutDate = new Date(workout.scheduledDate);
    const weekStart = new Date(this.props.startDate);
    const weekEnd = new Date(this.props.endDate);

    if (workoutDate < weekStart || workoutDate > weekEnd) {
      return Result.fail(new ScheduleValidationError(
        'Workout date must be within week range',
        { workoutDate: workout.scheduledDate, weekStart: this.props.startDate, weekEnd: this.props.endDate }
      ));
    }

    this.props.workouts.push(workout);
    return Result.ok();
  }

  public removeWorkout(workoutId: string): Result<void> {
    const index = this.props.workouts.findIndex(w => w.id === workoutId);

    if (index === -1) {
      return Result.fail(new WorkoutNotFoundError('Workout not found in this week', { workoutId, weekNumber: this.props.weekNumber }));
    }

    const workout = this.props.workouts[index];

    // Don't allow removing completed workouts
    if (workout?.isCompleted()) {
      return Result.fail(new ScheduleModificationError('Cannot remove completed workouts', { workoutId, workoutStatus: 'completed' }));
    }

    this.props.workouts.splice(index, 1);
    return Result.ok();
  }

  // Called by WorkoutPlan when workout is completed
  public incrementCompletedWorkouts(): void {
    this.props.workoutsCompleted++;
  }

  // Update focus/notes (AI coach adjustments)
  public updateFocus(focus: string): Result<void> {
    const guardResult = Guard.againstEmptyString(focus, 'focus');
    if (guardResult.isFailure) {
      return Result.fail(guardResult.error);
    }

    this.props.focus = focus;
    return Result.ok();
  }

  public updateNotes(notes: string): void {
    this.props.notes = notes;
  }

  // Queries
  public getWorkout(day: number): WorkoutTemplate | undefined {
    return this.props.workouts.find(w => w.dayOfWeek === day);
  }

  public findWorkout(workoutId: string): WorkoutTemplate | undefined {
    return this.props.workouts.find(w => w.id === workoutId);
  }

  public getScheduledWorkouts(): readonly WorkoutTemplate[] {
    return this.props.workouts.filter(w => !w.isCompleted() && !w.isSkipped());
  }

  public getCompletedWorkouts(): readonly WorkoutTemplate[] {
    return this.props.workouts.filter(w => w.isCompleted());
  }

  public getWorkoutsSortedByDay(): readonly WorkoutTemplate[] {
    return [...this.props.workouts].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  }

  public getCompletionRate(): number {
    if (this.props.workouts.length === 0) {
      return 0;
    }
    return this.props.workoutsCompleted / this.props.workouts.length;
  }

  public isComplete(): boolean {
    return this.props.workoutsCompleted >= this.props.targetWorkouts;
  }

  public hasWorkoutOnDay(day: number): boolean {
    return this.props.workouts.some(w => w.dayOfWeek === day);
  }

  // For AI coach to assess if week is going well
  public getWeekStatus(): {
    onTrack: boolean;
    completionRate: number;
    workoutsRemaining: number;
    daysRemaining: number;
  } {
    const now = new Date();
    const weekEnd = new Date(this.props.endDate);
    const daysRemaining = Math.max(0, Math.ceil((weekEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    const workoutsRemaining = Math.max(0, this.props.targetWorkouts - this.props.workoutsCompleted);
    const completionRate = this.getCompletionRate();

    // On track if we can reasonably complete remaining workouts
    const onTrack = daysRemaining === 0
      ? workoutsRemaining === 0
      : workoutsRemaining <= daysRemaining;

    return {
      onTrack,
      completionRate,
      workoutsRemaining,
      daysRemaining,
    };
  }

  // Bulk operations for AI adjustments
  public adjustAllWorkoutIntensity(
    adjustment: (workout: WorkoutTemplate) => Result<void>
  ): Result<void> {
    const futureWorkouts = this.props.workouts.filter(
      w => !w.isCompleted() && !w.isSkipped()
    );

    for (const workout of futureWorkouts) {
      const result = adjustment(workout);
      if (result.isFailure) {
        return Result.fail(new ScheduleModificationError(`Failed to adjust workout ${ workout.id }: ${ result.error }`));
      }
    }

    return Result.ok();
  }
}