import { UseCase } from '@bene/shared-domain';
import { BlogRepository } from '../../index.js';
import { Result } from '@bene/shared-domain';
import { BlogCategory } from '@core/index.js';

// Define custom error types for blog in the application layer
export class BlogError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BlogError';
  }
}

export class BlogCategoriesFetchError extends BlogError {
  constructor() {
    super('Failed to fetch blog categories');
    this.name = 'BlogCategoriesFetchError';
  }
}

export type GetBlogCategoriesInput = void;
export type GetBlogCategoriesOutput = BlogCategory[];

export class GetBlogCategoriesUseCase
  implements UseCase<GetBlogCategoriesInput, GetBlogCategoriesOutput>
{
  constructor(private blogRepository: BlogRepository) {}

  async execute(): Promise<Result<GetBlogCategoriesOutput>> {
    try {
      const categories = await this.blogRepository.getBlogCategories();
      return Result.ok(categories);
    } catch (error) {
      console.error('Error in GetBlogCategoriesUseCase:', error);
      return Result.fail(new BlogCategoriesFetchError());
    }
  }
}
