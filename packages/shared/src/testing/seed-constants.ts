/**
 * Centralized User IDs for seeding
 */
export const SEED_USER_IDS = {
  USER_001: '10000000-0000-4000-8000-000000000001',
  USER_002: '10000000-0000-4000-8000-000000000002',
  USER_003: '10000000-0000-4000-8000-000000000003',
  USER_004: '10000000-0000-4000-8000-000000000004',
  USER_005: '10000000-0000-4000-8000-000000000005',
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
  bio?: string;
  location?: string;
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
    avatarUrl: 'https://ui-avatars.com/api/?name=Test+User&background=0D8ABC&color=fff&size=128',
    emailVerified: true,
    bio: 'Fitness enthusiast and weekend warrior.',
    location: 'New York, USA',
  },
  {
    id: SEED_USER_IDS.USER_002,
    email: 'john@example.com',
    password: 'Password123!',
    name: 'John Doe',
    handle: '@john_doe',
    avatarUrl: 'https://ui-avatars.com/api/?name=John+Doe&background=6366F1&color=fff&size=128',
    emailVerified: true,
    bio: 'Dedicated runner training for my first marathon.',
    location: 'London, UK',
  },
  {
    id: SEED_USER_IDS.USER_003,
    email: 'jane@example.com',
    password: 'Password123!',
    name: 'Jane Smith',
    handle: '@jane_smith',
    avatarUrl: 'https://ui-avatars.com/api/?name=Jane+Smith&background=EC4899&color=fff&size=128',
    emailVerified: false,
    bio: 'Powerlifting is my passion.',
    location: 'Austin, TX',
  },
  {
    id: SEED_USER_IDS.USER_004,
    email: 'bob@example.com',
    password: 'Password123!',
    name: 'Bob Wilson',
    handle: '@bob_wilson',
    avatarUrl: 'https://ui-avatars.com/api/?name=Bob+Wilson&background=10B981&color=fff&size=128',
    emailVerified: true,
    bio: 'Finding balance through yoga and meditation.',
    location: 'San Francisco, CA',
  },
  {
    id: SEED_USER_IDS.USER_005,
    email: 'alice@example.com',
    password: 'Password123!',
    name: 'Alice Brown',
    handle: '@alice_brown',
    avatarUrl: 'https://ui-avatars.com/api/?name=Alice+Brown&background=F59E0B&color=fff&size=128',
    emailVerified: true,
    bio: 'Challenging myself every day with HIIT.',
    location: 'Toronto, Canada',
  },
];

/**
 * Enforceable Persona Definitions
 */
export const SEED_PERSONAS = {
  [SEED_USER_IDS.USER_001]: {
    role: 'Strength Athlete',
    plan: { type: 'strength_program', status: 'active', title: 'Strength Building Phase' },
    sync: 'strava',
  },
  [SEED_USER_IDS.USER_002]: {
    role: 'Marathon Runner',
    plan: { type: 'event_training', status: 'active', title: 'Marathon Training Plan' },
    sync: 'garmin',
  },
  [SEED_USER_IDS.USER_003]: {
    role: 'Powerlifter',
    plan: null, // Intentionally no plan
    sync: null,
  },
  [SEED_USER_IDS.USER_004]: {
    role: 'Yogi',
    plan: { type: 'general_fitness', status: 'paused', title: 'Yoga for Recovery' },
    sync: null,
  },
  [SEED_USER_IDS.USER_005]: {
    role: 'Challenger',
    plan: { type: 'general_fitness', status: 'completed', title: '30-Day Shred Challenge' },
    sync: null,
  },
} as const;
