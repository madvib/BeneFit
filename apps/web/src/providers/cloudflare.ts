import { getCloudflareContext } from '@opennextjs/cloudflare';

let env: CloudflareEnv;

export async function cloudflareEnv(): Promise<CloudflareEnv> {
  if (!env) {
    const getContext = await getCloudflareContext({ async: true });
    env ??= getContext.env;
  }
  return env;
}
