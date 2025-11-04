import Link from 'next/link';
import {
  FeaturesHero,
  FeatureCard,
  ConnectionServicesSection,
} from '@/components/marketing/features';

export default function FeaturesPage() {
  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: 'Workout Tracking',
      description:
        'Log and track all your workouts with detailed metrics, sets, reps, and weights. Create custom workout routines and follow structured programs.',
      features: ['Custom workout routines', 'Progress tracking', 'Workout reminders'],
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
          />
        </svg>
      ),
      title: 'Nutrition Tracking',
      description:
        'Monitor your calorie intake, macro nutrients, and meal plans. Connect with nutrition databases to quickly log your meals.',
      features: ['Food database', 'Macro tracking', 'Meal planning'],
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
        <Link href="/signup" className="btn btn-primary text-lg px-8 py-4">
          Get Started Today
        </Link>
      </div>
    </div>
  );
}
