import { z } from 'zod';
import { CoachContextSchema } from './coach-context.js';
import { CoachMessageSchema } from './coach-message.js';
import { CheckInSchema } from './check-in.js';

// Coach Conversation Schemas

export const CoachConversationSchema = z.object({
  id: z.string(),
  context: CoachContextSchema,
  messages: z.array(CoachMessageSchema),
  checkIns: z.array(CheckInSchema),
  totalMessages: z.number(),
  totalUserMessages: z.number(),
  totalCoachMessages: z.number(),
  totalCheckIns: z.number(),
  pendingCheckIns: z.number(),
  startedAt: z.string(), // ISO date string
  lastMessageAt: z.string(), // ISO date string
});

// Export inferred types
export type CoachConversation = z.infer<typeof CoachConversationSchema>;
