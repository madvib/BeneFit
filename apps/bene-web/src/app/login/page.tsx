import Link from 'next/link';
import Button from '@/components/Button';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-secondary p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-secondary-foreground">Login to BeneFit</h2>
        <form>
          <div className="mb-4">
            <label className="block text-secondary-foreground mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md"
              type="email"
              id="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-6">
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
          <Button className="w-full btn-primary" type="submit">
            Login
          </Button>
        </form>
        <p className="text-center mt-4">
          Don't have an account?{' '}
          <Link href="#" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}