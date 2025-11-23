import { Check } from 'lucide-react';
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
}

export default function FeatureCard({
  icon,
  title,
  description,
  features,
}: FeatureCardProps) {
  return (
    <div className="bg-secondary rounded-xl p-8 shadow-md">
      <div className="bg-primary text-primary-foreground mb-6 flex h-14 w-14 items-center justify-center rounded-lg">
        {icon}
      </div>
      <h3 className="mb-3 text-2xl font-bold">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
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
    </div>
  );
}
