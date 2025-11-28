// Coach module exports

// Use cases
export { SendMessageToCoachUseCase } from './use-cases/send-message-to-coach/send-message-to-coach.js';
export type { SendMessageToCoachRequest, SendMessageToCoachResponse } from './use-cases/send-message-to-coach/send-message-to-coach.js';

export { TriggerProactiveCheckInUseCase } from './use-cases/trigger-proactive-check-in/trigger-proactive-check-in.js';
export type { TriggerProactiveCheckInRequest, TriggerProactiveCheckInResponse } from './use-cases/trigger-proactive-check-in/trigger-proactive-check-in.js';

export { RespondToCheckInUseCase } from './use-cases/respond-to-check-in/respond-to-check-in.js';
export type { RespondToCheckInRequest, RespondToCheckInResponse } from './use-cases/respond-to-check-in/respond-to-check-in.js';

export { DismissCheckInUseCase } from './use-cases/dismiss-check-in/dismiss-check-in.js';
export type { DismissCheckInRequest, DismissCheckInResponse } from './use-cases/dismiss-check-in/dismiss-check-in.js';

export { GenerateWeeklySummaryUseCase } from './use-cases/generate-weekly-summary/generate-weekly-summary.js';
export type { GenerateWeeklySummaryRequest, GenerateWeeklySummaryResponse } from './use-cases/generate-weekly-summary/generate-weekly-summary.js';

export { GetCoachingHistoryUseCase } from './use-cases/get-coaching-history/get-coaching-history.js';
export type { GetCoachingHistoryRequest, GetCoachingHistoryResponse } from './use-cases/get-coaching-history/get-coaching-history.js';

// Repository
export type { CoachingConversationRepository } from './repositories/coaching-conversation-repository.js';

// Services
export type { AICoachService, AICoachResponse } from './services/ai-coach-service.js';
export type { CoachingContextBuilder } from './services/coaching-context-builder.js';