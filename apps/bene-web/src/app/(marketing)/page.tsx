'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to BeneFit</h1>
          <p className="text-lg md:text-xl mb-8">Your ultimate fitness companion. Track your workouts, monitor your progress, and achieve your goals.</p>
          <Link href="/feed">
            <Button className="btn-primary text-lg px-8 py-3">
              Get Started
            </Button>
          </Link>
        </div>
        
        <div className="mt-8 md:mt-12 rounded-xl overflow-hidden shadow-lg max-w-4xl mx-auto">
          <div className="aspect-video w-full">
            <Image
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Fitness and wellness"
              width={2070}
              height={1000}
              className="w-full h-full object-cover"
              priority={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
