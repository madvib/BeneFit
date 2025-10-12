'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} />

      <main className="flex-grow container mx-auto p-8">
        <h2 className="text-4xl font-bold mb-8">Profile</h2>
        
        <div className="bg-secondary p-6 rounded-lg shadow-md max-w-3xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
            <div className="relative">
              <Image
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Profile picture"
                width={120}
                height={120}
                className="rounded-full object-cover border-4 border-primary"
              />
              <button className="absolute bottom-2 right-2 bg-primary text-primary-foreground rounded-full p-2 shadow-md hover:bg-primary/90">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-bold">John Doe</h3>
              <p className="text-muted-foreground mb-2">Fitness Enthusiast</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <div className="bg-background p-3 rounded-lg text-center min-w-[100px]">
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-sm text-muted-foreground">Workouts</p>
                </div>
                <div className="bg-background p-3 rounded-lg text-center min-w-[100px]">
                  <p className="text-2xl font-bold">42</p>
                  <p className="text-sm text-muted-foreground">Days Streak</p>
                </div>
                <div className="bg-background p-3 rounded-lg text-center min-w-[100px]">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Achievements</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-4">About Me</h3>
            <textarea 
              className="w-full p-3 rounded border border-muted bg-background min-h-[120px]"
              defaultValue="Fitness enthusiast who loves running, weight training, and maintaining a healthy lifestyle. Always looking to improve and reach new goals!"
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Fitness Goals</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Run a marathon</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Lose 10kg</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Build 20lbs muscle</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Statistics</h3>
              <div className="bg-background p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Total Distance:</span>
                  <span className="font-semibold">245 km</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Total Calories:</span>
                  <span className="font-semibold">12,800 cal</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Avg. Heart Rate:</span>
                  <span className="font-semibold">145 bpm</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Workout:</span>
                  <span className="font-semibold">Today</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button className="btn btn-primary">Save Profile</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}