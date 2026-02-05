import { sessionMetadata } from './session_metadata.js';
import { participants } from './participants.js';
import { activityProgress } from './activity_progress.js';
import { sessionChat } from './session_chat.js';

export * from './session_metadata.js';
export * from './participants.js';
export * from './activity_progress.js';
export * from './session_chat.js';

export const workout_session_schema = {
  sessionMetadata,
  participants,
  activityProgress,
  sessionChat,
};
