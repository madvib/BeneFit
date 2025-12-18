// Coach module exports

// Use cases
export { SendMessageToCoachUseCase } from './use-cases/send-message-to-coach/send-message-to-coach.js';
export type {
  SendMessageToCoachRequest,
  SendMessageToCoachResponse,
  SendMessageToCoachRequestClient,
} from './use-cases/send-message-to-coach/send-message-to-coach.js';
export {
  SendMessageToCoachRequestSchema,
  SendMessageToCoachRequestClientSchema,
  SendMessageToCoachResponseSchema,
} from './use-cases/send-message-to-coach/send-message-to-coach.js';

export { TriggerProactiveCheckInUseCase } from './use-cases/trigger-proactive-check-in/trigger-proactive-check-in.js';
export type {
  TriggerProactiveCheckInRequest,
  TriggerProactiveCheckInResponse,
} from './use-cases/trigger-proactive-check-in/trigger-proactive-check-in.js';
export {
  TriggerProactiveCheckInRequestSchema,
  TriggerProactiveCheckInResponseSchema,
} from './use-cases/trigger-proactive-check-in/trigger-proactive-check-in.js';

export { RespondToCheckInUseCase } from './use-cases/respond-to-check-in/respond-to-check-in.js';
export type {
  RespondToCheckInRequest,
  RespondToCheckInResponse,
  RespondToCheckInRequestClient,
} from './use-cases/respond-to-check-in/respond-to-check-in.js';
export {
  RespondToCheckInRequestSchema,
  RespondToCheckInRequestClientSchema,
  RespondToCheckInResponseSchema,
} from './use-cases/respond-to-check-in/respond-to-check-in.js';

export { DismissCheckInUseCase } from './use-cases/dismiss-check-in/dismiss-check-in.js';
export type {
  DismissCheckInRequest,
  DismissCheckInResponse,
  DismissCheckInRequestClient,
} from './use-cases/dismiss-check-in/dismiss-check-in.js';
export {
  DismissCheckInRequestSchema,
  DismissCheckInRequestClientSchema,
  DismissCheckInResponseSchema,
} from './use-cases/dismiss-check-in/dismiss-check-in.js';

export { GenerateWeeklySummaryUseCase } from './use-cases/generate-weekly-summary/generate-weekly-summary.js';
export type {
  GenerateWeeklySummaryRequest,
  GenerateWeeklySummaryResponse,
} from './use-cases/generate-weekly-summary/generate-weekly-summary.js';
export {
  GenerateWeeklySummaryRequestSchema,
  GenerateWeeklySummaryResponseSchema,
} from './use-cases/generate-weekly-summary/generate-weekly-summary.js';

export { GetCoachHistoryUseCase } from './use-cases/get-coaching-history/get-coaching-history.js';
export type {
  GetCoachHistoryRequest,
  GetCoachHistoryResponse,
} from './use-cases/get-coaching-history/get-coaching-history.js';
export {
  GetCoachHistoryRequestSchema,
  GetCoachHistoryResponseSchema,
} from './use-cases/get-coaching-history/get-coaching-history.js';

// Ports
export type { CoachConversationRepository } from './ports/coach-conversation-repository.js';

// Services
export * from './services/index.js';
