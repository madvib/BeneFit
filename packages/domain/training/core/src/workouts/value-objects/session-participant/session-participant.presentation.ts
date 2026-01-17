import { z } from 'zod';
import { SessionParticipant } from './session-participant.types.js';

export const ParticipantRoleSchema = z.enum(['owner', 'participant', 'spectator']);
export const ParticipantStatusSchema = z.enum(['active', 'paused', 'completed', 'left']);

export const SessionParticipantSchema = z.object({
  userId: z.string(),
  userName: z.string().min(1).max(100),
  avatar: z.string().url().optional(),
  role: ParticipantRoleSchema,
  status: ParticipantStatusSchema,
  joinedAt: z.iso.datetime(),
  leftAt: z.iso.datetime().optional(),
  currentActivity: z.string().min(1).max(100).optional(),
  completedActivities: z.number().int().min(0).max(100),
});

export type SessionParticipantPresentation = z.infer<typeof SessionParticipantSchema>;

export function toSessionParticipantSchema(participant: SessionParticipant): SessionParticipantPresentation {
  return {
    userId: participant.userId,
    userName: participant.userName,
    avatar: participant.avatar,
    role: participant.role,
    status: participant.status,
    joinedAt: participant.joinedAt.toISOString(),
    leftAt: participant.leftAt?.toISOString(),
    currentActivity: participant.currentActivity,
    completedActivities: participant.completedActivities,
  };
}
