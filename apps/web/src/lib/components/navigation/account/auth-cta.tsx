import { Link } from '@tanstack/react-router';
import { buttonVariants } from '@/lib/components';
import { ROUTES, MODALS } from '@/lib/constants';

export function AuthCTA({ showModal }: { showModal: boolean }) {
  return (
    <>
      <Link
        to={showModal ? '.' : ROUTES.AUTH.LOGIN}
        search={showModal ? { m: MODALS.LOGIN } : undefined}
        className={buttonVariants({ variant: 'ghost', size: 'sm' })}
      >
        Login
      </Link>
      <Link
        to={showModal ? '.' : ROUTES.AUTH.SIGNUP}
        search={showModal ? { m: MODALS.SIGNUP } : undefined}
        className={buttonVariants({ variant: 'gradient', size: 'sm' })}
      >
        Sign Up
      </Link>
    </>
  );
}
