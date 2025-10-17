'use client';

import MarketingHeader from '@/components/header/MarketingHeader';
import UserHeader from '@/components/header/UserHeader';

type HeaderProps = {
  variant?: 'marketing' | 'user';
};

export default function Header({ variant = 'marketing' }: HeaderProps) {
  if (variant === 'user') {
    return <UserHeader />;
  }

  return <MarketingHeader />;
}