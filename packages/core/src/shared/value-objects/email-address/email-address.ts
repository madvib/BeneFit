import { Result } from '../../base-classes/result.js';
import { ValueObject } from '../../base-classes/value-object.js';

interface EmailAddressProps {
  value: string;
}

export class EmailAddress extends ValueObject<EmailAddressProps> {
  private constructor(props: EmailAddressProps) {
    super(props);
  }

  static create(value: string): Result<EmailAddress> {
    // Validate the email value
    if (typeof value !== 'string') {
      return Result.fail(new Error('Email is required and must be a string'));
    }

    if (!value || value.trim().length === 0) {
      return Result.fail(new Error('Email value cannot be empty'));
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value.trim())) {
      return Result.fail(new Error('Invalid Email Address'));
    }

    return Result.ok(new EmailAddress({ value: value.trim() }));
  }
  // Getter for the category value
  get value(): string {
    return this.props.value;
  }
}
