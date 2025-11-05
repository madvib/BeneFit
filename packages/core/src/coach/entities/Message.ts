import { Entity, Result } from '@bene/core/shared';

interface MessageProps {
  content: string;
  sender: 'user' | 'coach';
  timestamp: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Message entity
 */
export class Message extends Entity<MessageProps> {
  private constructor(props: MessageProps, id: string) {
    super(props, id);
  }

  static create(
    props: Omit<MessageProps, 'createdAt'> & { id: string }
  ): Result<Message> {
    const { id, ...rest } = props;

    // TODO: Add validation
    
    return Result.ok(
      new Message(
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
  get content(): string {
    return this.props.content;
  }

  get sender(): 'user' | 'coach' {
    return this.props.sender;
  }

  get timestamp(): string {
    return this.props.timestamp;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }


}
