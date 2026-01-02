import Link from 'next/link';
import { ChartColumnBig, Gift, Zap } from 'lucide-react';
import { Button, LogoLoop } from '@/lib/components';
import { FeaturesHero, FeatureCard } from './#components';
import { ROUTES } from '@/lib/constants';

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
      alt: 'Apple Health',
      src: '/connection_logos/icons8-apple-fitness-48.png',
    },
    {
      alt: 'Google Fit',
      src: '/connection_logos/google-fit-svgrepo-com.svg',
    },
    {
      alt: 'Strava',
      src: '/connection_logos/strava-svgrepo-com.svg',
    },
    {
      alt: 'Fitbit',
      src: '/connection_logos/icons8-fitbit-48.png',
    },
    {
      alt: 'WHOOP',
      src: '/connection_logos/whoop.svg',
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

      <div className="bg-background rounded-xl p-8 shadow-md">
        <h2 className="mb-6 text-center text-3xl font-bold">Connect with Your Favorite Apps</h2>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-center">
          Seamlessly integrate with popular fitness and health platforms to get a complete picture
          of your wellness journey.
        </p>
      </div>
      <LogoLoop
        className="my-16"
        logos={connectionServices}
        speed={50}
        direction="left"
        logoHeight={48}
        gap={40}
        hoverSpeed={10}
        scaleOnHover
        fadeOut
        fadeOutColor="var(--background)"
        ariaLabel="Integrations"
      />

      <div className="text-center">
        <Button size={'lg'}>
          <Link href={ROUTES.MODAL.SIGNUP}>Get Started Today</Link>
        </Button>
      </div>
    </div>
  );
}
