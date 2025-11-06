import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import {
  GetAllBlogPostsUseCase,
  BlogPostsFetchError,
} from './get-all-blog-posts.use-case';
import { BlogRepository } from '../../ports/blog.repository.js';
import { BlogPost, BlogCategory } from '@bene/core/blog';

// Create a mock repository interface
type MockBlogRepository = Mocked<BlogRepository>;

describe('GetAllBlogPostsUseCase', () => {
  let useCase: GetAllBlogPostsUseCase;
  let mockBlogRepository: MockBlogRepository;

  beforeEach(() => {
    mockBlogRepository = {
      getAllBlogPosts: vi.fn(),
      getBlogPostById: vi.fn(),
      getBlogPostsByCategory: vi.fn(),
      createBlogPost: vi.fn(),
      updateBlogPost: vi.fn(),
      deleteBlogPost: vi.fn(),
    } as unknown as MockBlogRepository;

    useCase = new GetAllBlogPostsUseCase(mockBlogRepository);
  });

  describe('execute', () => {
    it('should return blog posts when repository call succeeds', async () => {
      // Arrange
      // First create categories since BlogPost.create requires BlogCategory instances
      const techCategoryResult = BlogCategory.create('Tech');
      const healthCategoryResult = BlogCategory.create('Health');
      
      if (techCategoryResult.isFailure || healthCategoryResult.isFailure) {
        throw new Error('Failed to create mock categories');
      }
      
      const mockBlogPost1Result = BlogPost.create({
        id: 'post-1',
        title: 'Test Blog Post 1',
        excerpt: 'Test excerpt',
        date: '2023-01-01',
        author: 'Author 1',
        readTime: '5 min read',
        category: techCategoryResult.value,
        image: 'image1.jpg',
        isActive: true,
      });
      
      const mockBlogPost2Result = BlogPost.create({
        id: 'post-2',
        title: 'Test Blog Post 2',
        excerpt: 'Test excerpt 2',
        date: '2023-01-02',
        author: 'Author 2',
        readTime: '8 min read',
        category: healthCategoryResult.value,
        image: 'image2.jpg',
        isActive: true,
      });
      
      if (mockBlogPost1Result.isFailure || mockBlogPost2Result.isFailure) {
        throw new Error('Failed to create mock blog posts');
      }
      
      const mockBlogPosts = [
        mockBlogPost1Result.value,
        mockBlogPost2Result.value,
      ];
      
      mockBlogRepository.getAllBlogPosts.mockResolvedValue(mockBlogPosts);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value).toEqual(mockBlogPosts);
      }
      expect(mockBlogRepository.getAllBlogPosts).toHaveBeenCalled();
    });

    it('should return failure with BlogPostsFetchError when repository call fails', async () => {
      // Arrange
      mockBlogRepository.getAllBlogPosts.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error).toBeInstanceOf(BlogPostsFetchError);
        expect(result.error.message).toBe('Failed to fetch blog posts');
      }
    });

    it('should handle repository returning empty blog posts', async () => {
      // Arrange
      const mockBlogPosts: any[] = [];
      mockBlogRepository.getAllBlogPosts.mockResolvedValue(mockBlogPosts);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value).toEqual([]);
      }
    });

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      mockBlogRepository.getAllBlogPosts.mockRejectedValue('Unexpected string error');

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error).toBeInstanceOf(BlogPostsFetchError);
        expect(result.error.message).toBe('Failed to fetch blog posts');
      }
    });
  });
});
