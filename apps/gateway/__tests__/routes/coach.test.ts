import { describe, it, expect } from 'vitest';
import {
  sendMessageRequest,
  dismissCheckInRequest,
  respondToCheckInRequest,
} from '../../__fixtures__/routes/coach.fixtures';
import {
  SendMessageToCoachClientSchema,
  DismissCheckInClientSchema,
  RespondToCheckInClientSchema,
} from '../../src/routes/coach.js';

describe('Coach Route Fixtures', () => {
  describe('Schema Validation', () => {
    it('sendMessageRequest should match client schema (userId omitted)', () => {
      expect(() => SendMessageToCoachClientSchema.parse(sendMessageRequest)).not.toThrow();
    });

    it('dismissCheckInRequest should match client schema', () => {
      expect(() => DismissCheckInClientSchema.parse(dismissCheckInRequest)).not.toThrow();
    });

    it('respondToCheckInRequest should match client schema', () => {
      expect(() => RespondToCheckInClientSchema.parse(respondToCheckInRequest)).not.toThrow();
    });
  });

  describe('Data Quality', () => {
    it('sendMessageRequest should have non-empty message', () => {
      expect(sendMessageRequest.message).toBeTruthy();
      expect(sendMessageRequest.message.length).toBeGreaterThan(0);
    });

    it('respondToCheckInRequest should have non-empty response', () => {
      expect(respondToCheckInRequest.response).toBeTruthy();
      expect(respondToCheckInRequest.response.length).toBeGreaterThan(0);
    });
  });
});
