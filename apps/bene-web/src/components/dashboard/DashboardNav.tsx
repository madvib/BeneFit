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
    <div className="hidden md:flex border-b border-secondary/20">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-4 py-3 font-semibold ${
            pathname === item.href
              ? 'text-secondary-foreground border-b-2 border-secondary-foreground'
              : 'text-secondary-foreground/70 hover:text-secondary-foreground'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}