'use server';

import { getBlogCategoriesUseCase } from '@/providers/blog-use-cases';

interface GetBlogCategoriesResult {
  success: boolean;
  data: string[];
  error?: string;
}

export async function getBlogCategories(): Promise<GetBlogCategoriesResult> {
  try {
    const result = await getBlogCategoriesUseCase.execute();
    
    if (result.isSuccess) {
      // Transform the BlogCategory entities to plain strings for client consumption
      const transformedData = result.value.map(category => category.value);
      
      return {
        success: true,
        data: transformedData
      };
    } else {
      console.error('Failed to fetch blog categories:', result.error);
      return {
        success: false,
        data: [],
        error: result.error?.message || 'Failed to fetch blog categories'
      };
    }
  } catch (error) {
    console.error('Error in getBlogCategories controller:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}