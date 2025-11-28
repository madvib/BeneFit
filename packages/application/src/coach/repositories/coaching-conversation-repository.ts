import { Result } from '@bene/core/shared';
import { CoachingConversation } from '@bene/core/coach';

export interface CoachingConversationRepository {
  findById(id: string): Promise<Result<CoachingConversation>>;
  findByUserId(userId: string): Promise<Result<CoachingConversation>>;
  save(conversation: CoachingConversation): Promise<Result<void>>;
}