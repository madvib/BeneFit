'use client';
import { usePathname, redirect } from 'next/navigation';

export default function ModalCatchAll() {
  const pathname = usePathname();

  switch (pathname) {
    case '/login':
      redirect('/auth/login');
      break;
    case '/signup':
      redirect('/auth/signup');
      break;
    case '/password-reset':
      redirect('/auth/password-reset');
      break;
    default:
      return null;
  }
}
