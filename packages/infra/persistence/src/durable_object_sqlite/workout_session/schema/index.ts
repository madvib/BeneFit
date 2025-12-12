import { sessionMetadata } from './session_metadata';
import { participants } from './participants';
import { activityProgress } from './activity_progress';
import { sessionChat } from './session_chat';

export * from './session_metadata';
export * from './participants';
export * from './activity_progress';
export * from './session_chat';

export const workout_session_schema = {
  ...sessionMetadata,
  ...participants,
  ...activityProgress,
  ...sessionChat,
};
