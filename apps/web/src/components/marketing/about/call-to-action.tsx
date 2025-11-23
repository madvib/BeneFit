import { Button } from '@/components/common';
import Link from 'next/link';

export default function CallToAction() {
  return (
    <div className="text-center">
      <Link href="/signup">
        <Button>Join Our Community</Button>
      </Link>
      <Link href="/contact">
        <Button variant={'ghost'}>Contact Us</Button>
      </Link>
    </div>
  );
}
