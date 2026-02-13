import fs from 'fs';
import path from 'path';
import { getPersistPath } from './get-persist-path';

export function findDurableObjectSqliteDb(handlerName: string, objectName: string): string {
  const doDir = path.join(getPersistPath(), 'do', `${handlerName}-${objectName}`);

  const file = fs.readdirSync(doDir).find((f) => f.endsWith('.sqlite'));

  if (!file) {
    throw new Error(`No sqlite DB found for ${handlerName}/${objectName}`);
  }

  return path.join(doDir, file);
}
