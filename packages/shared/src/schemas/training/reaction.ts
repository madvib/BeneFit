import { z } from 'zod';

// Reaction Schemas

export const ReactionTypeSchema = z.enum([
  'fire',   // 🔥 killed it
  'strong', // 💪 strong work
  'clap',   // 👏 nice job
  'heart',  // ❤️ love this
  'smile',  // 😊 happy for you
]);

export const ReactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userName: z.string(),
  type: ReactionTypeSchema,
  createdAt: z.string(), // ISO date string
});

// Export inferred types
export type ReactionType = z.infer<typeof ReactionTypeSchema>;
export type Reaction = z.infer<typeof ReactionSchema>;
