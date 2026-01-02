'use client';
import { usePathname, redirect } from 'next/navigation';

export default function ModalCatchAll() {
  const pathname = usePathname();

  switch (pathname) {
    case '/login':
      redirect('/auth/login');
    case '/signup':
      redirect('/auth/signup');
    case '/password-reset':
      redirect('/auth/password-reset');
    default:
      return null;
  }
}
