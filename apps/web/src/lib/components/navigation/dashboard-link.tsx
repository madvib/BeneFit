import { Rocket } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { typography } from '@/lib/components/theme/typography';

export default function DashboardLink() {
  return (
    <Link href={ROUTES.USER.ACTIVITIES}>
      <div
        className={`${typography.labelSm} bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center rounded-md px-4 py-2 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg`}
      >
        <Rocket size={18} />
        <span className="ml-2">Launch</span>
      </div>
    </Link>
  );
}
