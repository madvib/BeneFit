import { Result } from '@bene/shared';
import { CoachConversation } from '../../core/index.js';

export interface CoachConversationRepository {
  findById(id: string): Promise<Result<CoachConversation>>;
  findByUserId(userId: string): Promise<Result<CoachConversation>>;
  save(conversation: CoachConversation): Promise<Result<void>>;
}
