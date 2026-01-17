import { describe, it, expect } from 'vitest';
import {
  connectServiceRequest,
  disconnectServiceRequest,
} from '../../__fixtures__/routes/integrations.fixtures';
import {
  ConnectServiceClientSchema,
  DisconnectServiceClientSchema,
} from '../../src/routes/integrations.js';

describe('Integration Route Fixtures', () => {
  describe('Schema Validation', () => {
    it('connectServiceRequest should match client schema', () => {
      expect(() => ConnectServiceClientSchema.parse(connectServiceRequest)).not.toThrow();
    });

    it('disconnectServiceRequest should match client schema', () => {
      expect(() => DisconnectServiceClientSchema.parse(disconnectServiceRequest)).not.toThrow();
    });
  });

  describe('Data Quality', () => {
    it('connectServiceRequest should have non-empty serviceType', () => {
      expect(connectServiceRequest.serviceType).toBeTruthy();
      expect(connectServiceRequest.serviceType.length).toBeGreaterThan(0);
    });

    it('disconnectServiceRequest should have non-empty serviceId', () => {
      expect(disconnectServiceRequest.serviceId).toBeTruthy();
      expect(disconnectServiceRequest.serviceId.length).toBeGreaterThan(0);
    });
  });
});
