
import { StructureValidationError } from '../../../plans/errors/workout-plan-errors.js';
import { ValueObject, Result, Guard } from '@shared';
export type IntensityLevel = 'easy' | 'moderate' | 'hard' | 'sprint';

export interface Interval {
  readonly duration: number; // seconds
  readonly intensity: IntensityLevel;
  readonly rest: number; // seconds
}

export interface Exercise {
  readonly name: string;
  readonly sets: number;
  readonly reps?: number | string; // number or "to failure"
  readonly weight?: number; // kg or lbs
  readonly duration?: number; // seconds for holds/timed exercises
  readonly rest: number; // seconds between sets
  readonly notes?: string;
}

export interface ActivityStructureProps {
  readonly intervals?: readonly Interval[];
  readonly rounds?: number;
  readonly exercises?: readonly Exercise[];
}

export class ActivityStructure extends ValueObject<ActivityStructureProps> {
  private constructor(props: ActivityStructureProps) {
    super(props);
  }

  public static create(props: ActivityStructureProps): Result<ActivityStructure> {
    // Validation
    if (props.intervals) {
      for (const interval of props.intervals) {
        if (interval.duration <= 0) {
          return Result.fail(new StructureValidationError('Interval duration must be positive', { duration: interval.duration }));
        }
        if (interval.rest < 0) {
          return Result.fail(new StructureValidationError('Interval rest cannot be negative', { rest: interval.rest }));
        }
      }
    }

    if (props.exercises) {
      for (const exercise of props.exercises) {
        const guardResult = Guard.againstEmptyString(exercise.name, 'exercise name');
        if (guardResult.isFailure) {
          return Result.fail(guardResult.error);
        }

        if (exercise.sets <= 0) {
          return Result.fail(new StructureValidationError('Exercise sets must be positive', { exerciseName: exercise.name, sets: exercise.sets }));
        }

        if (exercise.rest < 0) {
          return Result.fail(new StructureValidationError('Exercise rest cannot be negative', { exerciseName: exercise.name, rest: exercise.rest }));
        }

        if (exercise.weight !== undefined && exercise.weight < 0) {
          return Result.fail(new StructureValidationError('Exercise weight cannot be negative', { exerciseName: exercise.name, weight: exercise.weight }));
        }
      }
    }

    if (props.rounds !== undefined && props.rounds <= 0) {
      return Result.fail(new StructureValidationError('Rounds must be positive', { rounds: props.rounds }));
    }

    // Can't have both intervals and exercises
    if (props.intervals && props.exercises) {
      return Result.fail(new StructureValidationError('Activity structure cannot have both intervals and exercises'));
    }

    return Result.ok(new ActivityStructure(props));
  }

  public static createEmpty(): ActivityStructure {
    return new ActivityStructure({});
  }

  public static createIntervals(intervals: Interval[], rounds?: number): Result<ActivityStructure> {
    return ActivityStructure.create({ intervals, rounds });
  }

  public static createExercises(exercises: Exercise[], rounds?: number): Result<ActivityStructure> {
    return ActivityStructure.create({ exercises, rounds });
  }

  // Getters
  get intervals(): readonly Interval[] | undefined {
    return this.props.intervals;
  }

  get rounds(): number | undefined {
    return this.props.rounds;
  }

  get exercises(): readonly Exercise[] | undefined {
    return this.props.exercises;
  }

  // Type checking
  public isIntervalBased(): boolean {
    return this.props.intervals !== undefined && this.props.intervals.length > 0;
  }

  public isExerciseBased(): boolean {
    return this.props.exercises !== undefined && this.props.exercises.length > 0;
  }

  public isEmpty(): boolean {
    return !this.isIntervalBased() && !this.isExerciseBased();
  }

  // Calculations
  public getTotalDuration(): number {
    if (this.isIntervalBased()) {
      const singleRoundDuration = this.props.intervals!.reduce(
        (total, interval) => total + interval.duration + interval.rest,
        0
      );
      return singleRoundDuration * (this.props.rounds || 1);
    }

    if (this.isExerciseBased()) {
      const singleRoundDuration = this.props.exercises!.reduce((total, exercise) => {
        const exerciseDuration = exercise.duration
          ? exercise.duration * exercise.sets
          : 0; // If no duration, assume it's rep-based and we don't know time
        const totalRest = exercise.rest * (exercise.sets - 1);
        return total + exerciseDuration + totalRest;
      }, 0);
      return singleRoundDuration * (this.props.rounds || 1);
    }

    return 0;
  }

  public getTotalSets(): number {
    if (!this.isExerciseBased()) {
      return 0;
    }

    return this.props.exercises!.reduce(
      (total, exercise) => total + exercise.sets,
      0
    ) * (this.props.rounds || 1);
  }

  // Transformations - Return new instances (immutable)

