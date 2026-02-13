import { Link } from '@tanstack/react-router';
import { buttonVariants } from '@/lib/components';
import { ROUTES, MODALS } from '@/lib/constants';

export function AuthCTA({
  showModal,
  onLinkClick,
}: {
  showModal: boolean;
  onLinkClick?: () => void;
}) {
  return (
    <>
      <Link
        to={showModal ? '.' : ROUTES.AUTH.LOGIN}
        search={showModal ? { m: MODALS.LOGIN } : undefined}
        className={buttonVariants({ variant: 'ghost', size: 'sm' })}
        onClick={onLinkClick}
      >
        Login
      </Link>
      <Link
        to={showModal ? '.' : ROUTES.AUTH.SIGNUP}
        search={showModal ? { m: MODALS.SIGNUP } : undefined}
        className={buttonVariants({ variant: 'gradient', size: 'sm' })}
        onClick={onLinkClick}
      >
        Sign Up
      </Link>
    </>
  );
}
