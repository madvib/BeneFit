import Link from "next/link";
import { ROUTES } from '@/lib/constants';

export default function NotFound() {
  return (
    <div className="container mx-auto p-8 flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="mb-6">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href={ROUTES.MODAL.LOGIN} className="btn btn-primary">
          Go to Login
        </Link>
      </div>
    </div>
  );
}
