import { ProtectedRoute } from '@/lib/components/auth';
import Link from 'next/link';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="bg-background-muted flex min-h-screen flex-col">
        <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
          <div className="container flex h-14 items-center">
            <div className="mr-4 flex">
              <Link className="mr-6 flex items-center space-x-2" href="/">
                <span className="font-bold sm:inline-block">BeneFit</span>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
