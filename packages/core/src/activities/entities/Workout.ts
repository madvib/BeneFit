import { Entity, Result } from '@bene/core/shared';

export type WorkoutType =
  | 'Running'
  | 'Weight Training'
  | 'Cylcing'
  | 'Swimming'
  | 'HIIT'
  | 'Yoga'
  | 'Rowing';

interface WorkoutProps {
  date: string;
  type: WorkoutType;
  duration: string;
  calories: number;
  distance?: string;
  sets?: number;
  laps?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Workout entity
 */
export class Workout extends Entity<WorkoutProps> {
  private constructor(props: WorkoutProps, id: string) {
    super(props, id);
  }

  static create(
    props: Omit<WorkoutProps, 'createdAt'> & { id: string },
  ): Result<Workout> {
    const { id, date, type, duration, calories, distance, sets, laps } = props;

    // Validate required fields
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return Result.fail(new Error('ID is required and must be a non-empty string'));
    }

    if (!date || typeof date !== 'string') {
      return Result.fail(new Error('Date is required and must be a string'));
    }

    if (!type || typeof type !== 'string') {
      return Result.fail(new Error('Type is required and must be a string'));
    }

    if (!duration || typeof duration !== 'string') {
      return Result.fail(new Error('Duration is required and must be a string'));
    }

    if (typeof calories !== 'number' || calories < 0) {
      return Result.fail(new Error('Calories must be a non-negative number'));
    }

    if (distance !== undefined && typeof distance !== 'string') {
      return Result.fail(new Error('Distance must be a string if provided'));
    }

    if (sets !== undefined && (typeof sets !== 'number' || sets < 0)) {
      return Result.fail(new Error('Sets must be a non-negative number if provided'));
    }

    if (laps !== undefined && (typeof laps !== 'number' || laps < 0)) {
      return Result.fail(new Error('Laps must be a non-negative number if provided'));
    }

    return Result.ok(
      new Workout(
        {
          ...props,
          isActive: true,
          createdAt: new Date(),
        },
        id,
      ),
    );
  }

  // Getters
  get date(): string {
    return this.props.date;
  }

  get type(): string {
    return this.props.type;
  }

  get duration(): string {
    return this.props.duration;
  }

  get calories(): number {
    return this.props.calories;
  }

  get distance(): string | undefined {
    return this.props.distance;
  }

  get sets(): number | undefined {
    return this.props.sets;
  }

  get laps(): number | undefined {
    return this.props.laps;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  // Business logic methods
  deactivate(): void {
    this.props.isActive = false;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
