import { UseCase } from '@bene/core/shared';
import { CoachRepository } from '../../ports/coach.repository.js';
import { Message } from '@bene/core/coach';
import { Result } from '@bene/core/shared';
import { InitialMessagesFetchError } from '../../errors/index.js';

export interface GetInitialMessagesInput {
  chatId: string;
}
export type GetInitialMessagesOutput = Message[];

export class GetInitialMessagesUseCase
  implements UseCase<GetInitialMessagesInput, GetInitialMessagesOutput>
{
  constructor(private coachRepository: CoachRepository) {}

  async execute(
    input: GetInitialMessagesInput,
  ): Promise<Result<GetInitialMessagesOutput>> {
    try {
      const messages = await this.coachRepository.getInitialMessages(input.chatId);
      return Result.ok(messages);
    } catch (error) {
      console.error('Error in GetInitialMessagesUseCase:', error);
      return Result.fail(new InitialMessagesFetchError(input.chatId));
    }
  }
}
