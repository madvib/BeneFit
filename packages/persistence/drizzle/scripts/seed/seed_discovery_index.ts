import { drizzle } from 'drizzle-orm/d1';
import { SEED_USER_IDS, SEED_USERS } from '@bene/shared';
import { useLocalD1 } from '../../../../../tools/drizzle/get-d1-helper.ts';
import {
  usersPublic,
  NewUserPublic,
} from '../../../src/d1/discovery_index/schema/users_public.js';
import {
  teamsPublic,
  NewTeamPublic,
} from '../../../src/d1/discovery_index/schema/teams_public.js';
import {
  teamRosters,
  NewTeamRoster,
} from '../../../src/d1/discovery_index/schema/team_rosters.js';
import {
  activeWorkoutSessions,
  NewActiveWorkoutSession,
} from '../../../src/d1/discovery_index/schema/active_workout_sessions.js';

const now = Math.floor(Date.now() / 1000);

// Map SEED_USERS to Discovery Index users
const users: NewUserPublic[] = SEED_USERS.map((u) => ({
  id: u.id,
  handle: u.handle,
  name: u.name,
  avatarUrl: u.avatarUrl,
  lastActive: new Date().toISOString(),
}));

const teams: NewTeamPublic[] = [
  {
    id: 'team_001',
    name: 'Morning Runners',
    description: 'Early birds getting the worms and the miles.',
    createdByUserId: SEED_USER_IDS.USER_002,
    isPublic: true,
    inviteCode: 'RUN123',
    memberCount: 5,
    createdAt: new Date(now * 1000),
    updatedAt: new Date(now * 1000),
  },
  {
    id: 'team_002',
    name: 'Powerlifters Unite',
    description: 'Heavy weights only.',
    createdByUserId: SEED_USER_IDS.USER_001,
    isPublic: true,
    inviteCode: 'LIFT99',
    memberCount: 12,
    createdAt: new Date((now + 1000) * 1000),
    updatedAt: new Date((now + 1000) * 1000),
  },
];

const rosters: NewTeamRoster[] = [
  { teamId: 'team_001', userId: SEED_USER_IDS.USER_002, role: 'admin' },
  { teamId: 'team_001', userId: SEED_USER_IDS.USER_001, role: 'member' },
  // USER_003 is excluded to maintain "Empty State" persona
  { teamId: 'team_002', userId: SEED_USER_IDS.USER_001, role: 'admin' },
  { teamId: 'team_002', userId: SEED_USER_IDS.USER_002, role: 'member' },
];

const sessions: NewActiveWorkoutSession[] = [
  {
    id: 'session_001',
    createdByUserId: SEED_USER_IDS.USER_001,
    workoutId: 'workout_001',
    sessionStartedAt: new Date((now - 3600) * 1000), // 1 hour ago
    participantCount: 3,
    status: 'active',
    doSessionId: 'do_session_001',
    createdAt: new Date(now * 1000),
    updatedAt: new Date(now * 1000),
  },
  {
    id: 'session_002',
    createdByUserId: SEED_USER_IDS.USER_002,
    workoutId: 'workout_002',
    sessionStartedAt: new Date((now - 1800) * 1000), // 30 minutes ago
    participantCount: 2,
    status: 'active',
    doSessionId: 'do_session_002',
    createdAt: new Date(now * 1000),
    updatedAt: new Date(now * 1000),
  },
];

/**
 * Seeds the Discovery Index database using Drizzle ORM and D1Helper.
 */
export async function seedDiscoveryIndex() {
  console.log('🌱 Seeding Discovery Index database with Drizzle ORM...');

  try {
    // Execute the seeding logic using the D1 binding
    await useLocalD1('DB_DISCOVERY_INDEX', async (binding) => {
      const db = drizzle(binding);

      console.log('  - Clearing existing data...');
      // Use Drizzle ORM for clear operations
      await db.delete(activeWorkoutSessions);
      await db.delete(teamRosters);
      await db.delete(teamsPublic);
      await db.delete(usersPublic);

      // --- 2. Insert Data ---

      console.log(`  - Inserting ${ users.length } users...`);
      // Use Drizzle ORM for batch insertion
      await db.insert(usersPublic).values(users);

      console.log(`  - Inserting ${ teams.length } teams...`);
      // Use Drizzle ORM for batch insertion
      await db.insert(teamsPublic).values(teams);

      console.log(`  - Inserting ${ rosters.length } team rosters...`);
      // Use Drizzle ORM for batch insertion
      await db.insert(teamRosters).values(rosters);

      console.log(`  - Inserting ${ sessions.length } active workout sessions...`);
      // Use Drizzle ORM for batch insertion
      await db.insert(activeWorkoutSessions).values(sessions);
    });

    console.log('✅ Discovery Index database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding Discovery Index database:', error);
    throw error;
  }
}

// This block makes the script runnable directly
if (import.meta.url === `file://${ process.argv[1] }`) {
  seedDiscoveryIndex().catch((error) => {
    console.error('Failed to seed database:', error);
    process.exit(1);
  });
}
