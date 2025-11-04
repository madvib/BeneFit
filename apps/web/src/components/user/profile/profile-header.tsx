'use client';

import Image from 'next/image';

interface ProfileHeaderProps {
  name: string;
  bio: string;
  profilePicture: string;
  totalWorkouts: number;
  currentStreak: number;
  totalAchievements: number;
  onEditPicture: () => void;
}

export default function ProfileHeader({
  name,
  bio,
  profilePicture,
  totalWorkouts,
  currentStreak,
  totalAchievements,
  onEditPicture,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-6 mb-6">
      <div className="relative">
        <Image
          src={profilePicture}
          alt="Profile picture"
          width={120}
          height={120}
          className="rounded-full object-cover border-4 border-primary"
        />
        <button
          className="absolute bottom-2 right-2 bg-primary text-primary-foreground rounded-full p-2 shadow-md hover:bg-primary/90"
          onClick={onEditPicture}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>

      <div className="text-center">
        <h3 className="text-2xl sm:text-3xl font-bold">{name}</h3>
        <p className="text-muted-foreground mb-4">{bio}</p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <div className="bg-background p-3 rounded-lg text-center min-w-[80px] sm:min-w-[100px]">
            <p className="text-xl sm:text-2xl font-bold">{totalWorkouts}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Workouts</p>
          </div>
          <div className="bg-background p-3 rounded-lg text-center min-w-[80px] sm:min-w-[100px]">
            <p className="text-xl sm:text-2xl font-bold">{currentStreak}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Days Streak</p>
          </div>
          <div className="bg-background p-3 rounded-lg text-center min-w-[80px] sm:min-w-[100px]">
            <p className="text-xl sm:text-2xl font-bold">{totalAchievements}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Achievements</p>
          </div>
        </div>
      </div>
    </div>
  );
}
