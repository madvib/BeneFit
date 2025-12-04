export type ReactionType =
  | 'fire' // 🔥 killed it
  | 'strong' // 💪 strong work
  | 'clap' // 👏 nice job
  | 'heart' // ❤️ love this
  | 'smile'; // 😊 happy for you

export interface ReactionData {
  id: string;
  userId: string;
  userName: string;
  type: ReactionType;
  createdAt: Date;
}

export type Reaction = Readonly<ReactionData>;
