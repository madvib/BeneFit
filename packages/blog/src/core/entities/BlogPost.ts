import { Entity, Result } from '@bene/shared-domain';
import { BlogCategory } from '../value-objects/BlogCategory.js';

interface BlogPostProps {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  category: BlogCategory;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * BlogPost entity
 */
export class BlogPost extends Entity<BlogPostProps> {
  private constructor(props: BlogPostProps, id: string) {
    super(props, id);
  }

  static create(
    props: Omit<BlogPostProps, 'createdAt' | 'isActive'> & { id: string },
  ): Result<BlogPost> {
    const { id, title, excerpt, date, author, readTime, category, image } = props;

    // Validate inputs
    if (!title || typeof title !== 'string') {
      return Result.fail(new Error('Title is required and must be a string'));
    }

    if (!excerpt || typeof excerpt !== 'string') {
      return Result.fail(new Error('Excerpt is required and must be a string'));
    }

    if (!date || typeof date !== 'string') {
      return Result.fail(new Error('Date is required and must be a string'));
    }

    if (!author || typeof author !== 'string') {
      return Result.fail(new Error('Author is required and must be a string'));
    }

    if (!readTime || typeof readTime !== 'string') {
      return Result.fail(new Error('ReadTime is required and must be a string'));
    }

    if (!category || !(category instanceof BlogCategory)) {
      return Result.fail(new Error('Category is required and must be a BlogCategory'));
    }

    if (!image || typeof image !== 'string') {
      return Result.fail(new Error('Image is required and must be a string'));
    }

    return Result.ok(
      new BlogPost(
        {
          title,
          excerpt,
          date,
          author,
          readTime,
          category,
          image,
          isActive: true,
          createdAt: new Date(),
        },
        id,
      ),
    );
  }

  // Getters
  get title(): string {
    return this.props.title;
  }

  get excerpt(): string {
    return this.props.excerpt;
  }

  get date(): string {
    return this.props.date;
  }

  get author(): string {
    return this.props.author;
  }

  get readTime(): string {
    return this.props.readTime;
  }

  get category(): BlogCategory {
    return this.props.category;
  }

  get image(): string {
    return this.props.image;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  // Business logic methods
  deactivate(): void {
    this.props.isActive = false;
    this.touch();
  }

  activate(): void {
    this.props.isActive = true;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
