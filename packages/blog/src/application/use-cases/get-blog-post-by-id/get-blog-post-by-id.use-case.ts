import { UseCase } from '@bene/shared-domain';
import { BlogRepository } from '../../ports/blog.repository.js';
import { BlogPost } from '@core/index.js';
import { Result } from '@bene/shared-domain';

// Define custom error types for blog in the application layer
export class BlogError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BlogError';
  }
}

export class BlogPostNotFoundError extends BlogError {
  constructor(id: string) {
    super(`Blog post with ID ${id} not found`);
    this.name = 'BlogPostNotFoundError';
  }
}

export class BlogPostFetchError extends BlogError {
  constructor() {
    super('Failed to fetch blog post by ID');
    this.name = 'BlogPostFetchError';
  }
}

export interface GetBlogPostByIdInput {
  id: string;
}
export type GetBlogPostByIdOutput = BlogPost | null;

export class GetBlogPostByIdUseCase
  implements UseCase<GetBlogPostByIdInput, GetBlogPostByIdOutput>
{
  constructor(private blogRepository: BlogRepository) {}

  async execute(input: GetBlogPostByIdInput): Promise<Result<GetBlogPostByIdOutput>> {
    try {
      const blogPost = await this.blogRepository.getBlogPostById(input.id);
      return Result.ok(blogPost);
    } catch (error) {
      console.error('Error in GetBlogPostByIdUseCase:', error);
      return Result.fail(new BlogPostFetchError());
    }
  }
}
