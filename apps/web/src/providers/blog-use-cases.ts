import { MockBlogRepository } from '@bene/infrastructure/blog';
import {
  GetAllBlogPostsUseCase,
  GetBlogCategoriesUseCase,
  GetBlogPostByIdUseCase,
} from '@bene/application/blog';

// Create repository instance
const blogRepository = new MockBlogRepository();

// Instantiate use cases as constants
export const getAllBlogPostsUseCase = new GetAllBlogPostsUseCase(blogRepository);
export const getBlogCategoriesUseCase = new GetBlogCategoriesUseCase(blogRepository);
export const getBlogPostByIdUseCase = new GetBlogPostByIdUseCase(blogRepository);

// Export all blog use cases
export const blogUseCases = {
  getAllBlogPostsUseCase,
  getBlogCategoriesUseCase,
  getBlogPostByIdUseCase,
};
