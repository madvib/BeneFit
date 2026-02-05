import { z } from 'zod';

/**
 * 1. DEFINE SCHEMAS (Zod as Source of Truth)
 */
export const ReactionTypeSchema = z.enum([
  'fire',   // 🔥 killed it
  'strong', // 💪 strong work
  'clap',   // 👏 nice job
  'heart',  // ❤️ love this
  'smile',  // 😊 happy for you
]);

export const ReactionSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  userName: z.string().min(1).max(100),
  type: ReactionTypeSchema,
  createdAt: z.coerce.date<Date>(),
});

/**
 * 2. INFER TYPES (Derived directly from Zod)
 */
export type ReactionType = z.infer<typeof ReactionTypeSchema>;
export type Reaction = Readonly<z.infer<typeof ReactionSchema>>;

