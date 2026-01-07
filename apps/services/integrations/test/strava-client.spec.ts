import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StravaClient } from '../src/strava-client.js';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('StravaClient', () => {
  let client: StravaClient;
  const accessToken = 'test-access-token';

  beforeEach(() => {
    vi.clearAllMocks();
    client = new StravaClient();
  });

  describe('getAthlete', () => {
    it('should fetch authenticated athlete profile', async () => {
      const mockAthlete = {
        id: 12345,
        username: 'test_athlete',
        firstname: 'Test',
        lastname: 'Athlete',
        profile: 'https://example.com/profile.jpg',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAthlete,
      });

      const result = await client.getAthlete(accessToken);

      expect(result.isSuccess).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://www.strava.com/api/v3/athlete',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${ accessToken }`,
          }),
        })
      );

      if (result.isSuccess) {
        expect(result.value.id).toBe(12345);
        expect(result.value.username).toBe('test_athlete');
      }
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      const result = await client.getAthlete(accessToken);

      expect(result.isFailure).toBe(true);
    });
  });

  describe('getActivities', () => {
    it('should fetch activities with all parameters', async () => {
      const mockActivities = [
        {
          id: 1,
          name: 'Morning Run',
          type: 'Run',
          start_date: '2024-01-02T10:00:00Z',
          distance: 5000,
          moving_time: 1800,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockActivities,
      });

      const options = {
        accessToken,
        after: new Date('2024-01-01T00:00:00Z'),
        before: new Date('2024-01-31T23:59:59Z'),
        page: 1,
        perPage: 30,
      };

      const result = await client.getActivities(options);

      expect(result.isSuccess).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/athlete/activities?'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${ accessToken }`,
          }),
        })
      );

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('after=');
      expect(calledUrl).toContain('before=');
      expect(calledUrl).toContain('page=1');
      expect(calledUrl).toContain('per_page=30');

      if (result.isSuccess) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0].name).toBe('Morning Run');
      }
    });

    it('should handle Unix timestamps for after/before', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const afterTimestamp = 1704067200; // 2024-01-01 00:00:00 UTC
      const result = await client.getActivities({
        accessToken,
        after: afterTimestamp,
      });

      expect(result.isSuccess).toBe(true);
      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain(`after=${ afterTimestamp }`);
    });
  });

  describe('getActivity', () => {
    it('should fetch a specific activity by ID', async () => {
      const mockActivity = {
        id: 123456,
        name: 'Afternoon Ride',
        type: 'Ride',
        start_date: '2024-01-15T14:00:00Z',
        distance: 25000,
        moving_time: 3600,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockActivity,
      });

      const result = await client.getActivity({
        accessToken,
        activityId: 123456,
      });

      expect(result.isSuccess).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://www.strava.com/api/v3/activities/123456',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${ accessToken }`,
          }),
        })
      );

      if (result.isSuccess) {
        expect(result.value.id).toBe(123456);
        expect(result.value.name).toBe('Afternoon Ride');
      }
    });

    it('should include all efforts when requested', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 123 }),
      });

      await client.getActivity({
        accessToken,
        activityId: 123,
        includeAllEfforts: true,
      });

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('include_all_efforts=true');
    });
  });

  describe('getActivitiesSince', () => {
    it('should fetch activities since a specific date', async () => {
      const mockActivities = [
        { id: 1, name: 'Run 1', type: 'Run', start_date: '2024-01-02T10:00:00Z' },
        { id: 2, name: 'Run 2', type: 'Run', start_date: '2024-01-03T10:00:00Z' },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockActivities,
      });

      const sinceDate = new Date('2024-01-01T00:00:00Z');
      const result = await client.getActivitiesSince(accessToken, sinceDate);

      expect(result.isSuccess).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/athlete/activities?after='),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${ accessToken }`,
          }),
        })
      );

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('per_page=30'); // Default perPage

      if (result.isSuccess) {
        expect(result.value).toHaveLength(2);
        expect(result.value[0].name).toBe('Run 1');
      }
    });

    it('should use custom perPage parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const sinceDate = new Date('2024-01-01T00:00:00Z');
      await client.getActivitiesSince(accessToken, sinceDate, 50);

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('per_page=50');
    });
  });
});
