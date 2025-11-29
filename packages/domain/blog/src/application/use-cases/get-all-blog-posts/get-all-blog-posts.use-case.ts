import { UseCase } from '@bene/domain-shared';
import { BlogRepository } from '../../ports/blog.repository.js';
import { BlogPost } from '@core/index.js';
import { Result } from '@bene/domain-shared';

// Define custom error types for blog in the application layer
export class BlogError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BlogError';
  }
}

export class BlogPostsFetchError extends BlogError {
  constructor() {
    super('Failed to fetch blog posts');
    this.name = 'BlogPostsFetchError';
  }
}

export type GetAllBlogPostsInput = void;
export type GetAllBlogPostsOutput = BlogPost[];

export class GetAllBlogPostsUseCase
  implements UseCase<GetAllBlogPostsInput, GetAllBlogPostsOutput>
{
  constructor(private blogRepository: BlogRepository) {}

  async execute(): Promise<Result<GetAllBlogPostsOutput>> {
    try {
      const blogPosts = await this.blogRepository.getAllBlogPosts();
      return Result.ok(blogPosts);
    } catch (error) {
      console.error('Error in GetAllBlogPostsUseCase:', error);
      return Result.fail(new BlogPostsFetchError());
    }
  }
}
