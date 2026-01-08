import { SpotlightCard } from '@/lib/components';

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
      <h2 className="mb-12 text-center text-2xl font-bold md:text-3xl">{title}</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {features.map((feature, index) => (
          <SpotlightCard key={index} className="custom-spotlight-card">
            <div className="flex flex-col items-center text-center">
              <div className="text-primary mb-4 text-3xl">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}
