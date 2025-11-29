// Common errors for Integrations module
export class IntegrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IntegrationError';
  }
}

export class ConnectionError extends IntegrationError {
  constructor(message: string) {
    super(message);
    this.name = 'ConnectionError';
  }
}

export class SyncError extends IntegrationError {
  constructor(message: string) {
    super(message);
    this.name = 'SyncError';
  }
}

export class OAuthError extends IntegrationError {
  constructor(message: string) {
    super(message);
    this.name = 'OAuthError';
  }
}

export class ValidationError extends IntegrationError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ServiceNotSupportedError extends IntegrationError {
  constructor(service: string) {
    super(`Service "${service}" is not supported`);
    this.name = 'ServiceNotSupportedError';
  }
}

export class RateLimitError extends IntegrationError {
  constructor(service: string, retryAfter?: number) {
    const message = retryAfter 
      ? `Rate limit exceeded for ${service}, retry after ${retryAfter} seconds`
      : `Rate limit exceeded for ${service}`;
    super(message);
    this.name = 'RateLimitError';
  }
}