import Link from 'next/link';
import Image from 'next/image';

type HeaderProps = {
  isLoggedIn?: boolean;
};

export default function Header({ isLoggedIn = false }: HeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="BeneFit Logo"
            width={150}
            height={50}
            priority
          />
        </Link>
        <nav>
          {isLoggedIn ? (
            <Link href="/" className="btn btn-secondary">
              Logout
            </Link>
          ) : (
            <Link href="/login" className="btn btn-secondary">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
