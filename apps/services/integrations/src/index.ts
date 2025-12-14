/**
 * Integration clients for third-party fitness services
 *
 * This file re-exports the individual client implementations for backward compatibility.
 * Each client extends OAuth2Client and uses HttpClient for common functionality.
 */

// Re-export Strava client
export * from './strava-client.js';

// Re-export Garmin client
export * from './garmin-client.js';
