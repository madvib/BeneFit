import { Check } from 'lucide-react';
import { ReactNode } from 'react';
import { IconBox, SpotlightCard, typography } from '@/lib/components';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
}

export default function FeatureCard({ icon, title, description, features }: FeatureCardProps) {
  return (
    <SpotlightCard className="custom-spotlight-card">
      <IconBox size="xl" className="mb-6">
        {icon}
      </IconBox>
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
