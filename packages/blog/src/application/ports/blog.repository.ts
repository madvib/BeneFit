import { Repository } from '@bene/shared-domain';
import { BlogPost, BlogCategory } from '@core/index.js';

export interface BlogRepository extends Repository<BlogPost> {
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogCategories(): Promise<BlogCategory[]>;
  getBlogPostById(id: string): Promise<BlogPost | null>;
}
