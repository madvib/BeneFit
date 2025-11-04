// Server Component - fetches data on the server
import { getBlogPosts, getBlogCategories } from '@/controllers/blog';
import BlogClient from '@/components/marketing/blog/blog-client';

// This is now a Server Component by default in Next.js App Router
export default async function BlogPage() {
  // Fetch data on the server using server actions - no useEffect needed!
  const [blogPostsResult, categoriesResult] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
  ]);

  // Extract data from results, with fallbacks for errors
  const blogPosts = blogPostsResult.success ? blogPostsResult.data : [];
  const categories = categoriesResult.success ? categoriesResult.data : [];

  return <BlogClient initialPosts={blogPosts} categories={categories} />;
}
