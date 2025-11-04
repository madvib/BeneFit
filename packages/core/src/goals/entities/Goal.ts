import { Entity, Result } from '@bene/core/shared';

interface GoalProps {
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed' | 'overdue';
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Goal entity
 */
export class Goal extends Entity<GoalProps> {
  private constructor(props: GoalProps, id: string) {
    super(props, id);
  }

  static create(
    props: Omit<GoalProps, 'createdAt'> & { id: string }
  ): Result<Goal> {
    const { id, ...rest } = props;

    // TODO: Add validation
    
    return Result.ok(
      new Goal(
        {
          ...rest,
          isActive: true,
          createdAt: new Date(),
        },
        id
      )
    );
  }

  // Getters
  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get targetValue(): number {
    return this.props.targetValue;
  }

  get currentValue(): number {
    return this.props.currentValue;
  }

  get unit(): string {
    return this.props.unit;
  }

  get deadline(): string {
    return this.props.deadline;
  }

  get status(): 'active' | 'completed' | 'overdue' {
    return this.props.status;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  // Business logic methods
  deactivate(): void {
    (this.props as any).isActive = false;
    this.touch();
  }

  activate(): void {
    (this.props as any).isActive = true;
    this.touch();
  }

  private touch(): void {
    (this.props as any).updatedAt = new Date();
  }
}
