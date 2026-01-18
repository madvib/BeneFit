/**
 * Recursively converts Date types to string (ISO format).
 * Use this to define the "Over the Wire" shape of an entity.
 */
export type SerializeDates<T> = T extends Date
  ? string
  : T extends Array<infer U>
  ? Array<SerializeDates<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<SerializeDates<U>>
  : T extends object
  ? { [K in keyof T]: SerializeDates<T[K]> }
  : T;

/**
 * Helper to create a View type from an Entity.
 * 
 * 1. Omits specified keys from Entity
 * 2. Converts all remaining Date fields to strings (recursive)
 * 3. Intersects with any additional Computed fields
 * 
 * @example
 * export type UserView = CreateView<User, 'password' | 'salt', { fullName: string }>;
 */
export type CreateView<
  TEntity,
  TOmit extends keyof TEntity | never = never,
  TComputed = unknown
> = SerializeDates<Omit<TEntity, TOmit>> & TComputed;
