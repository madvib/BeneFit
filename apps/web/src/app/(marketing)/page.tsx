'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from '@bene/react-api-client';
import { LoadingSpinner, ImageCard } from '@/lib/components';
import { HomeHero, FeaturesSection } from './#components';
import { ROUTES } from '@/lib/constants';

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const isDirectNavigation =
      globalThis.performance.getEntriesByType('navigation')[0]?.entryType === 'navigate';
    if (isDirectNavigation && isAuthenticated) router.replace(ROUTES.USER.ACTIVITIES);
  }, [isAuthenticated, isLoading, router]);

  const features = [
    {
      icon: '🏃',
      title: 'Track Everything',
      description: 'Monitor your workouts, nutrition, and progress with detailed analytics.',
    },
    {
      icon: '🎯',
      title: 'Set Goals',
      description: 'Create and achieve personalized fitness goals with our smart system.',
    },
    {
      icon: '👥',
      title: 'Community',
      description: 'Connect with like-minded individuals on your wellness journey.',
    },
  ];

  return isLoading ? (
    <LoadingSpinner variant="screen" />
  ) : (
    <div className="flex min-h-screen w-full items-center">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
          <HomeHero
            title="Welcome to"
            primaryWord="BeneFit"
            subtitle="Your ultimate fitness companion. Track your workouts, monitor your progress, and achieve your goals."
            primaryLink={{ href: ROUTES.MODAL.SIGNUP, text: 'Get Started' }}
            secondaryLink={{ href: ROUTES.FEATURES, text: 'Learn More' }}
          />

          <ImageCard
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Fitness and wellness"
            width={2070}
            height={1000}
          />
        </div>
        <FeaturesSection title="Why Choose BeneFit?" features={features} />
      </div>
    </div>
  );
}
