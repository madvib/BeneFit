import Link from 'next/link';

interface PublicNavProps {
  isLoggedIn: boolean;
}

export default function PublicNav({ isLoggedIn }: PublicNavProps) {
  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/features" className="btn btn-ghost text-secondary-foreground hover:text-secondary-foreground/80">
        Features
      </Link>
      <Link href="/about" className="btn btn-ghost text-secondary-foreground hover:text-secondary-foreground/80">
        About
      </Link>
      <Link href="/blog" className="btn btn-ghost text-secondary-foreground hover:text-secondary-foreground/80">
        Blog
      </Link>
    </div>
  );
}