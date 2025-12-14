// Debug utility for development
export class DebugLogger {
  private enabled: boolean;
  private prefix: string;

  constructor(prefix: string = '') {
    this.enabled = process.env.NODE_ENV !== 'production' && process.env.DEBUG === '1';
    this.prefix = prefix ? `[${prefix}]` : '[DEBUG]';
  }

  log(...arguments_: unknown[]) {
    if (this.enabled) {
      console.log(this.prefix, new Date().toISOString(), ...arguments_);
    }
  }

  error(...arguments_: unknown[]) {
    console.error(this.prefix, new Date().toISOString(), ...arguments_);
  }

  warn(...arguments_: unknown[]) {
    if (this.enabled) {
      console.warn(this.prefix, new Date().toISOString(), ...arguments_);
    } else {
      console.warn(this.prefix, ...arguments_);
    }
  }

  info(...arguments_: unknown[]) {
    if (this.enabled) {
      console.info(this.prefix, new Date().toISOString(), ...arguments_);
    }
  }

  trace(label: string = 'Trace') {
    if (this.enabled) {
      console.log(this.prefix, new Date().toISOString(), label);
      console.trace();
    }
  }
}

// Generic logger
export const debugLogger = new DebugLogger();
