'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-12">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to <span className="text-primary">BeneFit</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-xl">
              Your ultimate fitness companion. Track your workouts, monitor your progress, and achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/feed">
                <Button className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/features">
                <Button className="btn-ghost text-lg px-8 py-4 w-full sm:w-auto border border-secondary">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-2xl">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-accent transform transition-transform duration-300 hover:scale-[1.02]">
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
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
        
        {/* Features section for better mobile viewing */}
        <div className="mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why Choose BeneFit?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-secondary/30 p-6 rounded-xl border border-accent">
              <div className="text-primary text-3xl mb-4">🏃</div>
              <h3 className="text-xl font-semibold mb-2">Track Everything</h3>
              <p className="text-muted-foreground">Monitor your workouts, nutrition, and progress with detailed analytics.</p>
            </div>
            <div className="bg-secondary/30 p-6 rounded-xl border border-accent">
              <div className="text-primary text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Set Goals</h3>
              <p className="text-muted-foreground">Create and achieve personalized fitness goals with our smart system.</p>
            </div>
            <div className="bg-secondary/30 p-6 rounded-xl border border-accent">
              <div className="text-primary text-3xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground">Connect with like-minded individuals on your wellness journey.</p>
            </div>
          </div>
        </div>
      
            </div>
            
    </div>
  );
}