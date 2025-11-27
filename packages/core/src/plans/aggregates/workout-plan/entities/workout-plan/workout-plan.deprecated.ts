import { Entity, Result, Guard } from '@shared';

import { WeeklySchedule } from '../weekly-schedule/weekly-schedule.deprecated.js';
import { WorkoutTemplate } from '../workout-template/workout-template.deprecated.js';
import {
  PlanStateError,
  PlanActivationError,
  PlanCompletionError,
  WorkoutNotFoundError,
} from '../../../../errors/workout-plan-errors.js';
import { PlanGoals } from '../../../../value-objects/plan-goals/plan-goals.types.js';
import { PlanPosition } from '../../../../value-objects/plan-position/plan-position.types.js';
import { ProgressionStrategy } from '../../../../value-objects/progression-strategy/progression-strategy.types.js';
import { TrainingConstraints } from '../../../../value-objects/training-constraints/training-constraints.types.js';

export type PlanType =
  | 'event_training'
  | 'habit_building'
  | 'strength_program'
  | 'general_fitness';
export type PlanStatus = 'draft' | 'active' | 'paused' | 'completed' | 'abandoned';

export interface WorkoutPlanProps {
  userId: string;
  title: string;
  description: string;
  planType: PlanType;
  goals: PlanGoals;
  progression: ProgressionStrategy;
  constraints: TrainingConstraints;
  weeks: WeeklySchedule[];
  status: PlanStatus;
  currentPosition: PlanPosition;
  startDate: string;
  endDate?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class WorkoutPlan extends Entity<WorkoutPlanProps> {
  private constructor(props: WorkoutPlanProps, id: string) {
    super(props, id);
  }

  public static createDraft(
    id: string,
    userId: string,
    title: string,
    description: string,
    planType: PlanType,
    goals: PlanGoals,
    progression: ProgressionStrategy,
    constraints: TrainingConstraints,
    startDate: string,
  ): Result<WorkoutPlan> {
    const guardResult = Guard.combine([
      Guard.againstEmptyString(title, 'title'),
      Guard.againstEmptyString(userId, 'userId'),
    ]);

    if (guardResult.isFailure) {
      return Result.fail(guardResult.error);
    }

    const initialPosition = PlanPosition.create({ week: 1, day: 0 });
    if (initialPosition.isFailure) {
      return Result.fail(initialPosition.error);
    }

    return Result.ok(
      new WorkoutPlan(
        {
          userId,
          title,
          description,
          planType,
          goals,
          progression,
          constraints,
          weeks: [],
          status: 'draft',
          currentPosition: initialPosition.value,
          startDate,
          createdAt: new Date(),
        },
        id,
      ),
    );
  }

  public static fromPersistence(
    props: WorkoutPlanProps,
    id: string,
  ): Result<WorkoutPlan> {
    return Result.ok(new WorkoutPlan(props, id));
  }

  // Getters - only expose what's needed
  get userId(): string {
    return this.props.userId;
  }

  get title(): string {
    return this.props.title;
  }

  get status(): PlanStatus {
    return this.props.status;
  }

  get currentPosition(): PlanPosition {
    return this.props.currentPosition;
  }

  // Commands
  public addWeek(week: WeeklySchedule): Result<void> {
    if (this.props.status === 'completed' || this.props.status === 'abandoned') {
      return Result.fail(
        new PlanStateError('Cannot modify completed or abandoned plan', {
          currentStatus: this.props.status,
          planId: this.id,
        }),
      );
    }

    const expectedWeekNumber = this.props.weeks.length + 1;
    if (week.weekNumber !== expectedWeekNumber) {
      return Result.fail(
        new PlanStateError(
          `Expected week ${expectedWeekNumber}, got ${week.weekNumber}`,
          { expectedWeekNumber, actualWeekNumber: week.weekNumber, planId: this.id },
        ),
      );
    }

    this.props.weeks.push(week);
    this.touch();

    return Result.ok();
  }

  public activate(): Result<void> {
    if (this.props.status !== 'draft') {
      return Result.fail(
        new PlanActivationError('Can only activate draft plans', {
          currentStatus: this.props.status,
          planId: this.id,
        }),
      );
    }

    if (this.props.weeks.length === 0) {
      return Result.fail(
        new PlanActivationError('Cannot activate plan with no weeks', {
          planId: this.id,
        }),
      );
    }

    this.props.status = 'active';
    this.touch();

    return Result.ok();
  }

  public completeWorkout(workoutId: string, completedWorkoutId: string): Result<void> {
    if (this.props.status !== 'active') {
      return Result.fail(
        new PlanCompletionError('Can only complete workouts in active plans', {
          currentStatus: this.props.status,
          planId: this.id,
        }),
      );
    }

    let foundWorkout: WorkoutTemplate | undefined;
    let foundWeek: WeeklySchedule | undefined;

    for (const week of this.props.weeks) {
      foundWorkout = week.findWorkout(workoutId);
      if (foundWorkout) {
        foundWeek = week;
        break;
      }
    }

    if (!foundWorkout) {
      return Result.fail(
        new WorkoutNotFoundError('Workout not found in plan', {
          workoutId,
          planId: this.id,
        }),
      );
    }

    const result = foundWorkout.markComplete(completedWorkoutId);
    if (result.isFailure) {
      return result;
    }

    foundWeek!.incrementCompletedWorkouts();
    this.touch();

    return Result.ok();
  }

  public advanceDay(): Result<void> {
    if (this.props.status !== 'active') {
      return Result.fail(
        new PlanStateError('Can only advance active plans', {
          currentStatus: this.props.status,
          planId: this.id,
        }),
      );
    }

    const nextPosition = this.props.currentPosition.advanceDay();
    const nextWeek = this.props.weeks.find((w) => w.weekNumber === nextPosition.week);

    if (!nextWeek) {
      this.props.status = 'completed';
      this.props.endDate = new Date().toISOString();
      this.touch();
      return Result.ok();
    }

    this.props.currentPosition = nextPosition;
    this.touch();

    return Result.ok();
  }

  // Queries
  public getCurrentWorkout(): WorkoutTemplate | undefined {
    const currentWeek = this.props.weeks.find(
      (w) => w.weekNumber === this.props.currentPosition.week,
    );
    return currentWeek?.getWorkout(this.props.currentPosition.day);
  }

  public getCurrentWeek(): WeeklySchedule | undefined {
    return this.props.weeks.find(
      (w) => w.weekNumber === this.props.currentPosition.week,
    );
  }

  public getWeek(weekNumber: number): WeeklySchedule | undefined {
    return this.props.weeks.find((w) => w.weekNumber === weekNumber);
  }

  public isComplete(): boolean {
    return this.props.status === 'completed';
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
