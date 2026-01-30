import { Link } from '@tanstack/react-router';
import { Button, PageHeader } from '@/lib/components';

interface HeroProps {
  title: string;
  primaryWord: string;
  subtitle: string;
  primaryLink: {
    href: string;
    text: string;
    search?: Record<string, unknown>;
  };
  secondaryLink: {
    href: string;
    text: string;
    search?: Record<string, unknown>;
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
      <PageHeader title={`${title} ${primaryWord}`} description={subtitle} />
      <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
        <Link to={primaryLink.href} search={primaryLink.search}>
          <Button size="lg" className="w-full sm:w-auto">
            {primaryLink.text}
          </Button>
        </Link>
        <Link to={secondaryLink.href} search={secondaryLink.search}>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            {secondaryLink.text}
          </Button>
        </Link>
      </div>
    </div>
  );
}
