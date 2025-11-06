import { describe, it, expect } from 'vitest';
import { ServiceConnection } from './ServiceConnection';

describe('ServiceConnection', () => {
  describe('create', () => {
    it('should create a valid ServiceConnection with required properties', () => {
      const props = {
        id: 'conn-123',
        name: 'Google Fit',
        description: 'Sync fitness data from Google',
        connected: false,
        logo: 'google-fit-logo.png',
        dataType: ['steps', 'heart_rate'],
      };

      const result = ServiceConnection.create(props);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.id).toBe('conn-123');
        expect(result.value.name).toBe('Google Fit');
        expect(result.value.description).toBe('Sync fitness data from Google');
        expect(result.value.connected).toBe(false);
        expect(result.value.logo).toBe('google-fit-logo.png');
        expect(result.value.dataType).toEqual(['steps', 'heart_rate']);
        expect(result.value.createdAt).toBeInstanceOf(Date);
      }
    });

    it('should fail when id is empty', () => {
      const props = {
        id: '',
        name: 'Google Fit',
        description: 'Sync fitness data from Google',
        connected: false,
        logo: 'google-fit-logo.png',
        dataType: ['steps', 'heart_rate'],
      };

      const result = ServiceConnection.create(props);

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error.message).toBe('ID is required and must be a non-empty string');
      }
    });

    it('should fail when name is missing', () => {
      const props = {
        id: 'conn-123',
        // name is missing
        description: 'Sync fitness data from Google',
        connected: false,
        logo: 'google-fit-logo.png',
        dataType: ['steps', 'heart_rate'],
      };

      const result = ServiceConnection.create(props);

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error.message).toBe('Name is required and must be a string');
      }
    });

    it('should fail when description is missing', () => {
      const props = {
        id: 'conn-123',
        name: 'Google Fit',
        // description is missing
        connected: false,
        logo: 'google-fit-logo.png',
        dataType: ['steps', 'heart_rate'],
      };

      const result = ServiceConnection.create(props);

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error.message).toBe('Description is required and must be a string');
      }
    });

    it('should fail when logo is missing', () => {
      const props = {
        id: 'conn-123',
        name: 'Google Fit',
        description: 'Sync fitness data from Google',
        connected: false,
        // logo is missing
        dataType: ['steps', 'heart_rate'],
      };

      const result = ServiceConnection.create(props);

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error.message).toBe('Logo is required and must be a string');
      }
    });

    it('should fail when dataType is not an array', () => {
      const props = {
        id: 'conn-123',
        name: 'Google Fit',
        description: 'Sync fitness data from Google',
        connected: false,
        logo: 'google-fit-logo.png',
        // @ts-expect-error Testing invalid input
        dataType: 'not-an-array',
      };

      const result = ServiceConnection.create(props);

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error.message).toBe('Data type must be an array of strings');
      }
    });
  });

  describe('getters', () => {
    it('should return correct values for all getters', () => {
      const props = {
        id: 'conn-123',
        name: 'Google Fit',
        description: 'Sync fitness data from Google',
        connected: true,
        logo: 'google-fit-logo.png',
        dataType: ['steps', 'heart_rate'],
      };

      const connection = ServiceConnection.create(props).value;

      expect(connection.name).toBe('Google Fit');
      expect(connection.description).toBe('Sync fitness data from Google');
      expect(connection.connected).toBe(true);
      expect(connection.logo).toBe('google-fit-logo.png');
      expect(connection.dataType).toEqual(['steps', 'heart_rate']);
      expect(connection.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('connect', () => {
    it('should set connected to true', () => {
      const props = {
        id: 'conn-123',
        name: 'Google Fit',
        description: 'Sync fitness data from Google',
        connected: false,
        logo: 'google-fit-logo.png',
        dataType: ['steps', 'heart_rate'],
      };

      const connection = ServiceConnection.create(props).value;
      connection.connect();

      expect(connection.connected).toBe(true);
    });

    it('should update updatedAt when connecting', () => {
      const props = {
        id: 'conn-123',
        name: 'Google Fit',
        description: 'Sync fitness data from Google',
        connected: false,
        logo: 'google-fit-logo.png',
        dataType: ['steps', 'heart_rate'],
      };

      const connection = ServiceConnection.create(props).value;
      const oldUpdatedAt = connection['props'].updatedAt;

      connection.connect();

      expect(connection['props'].updatedAt).toBeDefined();
      expect(connection['props'].updatedAt).not.toBe(oldUpdatedAt);
    });
  });

  describe('disconnect', () => {
    it('should set connected to false', () => {
      const props = {
        id: 'conn-123',
        name: 'Google Fit',
        description: 'Sync fitness data from Google',
        connected: true,
        logo: 'google-fit-logo.png',
        dataType: ['steps', 'heart_rate'],
      };

      const connection = ServiceConnection.create(props).value;
      connection.disconnect();

      expect(connection.connected).toBe(false);
    });

    it('should update updatedAt when disconnecting', () => {
      const props = {
        id: 'conn-123',
        name: 'Google Fit',
        description: 'Sync fitness data from Google',
        connected: true,
        logo: 'google-fit-logo.png',
        dataType: ['steps', 'heart_rate'],
      };

      const connection = ServiceConnection.create(props).value;
      const oldUpdatedAt = connection['props'].updatedAt;

      connection.disconnect();

      expect(connection['props'].updatedAt).toBeDefined();
      expect(connection['props'].updatedAt).not.toBe(oldUpdatedAt);
    });
  });

  describe('updateLastSync', () => {
    it('should update the lastSync property', () => {
      const props = {
        id: 'conn-123',
        name: 'Google Fit',
        description: 'Sync fitness data from Google',
        connected: true,
        logo: 'google-fit-logo.png',
        dataType: ['steps', 'heart_rate'],
      };

      const connection = ServiceConnection.create(props).value;
      const oldLastSync = connection.lastSync;
      const beforeUpdate = new Date();

      connection.updateLastSync();

      const newLastSync = connection.lastSync;
      expect(newLastSync).toBeDefined();
      expect(newLastSync).not.toBe(oldLastSync);
      expect(newLastSync).toBeInstanceOf(Date);
      if (newLastSync instanceof Date) {
        expect(newLastSync.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
      }
    });

    it('should update updatedAt when updating last sync', () => {
      const props = {
        id: 'conn-123',
        name: 'Google Fit',
        description: 'Sync fitness data from Google',
        connected: true,
        logo: 'google-fit-logo.png',
        dataType: ['steps', 'heart_rate'],
      };

      const connection = ServiceConnection.create(props).value;
      const oldUpdatedAt = connection['props'].updatedAt;

      connection.updateLastSync();

      expect(connection['props'].updatedAt).toBeDefined();
      expect(connection['props'].updatedAt).not.toBe(oldUpdatedAt);
    });
  });
});