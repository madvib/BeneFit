'use server';

import { getAllBlogPostsUseCase } from '@/providers/blog-use-cases';

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

interface GetBlogPostsResult {
  success: boolean;
  data: BlogPostData[];
  error?: string;
}

export async function getBlogPosts(): Promise<GetBlogPostsResult> {
  try {
    const result = await getAllBlogPostsUseCase.execute();
    
    if (result.isSuccess) {
      // Transform the BlogPost entities to plain objects for client consumption
      const transformedData = result.value.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        author: post.author,
        readTime: post.readTime,
        category: post.category.value,
        image: post.image,
      }));
      
      return {
        success: true,
        data: transformedData
      };
    } else {
      console.error('Failed to fetch blog posts:', result.error);
      return {
        success: false,
        data: [],
        error: result.error?.message || 'Failed to fetch blog posts'
      };
    }
  } catch (error) {
    console.error('Error in getBlogPosts controller:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}