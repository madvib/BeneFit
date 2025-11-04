import Link from 'next/link';

export default function CallToAction() {
  return (
    <div className="text-center">
      <Link href="/signup" className="btn btn-primary text-lg px-8 py-4 mr-4">
        Join Our Community
      </Link>
      <Link href="/contact" className="btn btn-ghost text-lg px-8 py-4">
        Contact Us
      </Link>
    </div>
  );
}
