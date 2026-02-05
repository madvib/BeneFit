import { z } from 'zod';

export const ParticipantRoleSchema = z.enum(['owner', 'participant', 'spectator']);
export type ParticipantRole = z.infer<typeof ParticipantRoleSchema>;

export const ParticipantStatusSchema = z.enum(['active', 'paused', 'completed', 'left']);
export type ParticipantStatus = z.infer<typeof ParticipantStatusSchema>;

/**
 * 1. DEFINE PROPS SCHEMA
 */
export const SessionParticipantSchema = z.object({
  userId: z.uuid(),
  userName: z.string().min(1).max(100),
  avatar: z.url().optional(),
  role: ParticipantRoleSchema,
  status: ParticipantStatusSchema,
  joinedAt: z.coerce.date<Date>(),
  leftAt: z.coerce.date<Date>().optional(),
  currentActivity: z.string().min(1).max(100).optional(),
  completedActivities: z.number().int().min(0).max(100),
});

/**
 * 2. INFER TYPES
 */
export type SessionParticipant = Readonly<z.infer<typeof SessionParticipantSchema>>;

