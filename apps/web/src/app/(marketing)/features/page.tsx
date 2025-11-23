import Link from 'next/link';
import {
  FeaturesHero,
  FeatureCard,
  ConnectionServicesSection,
} from '@/components/marketing/features';
import { ChartColumnBig, Gift, Zap } from 'lucide-react';
import { Button } from '@/components';

export default function FeaturesPage() {
  const features = [
    {
      icon: <Zap />,
      title: 'Workout Tracking',
      description:
        'Log and track all your workouts with detailed metrics, sets, reps, and weights. Create custom workout routines and follow structured programs.',
      features: ['Custom workout routines', 'Progress tracking', 'Workout reminders'],
    },
    {
      icon: <Gift />,
      title: 'Nutrition Tracking',
      description:
        'Monitor your calorie intake, macro nutrients, and meal plans. Connect with nutrition databases to quickly log your meals.',
      features: ['Food database', 'Macro tracking', 'Meal planning'],
    },
    {
      icon: <ChartColumnBig />,
      title: 'Progress Analytics',
      description:
        'Visualize your progress with detailed analytics, charts, and insights. Set goals and track your achievements over time.',
      features: ['Performance charts', 'Goal tracking', 'Achievement badges'],
    },
  ];

  const connectionServices = [
    {
      name: 'Apple Health',
      logo: '/connection_logos/icons8-apple-fitness-48.png',
    },
    {
      name: 'Google Fit',
      logo: '/connection_logos/google-fit-svgrepo-com.svg',
    },
    {
      name: 'Strava',
      logo: '/connection_logos/strava-svgrepo-com.svg',
    },
    {
      name: 'Fitbit',
      logo: '/connection_logos/icons8-fitbit-48.png',
    },
    {
      name: 'WHOOP',
      logo: '/connection_logos/whoop.svg',
    },
  ];

  return (
    <div className="container mx-auto p-8">
      <FeaturesHero
        title="Powerful Features for Your Fitness Journey"
        subtitle="BeneFit provides everything you need to track, analyze, and improve your fitness performance."
      />

      <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            features={feature.features}
          />
        ))}
      </div>

      <ConnectionServicesSection
        title="Connect with Your Favorite Apps"
        subtitle="Seamlessly integrate with popular fitness and health platforms to get a complete picture of your wellness journey."
        services={connectionServices}
      />

      <div className="text-center">
        <Button size={'lg'}>
          <Link href="/signup">Get Started Today</Link>
        </Button>
      </div>
    </div>
  );
}
