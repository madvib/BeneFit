import { Link } from '@tanstack/react-router';
import { Button } from '@/lib/components';
import { MODALS } from '@/lib/constants';

export default function CallToAction() {
  return (
    <div className="mb-24 text-center">
      <Link to="." search={{ m: MODALS.SIGNUP }}>
        <Button>Join Our Community</Button>
      </Link>
      <Link to="/contact">
        <Button variant={'ghost'}>Contact Us</Button>
      </Link>
    </div>
  );
}
