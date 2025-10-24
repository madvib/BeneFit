// Server Component - fetches data on the server
import {
  fetchBlogPosts,
  fetchBlogCategories,
} from "@/infrastructure/data/next-data-service";
import BlogClient from "@/presentation/blog/blog-client";

// This is now a Server Component by default in Next.js App Router
export default async function BlogPage() {
  // Fetch data on the server - no useEffect needed!
  const [blogPosts, categories] = await Promise.all([
    fetchBlogPosts(),
    fetchBlogCategories(),
  ]);

  return <BlogClient initialPosts={blogPosts} categories={categories} />;
}
