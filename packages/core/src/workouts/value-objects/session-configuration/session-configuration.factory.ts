import { SessionConfiguration } from "./session-configuration.js";

export function createDefaultSessionConfig(isMultiplayer: boolean): SessionConfiguration {
  return {
    isMultiplayer,
    isPublic: false,
    maxParticipants: isMultiplayer ? 10 : 1,
    allowSpectators: false,
    enableChat: isMultiplayer,
    enableVoiceAnnouncements: true,
    showOtherParticipantsProgress: isMultiplayer,
    autoAdvanceActivities: false
  };
}
