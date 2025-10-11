import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} />

      <main className="flex-grow container mx-auto p-8">
        <h2 className="text-4xl font-bold mb-8">Welcome, User!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-secondary p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4">Workouts</h3>
            <p>Track your daily workouts and see your progress over time.</p>
          </div>
          <div className="bg-secondary p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4">Nutrition</h3>
            <p>Log your meals and monitor your calorie intake.</p>
          </div>
          <div className="bg-secondary p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4">Goals</h3>
            <p>Set new fitness goals and stay motivated.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}