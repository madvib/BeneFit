/**
 * Centralized User IDs for seeding
 */
export const SEED_USER_IDS = {
  USER_001: 'user_seed_001',
  USER_002: 'user_seed_002',
  USER_003: 'user_seed_003',
} as const;

/**
 * Seed User data structure
 */
export interface SeedUser {
  id: string;
  email: string;
  password: string;
  name: string;
  handle: string;
  avatarUrl: string;
  emailVerified: boolean;
}

/**
 * Centralized Seed Users list
 */
export const SEED_USERS: SeedUser[] = [
  {
    id: SEED_USER_IDS.USER_001,
    email: 'test@example.com',
    password: 'Password123!',
    name: 'Test User',
    handle: '@test_user',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test',
    emailVerified: true,
  },
  {
    id: SEED_USER_IDS.USER_002,
    email: 'john@example.com',
    password: 'Password123!',
    name: 'John Doe',
    handle: '@john_doe',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    emailVerified: true,
  },
  {
    id: SEED_USER_IDS.USER_003,
    email: 'jane@example.com',
    password: 'Password123!',
    name: 'Jane Smith',
    handle: '@jane_smith',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    emailVerified: false,
  },
];
