import Link from 'next/link';
import { Button, typography } from '@/lib/components';

interface HeroProps {
  title: string;
  primaryWord: string;
  subtitle: string;
  primaryLink: {
    href: string;
    text: string;
  };
  secondaryLink: {
    href: string;
    text: string;
  };
}

export default function HomeHero({
  title,
  primaryWord,
  subtitle,
  primaryLink,
  secondaryLink,
}: HeroProps) {
  return (
    <div className="max-w-2xl flex-1 text-center lg:text-left">
      <h1 className={`${typography.displayLgResponsive} mb-6`}>
        {title} <span className="text-primary">{primaryWord}</span>
      </h1>
      <p className={`${typography.lead} text-muted-foreground mb-8 max-w-xl`}>{subtitle}</p>
      <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
        <Link href={primaryLink.href}>
          <Button size="lg" className="w-full sm:w-auto">
            {primaryLink.text}
          </Button>
        </Link>
        <Link href={secondaryLink.href}>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            {secondaryLink.text}
          </Button>
        </Link>
      </div>
    </div>
  );
}
