// Export all parts of the CoachMsg value object
export type { CoachMsg } from './coach-msg.types.js';
export * from './coach-msg.presentation.js';
export { createCoachMsgFixture } from './test/coach-msg.fixtures.js';
export {
  createUserMessage,
  createCoachMessage,
  createSystemMessage,
} from './coach-msg.factory.js';
