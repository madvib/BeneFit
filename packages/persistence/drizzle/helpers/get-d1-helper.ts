import { D1Helper } from '@nerdfolio/drizzle-d1-helpers';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { getPlatformProxy } from 'wrangler';
import { getPersistPath } from './get-persist-path.ts';

export type BoundD1 = ReturnType<typeof drizzleD1>;

export const getD1Helper = (dbName: string, filename?: string) => {
  return D1Helper.get(dbName).withPersistTo(getPersistPath(filename));
};

export async function useLocalD1<CloudflareEnv>(
  bindingName: keyof CloudflareEnv,
  doWerk: (db: BoundD1) => Promise<void>,
  environment?: string,
) {
  const platform = await getPlatformProxy<CloudflareEnv>({
    environment,
    persist: { path: getPersistPath() },
  });

  const binding = platform.env[bindingName];
  if (!binding) {
    throw new Error(
      `Could not find D1 binding: [${bindingName.toString()}]. Check your wrangler config file.`,
    );
  }

  const db = drizzleD1(binding as unknown as D1Database);
  await doWerk(db);
  await platform.dispose();
}
