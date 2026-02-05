import { z } from 'zod';

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

export type SessionConfiguration = Readonly<z.infer<typeof SessionConfigurationSchema>>;

