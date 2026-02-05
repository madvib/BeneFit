import { D1Helper } from '@nerdfolio/drizzle-d1-helpers';
import { getPlatformProxy } from 'wrangler';
import { getPersistPath } from './get-persist-path';

export const getD1Helper = (dbName: string, filename?: string) => {
  return D1Helper.get(dbName).withPersistTo(getPersistPath(filename));
};

export async function useLocalD1<CloudflareEnv>(
  bindingName: keyof CloudflareEnv,
  doWerk: (db: D1Database) => Promise<void>,
  configPath?: string,
  environment?: string,
) {
  const platform = await getPlatformProxy<CloudflareEnv>({
    environment,
    persist: { path: getPersistPath() },
    configPath,
  });

  const binding = platform.env[bindingName];
  if (!binding) {
    throw new Error(
      `Could not find D1 binding: [${bindingName.toString()}]. Check your wrangler config file.`,
    );
  }

  await doWerk(binding as unknown as D1Database);
  await platform.dispose();
}
