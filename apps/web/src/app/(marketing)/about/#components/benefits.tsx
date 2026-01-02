import { SpotlightCard } from '@/lib/components';
import { BadgeCheck, Heart, Zap } from 'lucide-react';

export default function Benefits() {
  const benefits = [
    {
      icon: <BadgeCheck />,
      title: 'Trusted by Thousands',
      description:
        'Over 100,000 active users track their fitness goals with our platform every day.',
    },
    {
      icon: <Zap />,
      title: 'Comprehensive Tracking',
      description: 'Track workouts, nutrition, sleep, and more in one integrated platform.',
    },
    {
      icon: <Heart />,
      title: 'Community Focused',
      description: 'Connect with friends and join challenges to stay motivated on your journey.',
    },
  ];

  return (
    <SpotlightCard className="mb-20">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {benefits.map((benefit, index) => (
          <div key={index} className="text-center">
            <div className="bg-primary text-primary-foreground mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              {benefit.icon}
            </div>
            <h3 className="mb-2 text-xl font-bold">{benefit.title}</h3>
            <p className="text-muted-foreground">{benefit.description}</p>
          </div>
        ))}
      </div>
    </SpotlightCard>
  );
}
