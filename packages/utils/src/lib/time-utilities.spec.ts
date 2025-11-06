import { describe, it, expect } from 'vitest';
import { formatTimeAgo, formatDate, formatTime } from './time-utilities';

describe('time-utilities', () => {
  describe('formatTimeAgo', () => {
    it('should return "Just now" for very recent dates', () => {
      const now = new Date();
      const result = formatTimeAgo(now.toISOString());
      expect(result).toBe('Just now');
    });

    it('should return hours ago for dates within 24 hours', () => {
      const date = new Date();
      date.setHours(date.getHours() - 2);
      const result = formatTimeAgo(date.toISOString());
      expect(result).toBe('2 hours ago');
    });

    it('should return singular "hour" for 1 hour ago', () => {
      const date = new Date();
      date.setHours(date.getHours() - 1);
      const result = formatTimeAgo(date.toISOString());
      expect(result).toBe('1 hour ago');
    });

    it('should return days ago for dates more than 24 hours', () => {
      const date = new Date();
      date.setDate(date.getDate() - 3);
      const result = formatTimeAgo(date.toISOString());
      expect(result).toBe('3 days ago');
    });

    it('should return singular "day" for 1 day ago', () => {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      const result = formatTimeAgo(date.toISOString());
      expect(result).toBe('1 day ago');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-05-15');
      const result = formatDate(date.toISOString());
      // Using toMatch to handle different locale formats
      expect(result).toMatch(/2023/);
      expect(result).toMatch(/5/); // Month (May)
      expect(result).toMatch(/15/); // Day
    });

    it('should handle different dates consistently', () => {
      const date = new Date('2022-12-25');
      const result = formatDate(date.toISOString());
      expect(result).toMatch(/2022/);
      expect(result).toMatch(/12/); // Month (December)
      expect(result).toMatch(/25/); // Day
    });
  });

  describe('formatTime', () => {
    it('should format time with hours and minutes', () => {
      const date = new Date('2023-01-01T14:30:00');
      const result = formatTime(date.toISOString());
      // Format depends on locale, but should contain 2 and 30 (or 14 and 30)
      expect(result).toMatch(/\d{1,2}:\d{2}/);
      expect(result).toMatch(/30/); // Minutes
    });

    it('should handle different times correctly', () => {
      const date = new Date('2023-01-01T09:15:00');
      const result = formatTime(date.toISOString());
      expect(result).toMatch(/\d{1,2}:\d{2}/);
      expect(result).toMatch(/15/); // Minutes
    });
  });
});