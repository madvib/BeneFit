import Link from 'next/link';
import { buttonVariants } from '@/lib/components';

export function AuthCTA({ showModal }: { showModal: boolean }) {
  return (
    <>
      <Link
        href={showModal ? '/login' : '/auth/login'}
        className={buttonVariants({ variant: 'ghost', size: 'sm' })}
      >
        Login
      </Link>
      <Link
        href={showModal ? '/signup' : '/auth/signup'}
        className={buttonVariants({ variant: 'gradient', size: 'sm' })}
      >
        Sign Up
      </Link>
    </>
  );
}
