import { UseCase } from '@bene/core/shared';
import { CoachRepository } from '../../ports/coach.repository.js';
import { Chat } from '@bene/core/coach';
import { Result } from '@bene/core/shared';
import { SavedChatsFetchError } from '../../errors/index.js';

export type GetSavedChatsInput = void;
export type GetSavedChatsOutput = Chat[];

export class GetSavedChatsUseCase
  implements UseCase<GetSavedChatsInput, GetSavedChatsOutput>
{
  constructor(private coachRepository: CoachRepository) {}

  async execute(): Promise<Result<GetSavedChatsOutput>> {
    try {
      const chats = await this.coachRepository.getSavedChats();
      return Result.ok(chats);
    } catch (error) {
      console.error('Error in GetSavedChatsUseCase:', error);
      return Result.fail(new SavedChatsFetchError());
    }
  }
}
