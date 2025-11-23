import Link from 'next/link';

export default function AuthCTA() {
  return (
    <>
      <Link
        href="/login"
        className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium transition-colors"
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        Sign Up
      </Link>
    </>
  );
}
