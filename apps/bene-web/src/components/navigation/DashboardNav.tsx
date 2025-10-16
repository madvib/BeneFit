'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
}

interface DashboardNavProps {
  items: NavItem[];
}

export default function DashboardNav({ items }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex flex-wrap border-b border-secondary/20">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-4 py-3 font-semibold border-b-2 ${
            pathname === item.href
              ? 'text-secondary-foreground border-secondary-foreground'
              : 'text-secondary-foreground/70 hover:text-secondary-foreground border-transparent'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}