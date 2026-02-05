import { faker } from '@faker-js/faker';
import type { UserPreferences, Theme, Units, CheckInFrequency, CoachTone } from '../user-preferences.types.js';
import { userPreferencesFromPersistence } from '../user-preferences.factory.js';
//TODO more fake generation here
export function createUserPreferencesFixture(overrides?: Partial<UserPreferences>): UserPreferences {
  const data = {
    theme: faker.helpers.arrayElement(['light', 'dark', 'auto'] as Theme[]),
    units: faker.helpers.arrayElement(['metric', 'imperial'] as Units[]),
    language: 'EN',
    timezone: 'UTC',
    notifications: {
      workoutReminders: true,
      reminderTime: '09:00',
      coachCheckIns: true,
      teamActivity: false,
      weeklyReports: true,
      achievementAlerts: true,
      pushEnabled: true,
      emailEnabled: false,
    },
    privacy: {
      profileVisible: true,
      workoutsPublic: true,
      allowTeamInvites: true,
      showRealName: true,
      shareProgress: true,
    },
    coaching: {
      checkInFrequency: faker.helpers.arrayElement(['daily', 'weekly', 'biweekly', 'never'] as CheckInFrequency[]),
      tone: faker.helpers.arrayElement(['motivational', 'casual', 'professional', 'tough_love'] as CoachTone[]),
      proactiveAdvice: true,
      celebrateWins: true,
      receiveFormTips: true,
    },
    showRestTimers: true,
    autoProgressWeights: true,
    useVoiceAnnouncements: false,
    ...overrides,
  };

  const result = userPreferencesFromPersistence(data);

  if (result.isFailure) {
    throw new Error(`Failed to create UserPreferences fixture: ${ result.error }`);
  }

  return result.value;
}
