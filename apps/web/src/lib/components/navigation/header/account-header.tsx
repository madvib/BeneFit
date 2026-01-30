

import { Bell, Menu, ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import {
  Button,
  BeneLogo,
  ThemeToggle,
  HeaderRoot,
  HeaderLeft,
  HeaderRight,
} from '@/lib/components';
import { ROUTES } from '@/lib/constants';

export function AccountHeader({
  onOpenMobileMenu,
}: {
  readonly onOpenMobileMenu?: () => void;
}) {
  return (
    <HeaderRoot>
      <HeaderLeft>
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={onOpenMobileMenu}>
            <Menu size={24} />
          </Button>
        </div>
        <div className="hidden md:flex">
          <BeneLogo />
        </div>
      </HeaderLeft>

      <HeaderRight>
        <Link to={ROUTES.USER.ACTIVITIES} preload={false}>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft size={16} />
            Back to App
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell size={20} />
        </Button>
        <ThemeToggle />
      </HeaderRight>
    </HeaderRoot>
  );
}
