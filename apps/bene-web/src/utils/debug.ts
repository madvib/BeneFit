// Debug utility for development
export class DebugLogger {
  private enabled: boolean;
  private prefix: string;

  constructor(prefix: string = '') {
    this.enabled = process.env.NODE_ENV !== 'production' && process.env.DEBUG === '1';
    this.prefix = prefix ? `[${prefix}]` : '[DEBUG]';
  }

  log(...args: unknown[]) {
    if (this.enabled) {
      console.log(this.prefix, new Date().toISOString(), ...args);
    }
  }

  error(...args: unknown[]) {
    console.error(this.prefix, new Date().toISOString(), ...args);
  }

  warn(...args: unknown[]) {
    if (this.enabled) {
      console.warn(this.prefix, new Date().toISOString(), ...args);
    } else {
      console.warn(this.prefix, ...args);
    }
  }

  info(...args: unknown[]) {
    if (this.enabled) {
      console.info(this.prefix, new Date().toISOString(), ...args);
    }
  }

  trace(label: string = 'Trace') {
    if (this.enabled) {
      console.log(this.prefix, new Date().toISOString(), label);
      console.trace();
    }
  }
}

// Specific logger for auth
export const authLogger = new DebugLogger('AUTH');

// Generic logger
export const debugLogger = new DebugLogger();