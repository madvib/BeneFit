import { SpotlightCard, typography } from '@/lib/components';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  title: string;
  features: Feature[];
}

export default function FeaturesSection({ title, features }: FeaturesSectionProps) {
  return (
    <div className="mt-20">
      <h2 className={`${typography.h2} mb-12 text-center`}>{title}</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {features.map((feature, index) => (
          <SpotlightCard key={index} className="custom-spotlight-card">
            <div className="flex flex-col items-center text-center">
              <div className={`${typography.displaySm} text-primary mb-4`}>{feature.icon}</div>
              <h3 className={`${typography.h4} mb-2`}>{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}
