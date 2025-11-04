import { Entity, Result } from '@bene/core/shared';

interface ServiceConnectionProps {
  name: string;
  description: string;
  connected: boolean;
  logo: string;
  dataType: string[];
  lastSync?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * ServiceConnection entity representing external service connections
 */
export class ServiceConnection extends Entity<ServiceConnectionProps> {
  private constructor(props: ServiceConnectionProps, id: string) {
    super(props, id);
  }

  static create(
    props: Omit<ServiceConnectionProps, 'createdAt'> & { id: string },
  ): Result<ServiceConnection> {
    const { id, name, description, logo, dataType } = props;

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

    if (!logo || typeof logo !== 'string') {
      return Result.fail(new Error('Logo is required and must be a string'));
    }

    if (!Array.isArray(dataType)) {
      return Result.fail(new Error('Data type must be an array of strings'));
    }

    return Result.ok(
      new ServiceConnection(
        {
          ...props,
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

  get connected(): boolean {
    return this.props.connected;
  }

  get logo(): string {
    return this.props.logo;
  }

  get dataType(): string[] {
    return this.props.dataType;
  }

  get lastSync(): Date | undefined {
    return this.props.lastSync;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  // Business logic methods
  connect(): void {
    this.props.connected = true;
    this.touch();
  }

  disconnect(): void {
    this.props.connected = false;
    this.touch();
  }

  updateLastSync(): void {
    this.props.lastSync = new Date();
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
