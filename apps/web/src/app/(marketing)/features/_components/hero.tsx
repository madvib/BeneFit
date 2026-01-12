import { typography } from '@/lib/components/theme/typography';

interface HeroProps {
  title: string;
  subtitle: string;
}

export default function FeaturesHero({ title, subtitle }: HeroProps) {
  return (
    <div className="mb-12 text-center">
      <h1 className={`${typography.displayLg} mb-4`}>{title}</h1>
      <p className={`${typography.lead} mx-auto max-w-3xl`}>{subtitle}</p>
    </div>
  );
}
