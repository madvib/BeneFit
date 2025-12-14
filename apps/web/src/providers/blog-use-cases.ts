import { MockBlogRepository } from '@bene/blog';
import {
  GetAllBlogPostsUseCase,
  GetBlogCategoriesUseCase,
  GetBlogPostByIdUseCase,
} from '@bene/blog';

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
