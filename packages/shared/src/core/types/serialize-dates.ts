/**
 * Recursively converts Date types to string (ISO format).
 * Use this to define the "Over the Wire" shape of an entity.
 */
export type SerializeDates<T> = T extends unknown
  ? T extends Date
  ? string
  : T extends Array<infer U>
  ? Array<SerializeDates<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<SerializeDates<U>>
  : T extends object
  ? { [K in keyof T]: SerializeDates<T[K]> }
  : T
  : never;
