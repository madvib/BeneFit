'use server';

import { getBlogPostByIdUseCase } from '@/providers/blog-use-cases';

export interface BlogPostData {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  category: string;
  image: string;
}

interface GetBlogPostByIdResult {
  success: boolean;
  data: BlogPostData | null;
  error?: string;
}

export async function getBlogPostById(id: string): Promise<GetBlogPostByIdResult> {
  try {
    const result = await getBlogPostByIdUseCase.execute({ id });
    
    if (result.isSuccess) {
      const post = result.value;
      if (post) {
        // Transform the BlogPost entity to a plain object for client consumption
        const transformedData = {
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          date: post.date,
          author: post.author,
          readTime: post.readTime,
          category: post.category.value,
          image: post.image,
        };
        
        return {
          success: true,
          data: transformedData
        };
      } else {
        return {
          success: false,
          data: null,
          error: 'Blog post not found'
        };
      }
    } else {
      console.error('Failed to fetch blog post:', result.error);
      return {
        success: false,
        data: null,
        error: result.error?.message || 'Failed to fetch blog post'
      };
    }
  } catch (error) {
    console.error('Error in getBlogPostById controller:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}