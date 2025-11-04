import { Entity, Result } from '@bene/core/shared';

interface PlanProps {
  name: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  progress: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Plan entity representing workout plans
 */
export class Plan extends Entity<PlanProps> {
  private constructor(props: PlanProps, id: string) {
    super(props, id);
  }

  static create(props: Omit<PlanProps, 'createdAt'> & { id: string }): Result<Plan> {
    const { id, name, description, duration, difficulty, category, progress } = props;

    // Validate required fields
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return Result.fail(new Error('ID is required and must be a non-empty string'));
    }

    if (!name || typeof name !== 'string') {
      return Result.fail(new Error('Name is required and must be a string'));
    }

    if (!description || typeof description !== 'string') {
      return Result.fail(new Error('Description is required and must be a string'));
    }

    if (!duration || typeof duration !== 'string') {
      return Result.fail(new Error('Duration is required and must be a string'));
    }

    if (!difficulty || !['Beginner', 'Intermediate', 'Advanced'].includes(difficulty)) {
      return Result.fail(
        new Error('Difficulty must be one of: Beginner, Intermediate, Advanced'),
      );
    }

    if (!category || typeof category !== 'string') {
      return Result.fail(new Error('Category is required and must be a string'));
    }

    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      return Result.fail(new Error('Progress must be a number between 0 and 100'));
    }

    return Result.ok(
      new Plan(
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
  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get duration(): string {
    return this.props.duration;
  }

  get difficulty(): 'Beginner' | 'Intermediate' | 'Advanced' {
    return this.props.difficulty;
  }

  get category(): string {
    return this.props.category;
  }

  get progress(): number {
    return this.props.progress;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  // Business logic methods
  updateProgress(newProgress: number): void {
    if (newProgress < 0 || newProgress > 100) {
      throw new Error('Progress must be between 0 and 100');
    }
    this.props.progress = newProgress;
    this.touch();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
