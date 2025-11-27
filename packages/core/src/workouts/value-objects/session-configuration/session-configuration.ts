export interface SessionConfiguration {
  isMultiplayer: boolean;
  isPublic: boolean; // Can anyone join?
  maxParticipants: number;
  allowSpectators: boolean;
  enableChat: boolean;
  enableVoiceAnnouncements: boolean;
  showOtherParticipantsProgress: boolean;
  autoAdvanceActivities: boolean;
}