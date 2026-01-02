'use client';

import { Camera } from 'lucide-react';
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
    <div className="mb-6 flex flex-col items-center gap-6">
      <div className="relative">
        <Image
          src={profilePicture}
          alt="Profile picture"
          width={120}
          height={120}
          className="border-primary rounded-full border-4 object-cover"
        />
        <button
          className="bg-primary text-primary-foreground hover:bg-primary/90 absolute right-2 bottom-2 rounded-full p-2 shadow-md"
          onClick={onEditPicture}
        >
          <Camera />
        </button>
      </div>

      <div className="text-center">
        <h3 className="text-2xl font-bold sm:text-3xl">{name}</h3>
        <p className="text-muted-foreground mb-4">{bio}</p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <div className="bg-background min-w-20 rounded-lg p-3 text-center sm:min-w-25">
            <p className="text-xl font-bold sm:text-2xl">{totalWorkouts}</p>
            <p className="text-muted-foreground text-xs sm:text-sm">Workouts</p>
          </div>
          <div className="bg-background min-w-20 rounded-lg p-3 text-center sm:min-w-25">
            <p className="text-xl font-bold sm:text-2xl">{currentStreak}</p>
            <p className="text-muted-foreground text-xs sm:text-sm">Days Streak</p>
          </div>
          <div className="bg-background min-w-20 rounded-lg p-3 text-center sm:min-w-25">
            <p className="text-xl font-bold sm:text-2xl">{totalAchievements}</p>
            <p className="text-muted-foreground text-xs sm:text-sm">Achievements</p>
          </div>
        </div>
      </div>
    </div>
  );
}
