import Link from 'next/link';
import Button from '@/components/common/ui-primitives/buttons/button';

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

export default function HomeHero({ title, primaryWord, subtitle, primaryLink, secondaryLink }: HeroProps) {
  return (
    <div className="flex-1 max-w-2xl text-center lg:text-left">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
        {title} <span className="text-primary">{primaryWord}</span>
      </h1>
      <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-xl">
        {subtitle}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
        <Link href={primaryLink.href}>
          <Button className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
            {primaryLink.text}
          </Button>
        </Link>
        <Link href={secondaryLink.href}>
          <Button className="btn-ghost text-lg px-8 py-4 w-full sm:w-auto border border-secondary">
            {secondaryLink.text}
          </Button>
        </Link>
      </div>
    </div>
  );
}