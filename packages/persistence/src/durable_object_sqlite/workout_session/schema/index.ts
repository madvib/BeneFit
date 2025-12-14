import { sessionMetadata } from './session_metadata.ts';
import { participants } from './participants.ts';
import { activityProgress } from './activity_progress.ts';
import { sessionChat } from './session_chat.ts';

export * from './session_metadata.ts';
export * from './participants.ts';
export * from './activity_progress.ts';
export * from './session_chat.ts';

export const workout_session_schema = {
  sessionMetadata,
  participants,
  activityProgress,
  sessionChat,
}
