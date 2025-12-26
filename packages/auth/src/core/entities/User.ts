import { Entity, Result } from '@bene/shared';

interface UserProps {
  email: string;
  name?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * User entity
 */
export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id: string) {
    super(props, id);
  }

  static create(
    props: Omit<UserProps, 'isActive' | 'createdAt'> & { id: string },
  ): Result<User> {
    const { id, ...rest } = props;

    // Validation
    if (!props.email) {
      return Result.fail(new Error('Email is required'));
    }

    return Result.ok(
      new User(
        {
          ...rest,
          isActive: true,
          createdAt: new Date(),
        },
        id,
      ),
    );
  }

  // Getters
  get email(): string {
    return this.props.email;
  }

  get name(): string | undefined {
    return this.props.name;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  // Business logic methods
  deactivate(): void {
    this.props.isActive = false;
    this.touch();
  }

  activate(): void {
    this.props.isActive = true;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
