'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import NewsletterSubscription from '@/components/blog/NewsletterSubscription';
import type { BlogPost } from '@/data/types/dataTypes';

interface BlogFiltersProps {
  categories: string[];
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
}

function BlogFilters({ 
  categories, 
  onCategorySelect,
  selectedCategory 
}: BlogFiltersProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {categories.map((category, index) => (
        <button 
          key={index} 
          className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => onCategorySelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default function BlogClient({ 
  initialPosts,
  categories 
}: { 
  initialPosts: BlogPost[];
  categories: string[];
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [blogPosts] = useState<BlogPost[]>(initialPosts);
  
  // Filter posts by selected category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') {
      return blogPosts;
    }
    return blogPosts.filter(post => post.category === selectedCategory);
  }, [blogPosts, selectedCategory]);

  const allCategories = ['All', ...categories];

  return (
    <div className="container mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">BeneFit Blog</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Expert insights, tips, and guides to help you on your fitness journey.
        </p>
      </div>

      <BlogFilters 
        categories={allCategories} 
        onCategorySelect={setSelectedCategory} 
        selectedCategory={selectedCategory} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {filteredPosts.map((post) => (
          <article key={post.id} className="bg-secondary rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="h-48 overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded-full">
                  {post.category}
                </span>
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
        ))}
      </div>

      <NewsletterSubscription />
    </div>
  );
}