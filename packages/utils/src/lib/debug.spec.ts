import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DebugLogger, authLogger, debugLogger } from './debug';

describe('debug', () => {
  let consoleSpy: {
    log: any;
    error: any;
    warn: any;
    info: any;
  };

  beforeEach(() => {
    // Mock console methods to capture calls
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('DebugLogger', () => {
    describe('constructor', () => {
      it('should create logger with default prefix when no prefix provided', () => {
        const logger = new DebugLogger();
        expect(logger).toBeDefined();
      });

      it('should create logger with provided prefix', () => {
        const logger = new DebugLogger('TEST');
        expect(logger).toBeDefined();
      });
    });

    describe('log method', () => {
      it('should log when debug is enabled', () => {
        // Mock environment to enable debug
        vi.stubEnv('NODE_ENV', 'development');
        vi.stubEnv('DEBUG', '1');

        const logger = new DebugLogger('TEST');
        logger.log('test message');

        expect(consoleSpy.log).toHaveBeenCalled();
        expect(consoleSpy.log.mock.calls[0][0]).toBe('[TEST]');
        expect(consoleSpy.log.mock.calls[0][2]).toBe('test message');

        vi.unstubAllEnvs();
      });

      it('should not log when debug is disabled', () => {
        // Mock environment to disable debug
        vi.stubEnv('NODE_ENV', 'production');
        vi.stubEnv('DEBUG', '0');

        const logger = new DebugLogger('TEST');
        logger.log('test message');

        expect(consoleSpy.log).not.toHaveBeenCalled();

        vi.unstubAllEnvs();
      });
    });

    describe('error method', () => {
      it('should always log error regardless of debug setting', () => {
        // Mock environment to disable debug
        vi.stubEnv('NODE_ENV', 'production');
        vi.stubEnv('DEBUG', '0');

        const logger = new DebugLogger('TEST');
        logger.error('error message');

        expect(consoleSpy.error).toHaveBeenCalled();
        expect(consoleSpy.error.mock.calls[0][0]).toBe('[TEST]');
        expect(consoleSpy.error.mock.calls[0][2]).toBe('error message');

        vi.unstubAllEnvs();
      });
    });

    describe('warn method', () => {
      it('should log warn when debug is enabled', () => {
        // Mock environment to enable debug
        vi.stubEnv('NODE_ENV', 'development');
        vi.stubEnv('DEBUG', '1');

        const logger = new DebugLogger('TEST');
        logger.warn('warn message');

        expect(consoleSpy.warn).toHaveBeenCalled();
        expect(consoleSpy.warn.mock.calls[0][0]).toBe('[TEST]');
        expect(consoleSpy.warn.mock.calls[0][2]).toBe('warn message');

        vi.unstubAllEnvs();
      });

      it('should still log warn when debug is disabled (without timestamp)', () => {
        // Mock environment to disable debug
        vi.stubEnv('NODE_ENV', 'production');
        vi.stubEnv('DEBUG', '0');

        const logger = new DebugLogger('TEST');
        logger.warn('warn message');

        expect(consoleSpy.warn).toHaveBeenCalled();
        // When debug is disabled, it should log without timestamp (two arguments)
        expect(consoleSpy.warn.mock.calls[0][0]).toBe('[TEST]');
        expect(consoleSpy.warn.mock.calls[0][1]).toBe('warn message');

        vi.unstubAllEnvs();
      });
    });

    describe('info method', () => {
      it('should log info when debug is enabled', () => {
        // Mock environment to enable debug
        vi.stubEnv('NODE_ENV', 'development');
        vi.stubEnv('DEBUG', '1');

        const logger = new DebugLogger('TEST');
        logger.info('info message');

        expect(consoleSpy.info).toHaveBeenCalled();

        vi.unstubAllEnvs();
      });

      it('should not log info when debug is disabled', () => {
        // Mock environment to disable debug
        vi.stubEnv('NODE_ENV', 'production');
        vi.stubEnv('DEBUG', '0');

        const logger = new DebugLogger('TEST');
        logger.info('info message');

        expect(consoleSpy.info).not.toHaveBeenCalled();

        vi.unstubAllEnvs();
      });
    });

    describe('trace method', () => {
      it('should trace when debug is enabled', () => {
        // Mock environment to enable debug
        vi.stubEnv('NODE_ENV', 'development');
        vi.stubEnv('DEBUG', '1');

        // Mock console.trace to avoid actual stack trace
        const traceSpy = vi.spyOn(console, 'trace').mockImplementation(() => {});

        const logger = new DebugLogger('TEST');
        logger.trace('test trace');

        expect(consoleSpy.log).toHaveBeenCalled();
        expect(traceSpy).toHaveBeenCalled();

        vi.unstubAllEnvs();
        traceSpy.mockRestore();
      });

      it('should not trace when debug is disabled', () => {
        // Mock environment to disable debug
        vi.stubEnv('NODE_ENV', 'production');
        vi.stubEnv('DEBUG', '0');

        // Mock console.trace to avoid actual stack trace
        const traceSpy = vi.spyOn(console, 'trace').mockImplementation(() => {});

        const logger = new DebugLogger('TEST');
        logger.trace('test trace');

        expect(consoleSpy.log).not.toHaveBeenCalled();
        expect(traceSpy).not.toHaveBeenCalled();

        vi.unstubAllEnvs();
        traceSpy.mockRestore();
      });
    });
  });

  describe('authLogger', () => {
    it('should be an instance of DebugLogger with AUTH prefix', () => {
      expect(authLogger).toBeInstanceOf(DebugLogger);
    });
  });

  describe('debugLogger', () => {
    it('should be an instance of DebugLogger with default prefix', () => {
      expect(debugLogger).toBeInstanceOf(DebugLogger);
    });
  });
});