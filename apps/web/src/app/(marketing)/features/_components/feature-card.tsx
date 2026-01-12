import { Check } from 'lucide-react';
import { ReactNode } from 'react';
import { SpotlightCard, typography } from '@/lib/components';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
}

export default function FeatureCard({ icon, title, description, features }: FeatureCardProps) {
  return (
    <SpotlightCard className="custom-spotlight-card">
      <div className="bg-primary text-primary-foreground mb-6 flex h-14 w-14 items-center justify-center rounded-lg">
        {icon}
      </div>
      <h3 className={`${typography.h3} mb-3`}>{title}</h3>
      <p className={`${typography.p} text-muted-foreground mb-4`}>{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <div className="text-background mr-2 flex h-5 w-5 items-center rounded-full bg-green-500">
              <Check className="p-0.5" />
            </div>

            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </SpotlightCard>
  );
}
