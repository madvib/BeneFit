'use client';

import UnifiedHeader from '@/components/header/UnifiedHeader';

type HeaderProps = {
  variant?: 'marketing' | 'user' | 'dashboard';
};

export default function Header({ variant = 'marketing' }: HeaderProps) {
  return <UnifiedHeader variant={variant} />;
}