import { initializeApiClients } from '@bene/react-api-client';

// Initialize API clients with the app's environment configuration
// This runs at module load time, before any components render
initializeApiClients({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
});
