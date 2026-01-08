import { Bell, Menu, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { BeneLogo, ThemeToggle } from '@/lib/components/theme';
import { Button } from '@/lib/components';
import { ROUTES } from '@/lib/constants';

export default function AccountHeader({ onOpenMobileMenu }: { onOpenMobileMenu?: () => void }) {
  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={onOpenMobileMenu}>
              <Menu size={24} />
            </Button>
          </div>
          <div className="hidden md:flex">
            <BeneLogo />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href={ROUTES.USER.ACTIVITIES} prefetch={false}>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft size={16} />
              Back to App
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell size={20} />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
