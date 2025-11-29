import {
  CoachingError,
  CommunicationError,
  AnalysisError,
  ValidationError,
  ContextUpdateError,
  MessageProcessingError,
  CheckInError,
} from './common-errors.js';

// Export all errors under a namespace
export {
  CoachingError,
  CommunicationError,
  AnalysisError,
  ValidationError,
  ContextUpdateError,
  MessageProcessingError,
  CheckInError,
};

// Create specific error factories if needed
export const createCoachingError = (message: string) => new CoachingError(message);
export const createCommunicationError = (message: string) =>
  new CommunicationError(message);
export const createAnalysisError = (message: string) => new AnalysisError(message);
export const createValidationError = (message: string) => new ValidationError(message);
export const createContextUpdateError = (message: string) =>
  new ContextUpdateError(message);
export const createMessageProcessingError = (message: string) =>
  new MessageProcessingError(message);
export const createCheckInError = (message: string) => new CheckInError(message);
