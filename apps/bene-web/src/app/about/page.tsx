'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} />

      <main className="flex-grow container mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">About BeneFit</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our mission is to help you achieve your fitness goals through powerful tracking, analytics, and community support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-lg mb-4">
              BeneFit was founded in 2020 by a team of fitness enthusiasts and software engineers who were frustrated 
              with the lack of comprehensive tools available to track and analyze fitness progress.
            </p>
            <p className="text-lg mb-4">
              We recognized that people were using multiple apps to track different aspects of their fitness journey, 
              making it difficult to get a complete picture of their health and progress.
            </p>
            <p className="text-lg">
              Our solution brings together workout tracking, nutrition monitoring, progress analytics, and social 
              features in one powerful, easy-to-use platform.
            </p>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="bg-secondary rounded-xl p-8 w-full max-w-md">
              <div className="aspect-w-16 aspect-h-9 bg-background rounded-lg flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Our Mission</h3>
                  <p className="text-muted-foreground">
                    Empower individuals to take control of their health and fitness journey through data-driven insights and community support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Alex Johnson', role: 'CEO & Founder', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
              { name: 'Sarah Miller', role: 'CTO & Co-Founder', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { name: 'Michael Chen', role: 'Head of Product', image: 'https://randomuser.me/api/portraits/men/22.jpg' },
              { name: 'Emma Rodriguez', role: 'Lead Designer', image: 'https://randomuser.me/api/portraits/women/68.jpg' }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative mx-auto mb-4">
                  <div className="bg-secondary w-32 h-32 rounded-full overflow-hidden border-4 border-primary flex items-center justify-center">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-secondary p-8 rounded-xl shadow-md mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Trusted by Thousands</h3>
              <p className="text-muted-foreground">
                Over 100,000 active users track their fitness goals with our platform every day.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Comprehensive Tracking</h3>
              <p className="text-muted-foreground">
                Track workouts, nutrition, sleep, and more in one integrated platform.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Community Focused</h3>
              <p className="text-muted-foreground">
                Connect with friends and join challenges to stay motivated on your journey.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/signup" className="btn btn-primary text-lg px-8 py-4 mr-4">
            Join Our Community
          </Link>
          <Link href="/contact" className="btn btn-ghost text-lg px-8 py-4">
            Contact Us
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}