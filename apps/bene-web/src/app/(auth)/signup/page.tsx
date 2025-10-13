import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function SignupPage() {
  return (
    <div className="container mx-auto p-8 flex items-center justify-center min-h-screen">
      <div className="bg-secondary p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-secondary-foreground">Create Account</h2>
        <form>
          <div className="mb-4">
            <label className="block text-secondary-foreground mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md"
              type="text"
              id="name"
              placeholder="John Doe"
            />
          </div>
          <div className="mb-4">
            <label className="block text-secondary-foreground mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md"
              type="email"
              id="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-4">
            <label className="block text-secondary-foreground mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md"
              type="password"
              id="password"
              placeholder="********"
            />
          </div>
          <div className="mb-6">
            <label className="block text-secondary-foreground mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md"
              type="password"
              id="confirmPassword"
              placeholder="********"
            />
          </div>
          <Button className="w-full btn-primary" type="submit">
            Create Account
          </Button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}