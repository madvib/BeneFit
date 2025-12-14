
import { UseCaseFactory } from '../../factories/use-case-factory';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

interface CoachState {
  conversation: ChatMessage[];
}

export class CoachFeature {
  constructor(
    private state: DurableObjectState,
    protected useCaseFactory: UseCaseFactory
  ) { }

  /**
   * Main entry point for WebSocket chat messages
   */
  async handleMessage(ws: WebSocket, data: { userId: string; message: string }) {
    // 1. Persist User Message
    const userMsg: ChatMessage = {
      role: 'user',
      content: data.message,
      timestamp: new Date().toISOString(),
    };
    await this.appendMessage(userMsg);

    // 2. Execute Use Case (Orchestration)
    // Using the factory to get the use case.
    // In a real implementation, we might pass the history to the use case 
    // or the use case might retrieve it from a repository.
    // For now, we assume the use case handles the AI interaction.
    // Using the factory to get the use case.
    // In a real implementation, we might pass the history to the use case 
    // or the use case might retrieve it from a repository.
    // For now, we assume the use case handles the AI interaction.
    const useCase = this.useCaseFactory.getSendMessageToCoachUseCase();

    // We might need to pass conversation history here if the use case requires it
    const response = await useCase.execute({
      userId: data.userId,
      message: data.message,
    });

    // 3. Persist AI Response
    const aiMsg: ChatMessage = {
      role: 'assistant',
      content: JSON.stringify(response), // Simplified for placeholder
      timestamp: new Date().toISOString(),
    };
    await this.appendMessage(aiMsg);

    // 4. Respond to Client
    ws.send(
      JSON.stringify({
        type: 'chat_response',
        message: aiMsg.content,
        timestamp: aiMsg.timestamp,
      })
    );
  }

  /**
   * Helper to manage state consistency
   */
  private async appendMessage(msg: ChatMessage) {
    let conversation = await this.state.storage.get<ChatMessage[]>('coachConversation');
    if (!conversation) {
      conversation = [];
    }
    conversation.push(msg);
    await this.state.storage.put('coachConversation', conversation);
  }

  /**
   * Retrieve conversation history (RPC method)
   */
  async getHistory() {
    return (await this.state.storage.get<ChatMessage[]>('coachConversation')) || [];
  }

  async sendMessage(input: { userId: string; message: string }) {
    // 1. Execute Use Case
    const useCase = this.useCaseFactory.getSendMessageToCoachUseCase();
    const result = await useCase.execute({
      userId: input.userId,
      message: input.message,
    });

    if (result.isFailure) {
      throw new Error(String(result.error));
    }

    const value = result.value;

    // 2. Persist/Append to local state if needed for WS broadcasting?
    // The use case likely persists to DB. 
    // If we want WS clients to know, we might need to broadcast or appending to local list 
    // if local state 'coachConversation' is serving as a cache.
    // However, since we are moving to proper repo-based architecture, we should rely on repo or use a different mechanism.
    // For "bootstrap", I will fetch the latest history or just append the result messages to keep WS state in sync for now.

    // For now, let's just return the response
    return { response: value.coachResponse, actions: value.actions };
  }
}
