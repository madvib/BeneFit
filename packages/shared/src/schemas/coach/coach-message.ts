import { z } from 'zod';
import { CoachActionSchema } from './coach-action.js';

// Coach Message Schemas

export const MessageRoleSchema = z.enum(['user', 'coach', 'system']);

export const CoachMessageSchema = z.object({
  id: z.string(),
  role: MessageRoleSchema,
  content: z.string(),
  actions: z.array(CoachActionSchema).optional(),
  checkInId: z.string().optional(),
  timestamp: z.string(), // ISO date string
  tokens: z.number().optional(),
});

// Export inferred types
export type MessageRole = z.infer<typeof MessageRoleSchema>;
export type CoachMessage = z.infer<typeof CoachMessageSchema>;
