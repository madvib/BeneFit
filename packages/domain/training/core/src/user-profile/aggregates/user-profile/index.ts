// Export all parts of the UserProfile aggregate
export type { UserProfile } from './user-profile.types.js';

export { createUserProfile } from './user-profile.factory.js';

export * as UserProfileCommands from './user-profile.commands.js';
export * as UserProfileQueries from './user-profile.queries.js';
