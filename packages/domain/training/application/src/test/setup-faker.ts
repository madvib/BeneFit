import { setFaker, fake } from 'zod-schema-faker/v4';
import { faker } from '@faker-js/faker';

// Setup faker for v4 API (done once globally)
setFaker(faker);

/**
 * Re-export fake for use in fixture files
 */
export { fake };
