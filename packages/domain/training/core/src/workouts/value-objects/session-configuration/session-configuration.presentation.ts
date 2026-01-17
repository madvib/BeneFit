import { z } from 'zod';
import { SessionConfiguration } from './session-configuration.types.js';

export const SessionConfigurationSchema = z.object({
  isMultiplayer: z.boolean(),
  isPublic: z.boolean(),
  maxParticipants: z.number().int().min(1).max(100),
  allowSpectators: z.boolean(),
  enableChat: z.boolean(),
  enableVoiceAnnouncements: z.boolean(),
  showOtherParticipantsProgress: z.boolean(),
  autoAdvanceActivities: z.boolean(),
});

export type SessionConfigurationPresentation = z.infer<typeof SessionConfigurationSchema>;

export function toSessionConfigurationSchema(config: SessionConfiguration): SessionConfigurationPresentation {
  return {
    isMultiplayer: config.isMultiplayer,
    isPublic: config.isPublic,
    maxParticipants: config.maxParticipants,
    allowSpectators: config.allowSpectators,
    enableChat: config.enableChat,
    enableVoiceAnnouncements: config.enableVoiceAnnouncements,
    showOtherParticipantsProgress: config.showOtherParticipantsProgress,
    autoAdvanceActivities: config.autoAdvanceActivities,
  };
}
