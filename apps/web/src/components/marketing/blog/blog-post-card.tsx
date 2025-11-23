'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BlogPostData } from '@/controllers/blog';
import { Badge } from '@/components';

interface BlogPostCardProps {
  post: BlogPostData;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article
      key={post.id}
      className="bg-secondary rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="h-48 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          width={400}
          height={300}
          className="w-full h-full object-cover"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <Badge variant="primaryLight">
            {post.category}
          </Badge>
          <span className="text-sm text-muted-foreground">{post.date}</span>
        </div>
        <h2 className="text-xl font-bold mb-3">{post.title}</h2>
        <p className="text-muted-foreground mb-4">{post.excerpt}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">By {post.author}</span>
          <span className="text-sm text-muted-foreground">{post.readTime}</span>
        </div>
        <Link
          href={`/blog/${post.id}`}
          className="mt-4 inline-block text-primary hover:underline"
        >
          Read More
        </Link>
      </div>
    </article>
  );
}