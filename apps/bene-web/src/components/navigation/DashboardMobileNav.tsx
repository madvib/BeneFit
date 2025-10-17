'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/feed', label: 'Feed' },
  { href: '/goals', label: 'Goals' },
  { href: '/plan', label: 'Plan' },
  { href: '/coach', label: 'Coach' },
];

export default function DashboardMobileNav() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-4 gap-2 p-2 bg-secondary rounded-lg shadow-md">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-4 py-2 rounded-md font-bold transition-colors text-center ${
            pathname === link.href
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
