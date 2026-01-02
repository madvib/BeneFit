// Import co-located seed functions
import { seedActivityStream } from './seed_activity_stream.js';
import { seedDiscoveryIndex } from './seed_discovery_index.js';
import { seedStaticContent } from './seed_static_content.js';
import dotenv from 'dotenv';

async function run() {
  // TODO this needs to come from a centralized place
  dotenv.config({ path: '.env.local' });

  console.log('🌱 Starting D1 Seed using Wrangler CLI...');

  try {
    // Seed each D1 database using its specific helper
    console.log('\n📦 Seeding Activity Stream database...');
    await seedActivityStream();

    console.log('\n📦 Seeding Discovery Index database...');
    await seedDiscoveryIndex();

    console.log('\n📦 Seeding Static Content database...');
    await seedStaticContent();

    console.log('\n✅ Seeding complete!');
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
