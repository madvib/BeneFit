import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { typography } from '@/lib/components/theme/typography';

export default function NotFound() {
  // TODO replace with global not found page not just auth specific
  return (
    <div className="container mx-auto flex h-screen items-center justify-center p-8">
      <div className="text-center">
        <h2 className={`${typography.h2} mb-4`}>Page Not Found</h2>
        <p className={`${typography.p} mb-6`}>
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href={ROUTES.MODAL.LOGIN} className="btn btn-primary">
          Go to Login
        </Link>
      </div>
    </div>
  );
}
