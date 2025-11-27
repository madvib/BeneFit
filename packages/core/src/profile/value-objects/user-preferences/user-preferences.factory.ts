export * from './user-preferences.types.js';
export function createDefaultPreferences(): UserPreferences {
  return {
    theme: 'auto',
    units: 'metric',
    notifications: {
      workoutReminders: true,
      reminderTime: '09:00',
      coachCheckIns: true,
      teamActivity: true,
      weeklyReports: true,
      achievementAlerts: true,
      pushEnabled: true,
      emailEnabled: true
    },
    privacy: {
      profileVisible: true,
      workoutsPublic: true,
      allowTeamInvites: true,
      showRealName: true,
      shareProgress: true
    },
    coaching: {
      checkInFrequency: 'weekly',
      tone: 'motivational',
      proactiveAdvice: true,
      celebrateWins: true,
      receiveFormTips: true
    },
    showRestTimers: true,
    autoProgressWeights: true,
    useVoiceAnnouncements: false
  };
}