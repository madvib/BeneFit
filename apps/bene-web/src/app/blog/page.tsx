'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  category: string;
  image: string;
}

export default function BlogPage() {
  // Mock data for blog posts
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'The Science Behind Sustainable Weight Loss',
      excerpt: 'Understanding the metabolic processes involved in weight loss and how to maintain results long-term.',
      date: 'May 15, 2023',
      author: 'Dr. Sarah Johnson',
      readTime: '8 min read',
      category: 'Nutrition',
      image: 'https://images.unsplash.com/photo-1532029837206-57b4b5f0f7e0?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      title: 'Building Strength: A Complete Beginner\'s Guide',
      excerpt: 'Learn the fundamentals of strength training, from proper form to creating an effective workout routine.',
      date: 'April 28, 2023',
      author: 'Mike Thompson',
      readTime: '10 min read',
      category: 'Workout',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      title: 'The Importance of Recovery in Fitness',
      excerpt: 'Exploring how rest, sleep, and recovery techniques can enhance your performance and prevent injury.',
      date: 'April 10, 2023',
      author: 'Emma Rodriguez',
      readTime: '6 min read',
      category: 'Wellness',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 4,
      title: 'Nutrition Myths Debunked: What Science Really Says',
      excerpt: 'Separating fact from fiction in the world of nutrition with evidence-based research and studies.',
      date: 'March 25, 2023',
      author: 'Dr. James Wilson',
      readTime: '12 min read',
      category: 'Nutrition',
      image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 5,
      title: 'Creating Effective Workout Plans for Busy Professionals',
      excerpt: 'Maximize your fitness time with efficient routines designed for demanding schedules.',
      date: 'March 8, 2023',
      author: 'Alex Chen',
      readTime: '7 min read',
      category: 'Workout',
      image: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 6,
      title: 'The Mind-Muscle Connection: How Mental Focus Impacts Results',
      excerpt: 'Understanding the psychological aspects of training and how focus can improve your workout outcomes.',
      date: 'February 22, 2023',
      author: 'Lisa Anderson',
      readTime: '9 min read',
      category: 'Mindset',
      image: 'https://images.unsplash.com/photo-1549060279-7e168fce7090?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const categories = ['All', 'Nutrition', 'Workout', 'Wellness', 'Mindset'];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} />

      <main className="flex-grow container mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">BeneFit Blog</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Expert insights, tips, and guides to help you on your fitness journey.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => (
            <button 
              key={index} 
              className={`btn ${index === 0 ? 'btn-primary' : 'btn-ghost'}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {blogPosts.map((post) => (
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

        <div className="bg-secondary p-8 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Get the latest fitness tips, workout routines, and nutrition advice delivered straight to your inbox.
          </p>
          <div className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow p-3 rounded-l-lg border border-muted bg-background"
            />
            <button className="btn btn-primary rounded-l-none">Subscribe</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}