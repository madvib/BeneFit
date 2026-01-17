import { setFaker, fake as _fake, custom, getFaker, Fake } from 'zod-schema-faker/v4';
import { faker } from '@faker-js/faker';
import { z } from 'zod';

// Setup faker for v4 API
setFaker(faker);

/**
 * Register custom generators for realistic bounded data
 * zod-schema-faker v4 doesn't honor .min()/.max() refinements automatically
 */

// Register customs for common patterns
// Note: These apply to ALL z.number() and z.string() - we'll override these globally
const numberFake: Fake<z.ZodNumber> = () => getFaker().number.int({ min: 0, max: 10000 });
const stringFake: Fake<z.ZodString> = () => getFaker().lorem.words({ min: 1, max: 10 });

custom(z.number(), numberFake);
custom(z.string(), stringFake);

/**
 * Export fake - use zod-schema-faker's fake directly since custom() handles the overrides
 */
export { _fake as fake };
