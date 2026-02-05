import { readJsonFile } from '@nx/devkit';
import { readFileSync } from 'fs';
import { parse as parseToml } from 'toml';

export interface WranglerConfig {
  name: string;
  main?: string;
  services?: Array<{
    binding: string;
    service: string;
  }>;
  durable_objects?: {
    bindings?: Array<{
      name: string;
      class_name: string;
      script_name: string;
    }>;
  };
  queues?: {
    producers?: Array<{
      binding: string;
      queue: string;
    }>;
    consumers?: Array<{
      queue: string;
    }>;
  };
  d1_databases?: Array<{
    binding: string;
    database_name: string;
    database_id: string;
  }>;
  r2_buckets?: Array<{
    binding: string;
    bucket_name: string;
  }>;
}
// Helper to read wrangler config
export function readWranglerConfig(configPath: string): Partial<WranglerConfig> {
  let config: Partial<WranglerConfig> = {};
  try {
    if (configPath.endsWith('.jsonc')) {
      config = readJsonFile(configPath) as WranglerConfig;
    } else if (configPath.endsWith('.toml')) {
      const content = readFileSync(configPath, 'utf-8');
      config = parseToml(content) as WranglerConfig;
    }
  } catch {
    return {};
  }
  return config;
}

export type WorkerManifest = Record<string, string>;

export function getAllWorkers(paths: string[]): WorkerManifest {
  // Use a Record (standard JS object)
  const workers: WorkerManifest = {};

  for (const filePath of paths) {
    const config = readWranglerConfig(filePath);
    // Use object key assignment instead of Map.set()
    if (config.name) {
      workers[config.name] = filePath;
    }
  }
  return workers;
}

export function extractServiceDependencies(config: Partial<WranglerConfig>): string[] {
  const deps: string[] = [];

  // Service bindings
  if (config.services) {
    config.services.forEach((binding) => {
      if (binding.service) {
        deps.push(binding.service);
      }
    });
  }

  // Durable Object bindings
  if (config.durable_objects?.bindings) {
    config.durable_objects.bindings.forEach((binding) => {
      if (binding.script_name) {
        deps.push(binding.script_name);
      }
    });
  }

  return deps;
}
