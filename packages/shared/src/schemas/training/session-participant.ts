import { z } from 'zod';

// Session Participant Schemas

export const ParticipantRoleSchema = z.enum(['owner', 'participant', 'spectator']);

export const ParticipantStatusSchema = z.enum(['active', 'paused', 'completed', 'left']);

export const SessionParticipantSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  avatar: z.string().optional(),
  role: ParticipantRoleSchema,
  status: ParticipantStatusSchema,
  joinedAt: z.string(), // ISO date string
  leftAt: z.string().optional(), // ISO date string
  currentActivity: z.string().optional(), // What activity they're on
  completedActivities: z.number(),
});

// Export inferred types
export type ParticipantRole = z.infer<typeof ParticipantRoleSchema>;
export type ParticipantStatus = z.infer<typeof ParticipantStatusSchema>;
export type SessionParticipant = z.infer<typeof SessionParticipantSchema>;
