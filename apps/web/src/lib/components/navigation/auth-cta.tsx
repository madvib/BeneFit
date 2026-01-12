import Link from 'next/link';
import { typography } from '@/lib/components/theme/typography';

export default function AuthCTA({ showModal }: { showModal: boolean }) {
  return (
    <>
      <Link
        href={showModal ? '/login' : '/auth/login'}
        className={`${typography.labelSm} text-muted-foreground hover:text-foreground px-3 py-2 transition-colors`}
      >
        Login
      </Link>
      <Link
        href={showModal ? '/signup' : '/auth/signup'}
        className={`${typography.labelSm} bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg`}
      >
        Sign Up
      </Link>
    </>
  );
}
