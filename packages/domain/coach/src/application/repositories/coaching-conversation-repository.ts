import { Result } from '@bene/shared-domain';
import { CoachingConversation } from '@core/index.js';

export interface CoachingConversationRepository {
  findById(id: string): Promise<Result<CoachingConversation>>;
  findByUserId(userId: string): Promise<Result<CoachingConversation>>;
  save(conversation: CoachingConversation): Promise<Result<void>>;
}
