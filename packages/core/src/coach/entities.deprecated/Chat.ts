import { Entity, Result } from '@bene/core/shared';

interface ChatProps {
  title: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Chat entity
 */
export class Chat extends Entity<ChatProps> {
  private constructor(props: ChatProps, id: string) {
    super(props, id);
  }

  static create(props: Omit<ChatProps, 'createdAt'> & { id: string }): Result<Chat> {
    const { id, ...rest } = props;

    // TODO: Add validation

    return Result.ok(
      new Chat(
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
  get title(): string {
    return this.props.title;
  }

  get lastMessage(): string {
    return this.props.lastMessage;
  }

  get timestamp(): string {
    return this.props.timestamp;
  }

  get unread(): boolean {
    return this.props.unread;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  // Business logic methods
  markAsRead(): void {
    this.props.unread = false;
    this.touch();
  }

  markAsUnread(): void {
    this.props.unread = true;
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
