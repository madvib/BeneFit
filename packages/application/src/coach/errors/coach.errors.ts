// Define custom error types for coach in the application layer
export class CoachError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CoachError";
  }
}

// Define specific error types for coach
export class InitialMessagesFetchError extends CoachError {
  constructor(chatId: string) {
    super(`Failed to fetch initial messages for chat ${chatId}`);
    this.name = "InitialMessagesFetchError";
  }
}

export class SavedChatsFetchError extends CoachError {
  constructor() {
    super("Failed to fetch saved chats");
    this.name = "SavedChatsFetchError";
  }
}

export class RecommendationsFetchError extends CoachError {
  constructor() {
    super("Failed to fetch recommendations");
    this.name = "RecommendationsFetchError";
  }
}

export class ChatNotFoundError extends CoachError {
  constructor(chatId: string) {
    super(`Chat with ID ${chatId} not found`);
    this.name = "ChatNotFoundError";
  }
}

export class MessageSendError extends CoachError {
  constructor() {
    super("Failed to send message");
    this.name = "MessageSendError";
  }
}