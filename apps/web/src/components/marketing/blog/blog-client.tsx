'use client';

import { useState, useMemo } from 'react';
import BlogFilters from './blog-filters';
import BlogPostCard from './blog-post-card';
import NewsletterSubscription from './newsletter-subscription';
import { BlogPostData } from '@/controllers/blog';

export default function BlogClient({
  initialPosts,
  categories,
}: {
  initialPosts: BlogPostData[];
  categories: string[];
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [blogPosts] = useState<BlogPostData[]>(initialPosts);

  // Filter posts by selected category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') {
      return blogPosts;
    }
    return blogPosts.filter((post) => post.category === selectedCategory);
  }, [blogPosts, selectedCategory]);

  return (
    <div className="container mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">BeneFit Blog</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Expert insights, tips, and guides to help you on your fitness journey.
        </p>
      </div>

      <BlogFilters
        categories={categories}
        onCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
        includeAllButton={true}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {filteredPosts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      <NewsletterSubscription />
    </div>
  );
}
