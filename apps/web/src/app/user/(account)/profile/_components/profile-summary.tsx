import { Camera } from 'lucide-react';
import { CountUp, ShinyText } from '@/lib/components';

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

  return (
    <div className="mb-6 flex flex-col items-center gap-6">
      <div className="relative">
        {/* TODO: Implement photo upload functionality */}
        <div className="border-primary relative h-32 w-32 overflow-hidden rounded-full border-4">
          <img
            src={avatarUrl}
            alt={`${name}'s profile`}
            className="h-full w-full object-cover"
            onError={(e) => {
              // Double fallback to UI Avatars if the image fails to load
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366F1&color=fff&size=128`;
            }}
          />
        </div>
        <button
          className="bg-primary text-primary-foreground hover:bg-primary/90 absolute right-2 bottom-2 rounded-full p-2 shadow-md"
          onClick={onEditPicture}
          title="Upload Photo (Coming Soon)"
        >
          <Camera size={20} />
        </button>
      </div>

      <div className="text-center">
        <h3 className="mb-1 text-2xl font-bold sm:text-3xl">
          <ShinyText text={name} speed={3} className="justify-center" />
        </h3>
        <p className="text-muted-foreground mb-4">{bio}</p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <div className="bg-background min-w-24 rounded-lg p-3 text-center shadow-sm sm:min-w-28">
            <p className="text-xl font-bold sm:text-2xl">
              <CountUp from={0} to={totalWorkouts} duration={1.5} />
            </p>
            <p className="text-muted-foreground text-xs sm:text-sm">🏋️ Workouts</p>
          </div>
          <div className="bg-background min-w-24 rounded-lg p-3 text-center shadow-sm sm:min-w-28">
            <p className="text-xl font-bold sm:text-2xl">
              <CountUp from={0} to={currentStreak} duration={1.5} />
            </p>
            <p className="text-muted-foreground text-xs sm:text-sm">🔥 Streak</p>
          </div>
          <div className="bg-background min-w-24 rounded-lg p-3 text-center shadow-sm sm:min-w-28">
            <p className="text-xl font-bold sm:text-2xl">
              <CountUp from={0} to={totalAchievements} duration={1.5} />
            </p>
            <p className="text-muted-foreground text-xs sm:text-sm">🏆 Achievements</p>
          </div>
        </div>
      </div>
    </div>
  );
}
