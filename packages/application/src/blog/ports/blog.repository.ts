import { Repository } from '@bene/core/shared';
import { BlogPost, BlogCategory } from '@bene/core/blog';

export interface BlogRepository extends Repository<BlogPost> {
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogCategories(): Promise<BlogCategory[]>;
  getBlogPostById(id: string): Promise<BlogPost | null>;
}
