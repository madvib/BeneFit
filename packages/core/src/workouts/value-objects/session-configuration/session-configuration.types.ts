interface SessionConfigurationData {
  isMultiplayer: boolean;
  isPublic: boolean; // Can anyone join?
  maxParticipants: number;
  allowSpectators: boolean;
  enableChat: boolean;
  enableVoiceAnnouncements: boolean;
  showOtherParticipantsProgress: boolean;
  autoAdvanceActivities: boolean;
}

export type SessionConfiguration = Readonly<SessionConfigurationData>;
