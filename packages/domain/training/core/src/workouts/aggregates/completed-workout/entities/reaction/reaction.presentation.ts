import { z } from 'zod';
import { Reaction } from './reaction.types.js';


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
  userName: z.string().min(1).max(100),
  type: ReactionTypeSchema,
  createdAt: z.iso.datetime(),
});

export type ReactionType = z.infer<typeof ReactionTypeSchema>;
export type ReactionPresentation = z.infer<typeof ReactionSchema>;

// Deprecated: Use toReactionView from factory instead
export function toReactionPresentation(reaction: Reaction): ReactionPresentation {
  throw new Error("Use toReactionView from factory");
}