  public withAdjustedDuration(durationAdjustment: number): ActivityStructure {
    if (this.isIntervalBased()) {
      const adjustedIntervals = this.props.intervals!.map(interval => ({
        ...interval,
        duration: Math.max(1, Math.round(interval.duration * durationAdjustment)),
      }));

      return new ActivityStructure({
        ...this.props,
        intervals: adjustedIntervals,
      });
    }

    if (this.isExerciseBased()) {
      const adjustedExercises = this.props.exercises!.map(exercise => ({
        ...exercise,
        duration: exercise.duration
          ? Math.max(1, Math.round(exercise.duration * durationAdjustment))
          : undefined,
      }));

      return new ActivityStructure({
        ...this.props,
        exercises: adjustedExercises,
      });
    }

    return this;
  }

  public withAdjustedIntensity(intensityFactor: number): ActivityStructure {
    if (intensityFactor <= 0 || intensityFactor > 2) {
      return this; // Invalid factor, return unchanged
    }

    if (this.isIntervalBased()) {
      const adjustedIntervals = this.props.intervals!.map(interval => {
        // Reduce intensity by increasing rest or reducing work time
        if (intensityFactor < 1) {
          // Easier: increase rest
          return {
            ...interval,
            rest: Math.round(interval.rest / intensityFactor),
          };
        } else {
          // Harder: decrease rest
          return {
            ...interval,
            rest: Math.max(0, Math.round(interval.rest * (2 - intensityFactor))),
          };
        }
      });

      return new ActivityStructure({
        ...this.props,
        intervals: adjustedIntervals,
      });
    }

    if (this.isExerciseBased()) {
      const adjustedExercises = this.props.exercises!.map(exercise => {
        // Adjust weight if present
        if (exercise.weight !== undefined) {
          return {
            ...exercise,
            weight: Math.round(exercise.weight * intensityFactor * 10) / 10, // Round to 1 decimal
          };
        }
        // Adjust reps if numeric
        if (typeof exercise.reps === 'number') {
          return {
            ...exercise,
            reps: Math.max(1, Math.round(exercise.reps * intensityFactor)),
          };
        }
        return exercise;
      });

      return new ActivityStructure({
        ...this.props,
        exercises: adjustedExercises,
      });
    }

    return this;
  }

  public withAdditionalRounds(additionalRounds: number): ActivityStructure {
    if (additionalRounds < 0) {
      return this;
    }

    const currentRounds = this.props.rounds || 1;
    return new ActivityStructure({
      ...this.props,
      rounds: currentRounds + additionalRounds,
    });
  }

  public withFewerRounds(rounds: number): ActivityStructure {
    if (rounds <= 0) {
      return this;
    }

    return new ActivityStructure({
      ...this.props,
      rounds: Math.min(rounds, this.props.rounds || 1),
    });
  }

  public withIncreasedRest(restMultiplier: number): ActivityStructure {
    if (restMultiplier <= 0) {
      return this;
    }

    if (this.isIntervalBased()) {
      const adjustedIntervals = this.props.intervals!.map(interval => ({
        ...interval,
        rest: Math.round(interval.rest * restMultiplier),
      }));

      return new ActivityStructure({
        ...this.props,
        intervals: adjustedIntervals,
      });
    }

    if (this.isExerciseBased()) {
      const adjustedExercises = this.props.exercises!.map(exercise => ({
        ...exercise,
        rest: Math.round(exercise.rest * restMultiplier),
      }));

      return new ActivityStructure({
        ...this.props,
        exercises: adjustedExercises,
      });
    }

    return this;
  }

  // Query methods
  public getAverageIntensity(): number {
    if (this.isIntervalBased()) {
      const intensityMap: Record<IntensityLevel, number> = {
        easy: 1,
        moderate: 2,
        hard: 3,
        sprint: 4,
      };

      const totalIntensity = this.props.intervals!.reduce(
        (sum, interval) => sum + intensityMap[interval.intensity],
        0
      );

      return totalIntensity / this.props.intervals!.length;
    }

    return 2; // Default moderate
  }

  public requiresEquipment(): boolean {
    if (!this.isExerciseBased()) {
      return false;
    }

    // Simple heuristic: if weight is specified, likely needs equipment
    return this.props.exercises!.some(exercise => exercise.weight !== undefined);
  }

  // Display helpers
  public getDescription(): string {
    if (this.isIntervalBased()) {
      const rounds = this.props.rounds || 1;
      const intervalCount = this.props.intervals!.length;
      return `${ rounds } round${ rounds > 1 ? 's' : '' } of ${ intervalCount } interval${ intervalCount > 1 ? 's' : '' }`;
    }

    if (this.isExerciseBased()) {
      const rounds = this.props.rounds || 1;
      const exerciseCount = this.props.exercises!.length;
      return `${ rounds } round${ rounds > 1 ? 's' : '' } of ${ exerciseCount } exercise${ exerciseCount > 1 ? 's' : '' }`;
    }

    return 'No structure defined';
  }

  // Equality
  public override equals(other: ActivityStructure): boolean {
    if (!other) return false;

    // Deep comparison
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }
}