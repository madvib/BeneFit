import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto p-8 flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="mb-6">The page you're looking for doesn't exist.</p>
        <Link href="/login" className="btn btn-primary">
          Go to Login
        </Link>
      </div>
    </div>
  );
}