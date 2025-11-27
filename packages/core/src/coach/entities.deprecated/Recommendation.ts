import { Entity, Result } from '@bene/core/shared';

interface RecommendationProps {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: Date;
  priority?: number;
}

export class Recommendation extends Entity<RecommendationProps> {
  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get category(): string {
    return this.props.category;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get priority(): number | undefined {
    return this.props.priority;
  }

  private constructor(props: RecommendationProps, id: string) {
    super(props, id);
  }

  public static create(props: RecommendationProps, id: string): Result<Recommendation> {
    // Validation logic
    if (!props.title || props.title.trim().length === 0) {
      return Result.fail(new Error('Title is required'));
    }

    if (!props.description || props.description.trim().length === 0) {
      return Result.fail(new Error('Description is required'));
    }

    if (!props.category || props.category.trim().length === 0) {
      return Result.fail(new Error('Category is required'));
    }

    const recommendation = new Recommendation(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
      },
      id,
    );

    return Result.ok(recommendation);
  }
}
