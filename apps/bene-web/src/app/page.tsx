import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto p-8 text-center">
        <h2 className="text-5xl font-bold mb-4">Welcome to BeneFit</h2>
        <p className="text-xl mb-8">Your ultimate fitness companion. Track your workouts, monitor your progress, and achieve your goals.</p>
        <Link href="/dashboard">
          <Button className="btn-primary text-lg">
            Get Started
          </Button>
        </Link>
      </main>

      <Footer />
    </div>
  );
}
