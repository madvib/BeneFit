import { Camera } from 'lucide-react';
import { PROFILE_STATS_CONFIG } from '@/lib/constants/training-ui';
import { CountUp, MetricCard, typography } from '@/lib/components';
import { type UserProfile, type UserStats } from '@bene/react-api-client';

interface ProfileSummaryProps {
  profile: UserProfile;
  stats: UserStats;
  onEditPicture: () => void;
}

export default function ProfileSummary({
  profile,
  stats: userStats,
  onEditPicture,
}: ProfileSummaryProps) {
  const { displayName: name, avatar: profilePicture, bio } = profile;
  const { totalWorkouts, currentStreak, achievements } = userStats;
  const totalAchievements = achievements.length;
  // Use UI Avatars as a robust fallback if no profile picture is provided
  const avatarUrl =
    profilePicture && profilePicture !== '/default-avatar.png'
      ? profilePicture
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366F1&color=fff&size=128`;

  const stats = [
    {
      key: 'workouts',
      value: totalWorkouts,
    },
    {
      key: 'streak',
      value: currentStreak,
    },
    {
      key: 'trophies',
      value: totalAchievements,
    },
  ] as const;

  return (
    <div className="relative mb-4 flex flex-col items-center">
      {/* Hero Background */}
      <div className="from-primary/10 to-background absolute inset-x-0 -top-16 -z-10 h-48 overflow-hidden rounded-b-[3rem] bg-linear-to-b opacity-50 blur-xl" />

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
        <div className="flex w-full items-center justify-center gap-4 py-2 sm:gap-6">
          {stats.map((stat) => {
            const config = PROFILE_STATS_CONFIG[stat.key];
            if (!config) return null;
            
            return (
              <MetricCard
                key={stat.key}
                label={config.label}
                value={<CountUp from={0} to={stat.value} duration={1.5} />}
                icon={config.icon}
                className="border-none bg-transparent shadow-none"
                bodyClassName="items-center p-0"
                iconClassName={config.iconClass}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
