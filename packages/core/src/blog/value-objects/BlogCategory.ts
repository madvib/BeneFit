import { ValueObject, Result } from '@bene/core/shared';

interface BlogCategoryProps {
  value: string;
}

/**
 * BlogCategory value object - represents the category of a blog post
 * Value objects are compared by their value, not by identity
 */
export class BlogCategory extends ValueObject<BlogCategoryProps> {
  private constructor(props: BlogCategoryProps) {
    super(props);
  }

  static create(value: string): Result<BlogCategory> {
    // Validate the category value
    if (!value || typeof value !== 'string') {
      return Result.fail(new Error('Category value is required and must be a string'));
    }

    if (value.trim().length === 0) {
      return Result.fail(new Error('Category value cannot be empty'));
    }

    if (value.length > 50) {
      return Result.fail(new Error('Category value cannot exceed 50 characters'));
    }

    // Basic validation - category should contain only alphanumeric characters, spaces, hyphens, and underscores
    const validCategoryRegex = /^[a-zA-Z0-9\s\-_]+$/;
    if (!validCategoryRegex.test(value.trim())) {
      return Result.fail(new Error('Category value contains invalid characters'));
    }

    return Result.ok(new BlogCategory({ value: value.trim() }));
  }

  // Getter for the category value
  get value(): string {
    return this.props.value;
  }

  // Business logic methods
  isSameCategory(otherCategory: BlogCategory): boolean {
    return this.equals(otherCategory);
  }

  // Override the equals method to compare by value
  override equals(other?: BlogCategory): boolean {
    if (!other) return false;
    if (this === other) return true;
    return this.props.value.toLowerCase() === other.props.value.toLowerCase();
  }

  // Return string representation
  override toString(): string {
    return this.props.value;
  }
}
