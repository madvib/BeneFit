export function isStreakActive(profile: UserProfile): boolean {
  if (!profile.stats.lastWorkoutDate) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastWorkout = new Date(profile.stats.lastWorkoutDate);
  lastWorkout.setHours(0, 0, 0, 0);

  const daysSince = Math.floor(
    (today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysSince <= 1; // Worked out today or yesterday
}

export function getDaysSinceLastWorkout(profile: UserProfile): number | null {
  if (!profile.stats.lastWorkoutDate) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastWorkout = new Date(profile.stats.lastWorkoutDate);
  lastWorkout.setHours(0, 0, 0, 0);

  return Math.floor(
    (today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function getAverageWorkoutDuration(profile: UserProfile): number {
  if (profile.stats.totalWorkouts === 0) {
    return 0;
  }

  return Math.round(profile.stats.totalMinutes / profile.stats.totalWorkouts);
}

export function hasAchievement(profile: UserProfile, achievementId: string): boolean {
  return profile.stats.achievements.some(a => a.id === achievementId);
}

export function shouldReceiveCheckIn(profile: UserProfile): boolean {
  const frequency = profile.preferences.coaching.checkInFrequency;

  if (frequency === 'never') {
    return false;
  }

  const daysSince = getDaysSinceLastWorkout(profile);

  if (daysSince === null) {
    return true; // No workouts yet, should check in
  }

  switch (frequency) {
    case 'daily':
      return daysSince >= 1;
    case 'weekly':
      return daysSince >= 7;
    case 'biweekly':
      return daysSince >= 14;
    default:
      return false;
  }
}