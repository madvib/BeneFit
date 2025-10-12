'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto p-8">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-bold mb-4">Welcome to BeneFit</h2>
          <p className="text-xl mb-8">Your ultimate fitness companion. Track your workouts, monitor your progress, and achieve your goals.</p>
          <Link href="/dashboard">
            <Button className="btn-primary text-lg">
              Get Started
            </Button>
          </Link>
        </div>
        
        <div className="mt-12 rounded-xl overflow-hidden shadow-lg max-w-4xl mx-auto">
          <Image
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Fitness and wellness"
            width={2070}
            height={1000}
            className="w-full h-auto object-cover"
            priority={false}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
