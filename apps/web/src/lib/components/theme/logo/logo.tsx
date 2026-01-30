import { HeartPulse } from 'lucide-react';
import { Link } from '@tanstack/react-router';
export const BeneLogo = ({
  hideLabelOnMobile = false,
  href = '/',
}: {
  hideLabelOnMobile?: boolean;
  href?: string;
}) => (
  <Link to={href} className="group flex items-center gap-2.5">
    <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg shadow-sm transition-transform group-hover:scale-105">
      <HeartPulse size={20} />
    </div>
    <span
      className={`text-foreground text-4xl font-bold tracking-tight ${hideLabelOnMobile ? 'hidden md:block' : 'block'}`}
    >
      Bene<span className="text-primary">Fit</span>
    </span>
  </Link>
);
