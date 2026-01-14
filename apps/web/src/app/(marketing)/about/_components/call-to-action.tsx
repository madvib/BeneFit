import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/lib/components';

export default function CallToAction() {
  return (
    <div className="text-center">
      <Link href={ROUTES.MODAL.SIGNUP}>
        <Button>Join Our Community</Button>
      </Link>
      <Link href="/contact">
        <Button variant={'ghost'}>Contact Us</Button>
      </Link>
    </div>
  );
}
