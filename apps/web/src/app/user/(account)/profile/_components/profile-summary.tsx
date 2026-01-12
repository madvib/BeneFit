import { Camera, Trophy, Flame, Dumbbell } from 'lucide-react';
import { CountUp, typography } from '@/lib/components';

interface ProfileSummaryProps {
  name: string;
  bio: string;
  profilePicture?: string;
  totalWorkouts: number;
  currentStreak: number;
  totalAchievements: number;
  onEditPicture: () => void;
}

export default function ProfileSummary({
  name,
  bio,
  profilePicture,
  totalWorkouts,
  currentStreak,
  totalAchievements,
  onEditPicture,
}: ProfileSummaryProps) {
  // Use UI Avatars as a robust fallback if no profile picture is provided
  const avatarUrl =
    profilePicture && profilePicture !== '/default-avatar.png'
      ? profilePicture
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366F1&color=fff&size=128`;

  const stats = [
    {
      label: 'Workouts',
      value: totalWorkouts,
      icon: Dumbbell,
      color: 'text-blue-500',
      bgCallback: 'bg-blue-500/10',
    },
    {
      label: 'Streak',
      value: currentStreak,
      icon: Flame,
      color: 'text-orange-500',
      bgCallback: 'bg-orange-500/10',
    },
    {
      label: 'Trophies',
      value: totalAchievements,
      icon: Trophy,
      color: 'text-yellow-500',
      bgCallback: 'bg-yellow-500/10',
    },
  ];

  return (
    <div className="relative mb-4 flex flex-col items-center">
      {/* Hero Background */}
      <div className="from-primary/10 to-background absolute inset-x-0 -top-16 -z-10 h-48 overflow-hidden rounded-b-[3rem] bg-gradient-to-b opacity-50 blur-xl" />

      <div className="mb-4 flex flex-col items-center gap-4">
        <div className="group relative">
          {/* Avatar Container */}
          <div className="border-background ring-primary/10 relative h-28 w-28 overflow-hidden rounded-full border-4 shadow-xl ring-4 transition-transform duration-500 hover:scale-105">
            <img
              src={avatarUrl}
              alt={`${name}'s profile`}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366F1&color=fff&size=128`;
              }}
            />
          </div>
          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 absolute right-0 bottom-2 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110"
            onClick={onEditPicture}
            title="Upload Photo (Coming Soon)"
          >
            <Camera size={18} />
          </button>
        </div>

        <div className="mx-auto max-w-lg text-center">
          <h1 className={`${typography.h1} mb-1 sm:text-4xl`}>{name}</h1>
          {bio && <p className={typography.muted}>{bio}</p>}
        </div>

        {/* Stats Grid */}
        <div className="flex w-full items-center justify-center gap-10 py-2 sm:gap-14">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <div className="mb-0.5 flex items-center gap-2">
                <stat.icon size={16} className={`${stat.color} opacity-80`} />
                <h3 className={typography.displayMd}>
                  <CountUp from={0} to={stat.value} duration={1.5} />
                </h3>
              </div>
              <p className={typography.displaySm}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
