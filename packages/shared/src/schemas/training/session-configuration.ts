import { z } from 'zod';

// Session Configuration Schemas

export const SessionConfigurationSchema = z.object({
  isMultiplayer: z.boolean(),
  isPublic: z.boolean(), // Can anyone join?
  maxParticipants: z.number(),
  allowSpectators: z.boolean(),
  enableChat: z.boolean(),
  enableVoiceAnnouncements: z.boolean(),
  showOtherParticipantsProgress: z.boolean(),
  autoAdvanceActivities: z.boolean(),
});

// Export inferred types
export type SessionConfiguration = z.infer<typeof SessionConfigurationSchema>;
