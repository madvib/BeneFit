import { SerializeDates } from 'src/index.js';

export function serializeForView<T>(value: T): SerializeDates<T> {
  if (value instanceof Date) {
    return value.toISOString() as SerializeDates<T>;
  }

  if (Array.isArray(value)) {
    return value.map(serializeForView) as SerializeDates<T>;
  }

  if (value && typeof value === 'object') {
    const result: any = {};
    for (const key in value) {
      result[key] = serializeForView((value as any)[key]);
    }
    return result;
  }

  return value as SerializeDates<T>;
}
