import { BlogRepository } from '@bene/application/blog';
import { BlogCategory, BlogPost } from '@bene/core/blog';
import { Result } from '@bene/core/shared';

// Define types that match the original JSON data structure (DTOs)
interface BlogPostDTO {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  category: string;
  image: string;
}

export class MockBlogRepository implements BlogRepository {
  async findById(id: string): Promise<Result<BlogPost>> {
    const blogPosts = await this.getAllBlogPosts();
    const blogPost = blogPosts.find((post) => post.id.toString() === id);

    if (!blogPost) {
      return Result.fail(new Error('BlogPost not found'));
    }

    return Result.ok(blogPost);
  }

  async save(entity: BlogPost): Promise<Result<void>> {
    console.log(`${entity} saved`);

    // In a mock implementation, we just return success
    return Result.ok();
  }

  async delete(id: string): Promise<Result<void>> {
    console.log(`${id} deleted`);

    // In a mock implementation, we just return success
    return Result.ok();
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const data = await import('../data/mock/blogPosts.json');
    const dtoData = data.default as BlogPostDTO[];

    const blogPosts: BlogPost[] = [];
    for (const dto of dtoData) {
      const category = BlogCategory.create(dto.category);
      if (category.isSuccess) {
        const entityResult = BlogPost.create({
          title: dto.title,
          excerpt: dto.excerpt,
          date: dto.date,
          author: dto.author,
          readTime: dto.readTime,
          category: category.value,
          image: dto.image,
          id: dto.id.toString(),
          isActive: true,
        });
        if (entityResult.isSuccess) {
          blogPosts.push(entityResult.value);
        }
      }
    }

    return blogPosts;
  }

  async getBlogCategories(): Promise<BlogCategory[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const data = await import('../data/mock/blogCategories.json');
    const categories: BlogCategory[] = [];
    for (const d of data.default) {
      const cat = BlogCategory.create(d);
      if (cat.isSuccess) {
        categories.push(cat.value);
      }
    }
    return categories;
  }

  async getBlogPostById(id: string): Promise<BlogPost | null> {
    const posts = await this.getAllBlogPosts();
    return posts.find((post) => post.id === id) || null;
  }
}
