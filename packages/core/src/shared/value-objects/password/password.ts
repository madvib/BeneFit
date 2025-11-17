import { Result } from '../../base-classes/result.js';
import { ValueObject } from '../../base-classes/value-object.js';

interface PasswordProps {
  value: string;
}

export class Password extends ValueObject<PasswordProps> {
  private constructor(props: PasswordProps) {
    super(props);
  }

  static create(value: string): Result<Password> {
    // Validate the password value
    if (typeof value !== 'string') {
      return Result.fail(new Error('Password is required and must be a string'));
    }

    if (!value || value.trim().length === 0) {
      return Result.fail(new Error('Password cannot be empty'));
    }

    // Password validation: at least 8 characters, with at least one uppercase, one lowercase, one number
    if (value.length < 8) {
      return Result.fail(new Error('Password must be at least 8 characters long'));
    }

    // Check for at least one uppercase letter, one lowercase letter, and one number
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return Result.fail(
        new Error(
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        ),
      );
    }

    return Result.ok(new Password({ value: value.trim() }));
  }

  // Getter for the password value
  get value(): string {
    return this.props.value;
  }

  // Method to compare passwords (to avoid direct value access)
  public override equals(password: Password): boolean {
    return this.props.value === password.props.value;
  }

  // Method to hash password (placeholder - in a real implementation you would hash the password)
  public getHashedValue(): string {
    // This is just a placeholder. In a real implementation,
    // you would use a proper hashing function like bcrypt
    return this.props.value; // This should be replaced with actual hashing
  }
}
