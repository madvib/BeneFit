
import { SEED_USERS, SEED_PERSONAS } from '@bene/shared';

const BENE_API_URL = process.env.BENE_API_URL || 'http://localhost:8787/api';
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'dev-admin-key';

async function seedUser(user: typeof SEED_USERS[0]) {
  const persona = SEED_PERSONAS[user.id as keyof typeof SEED_PERSONAS];
  if (!persona) {
    console.log(`Skipping ${ user.email } (No persona defined)`);
    return;
  }

  console.log(`Seeding ${ user.email } as ${ persona.role }...`);

  try {
    const response = await fetch(`${ BENE_API_URL }/admin/seed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': ADMIN_API_KEY,
      },
      body: JSON.stringify({
        userId: user.id,
        userEmail: user.email, // Pass email for auth creation if needed
        persona,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to seed ${ user.id }: ${ await response.text() }`);
    }

    const result = await response.json();
    console.log(`✅ Seeded ${ user.email }:`, result);
  } catch (error) {
    console.error(`❌ Error seeding ${ user.email }:`, error);
  }
}

async function run() {
  console.log('🚀 Starting User Hydration...');

  // Seed sequentially to avoid rate limits or DB locks
  for (const user of SEED_USERS) {
    await seedUser(user);
  }

  console.log('✨ Hydration Complete!');
}

run().catch(console.error);
