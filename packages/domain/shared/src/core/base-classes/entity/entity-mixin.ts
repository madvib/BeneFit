// EntityMixin.ts
// Note: This needs to be compiled with a target that supports decorators or mixins (ES6/ES2015 or later).

import { randomUUID } from 'crypto';

type Constructor<T = object> = new (...args: unknown[]) => T;

/**
 * Mixin that injects the required Identity (id) and Equality (equals) logic
 * into any class implementing IEntity.
 */
export function IdentityMixin<T extends Constructor>(Base: T) {
  // Define a class that extends the input class (Base)
  return class extends Base {
    public readonly _id: string;

    constructor(...args: unknown[]) {
      super(...args);

      // Assume the constructor args are (props, id?)
      const id: string | undefined = args[1] as string | undefined;

      // Inject ID assignment logic
      this._id = id ? id : randomUUID();
    }

    // Inject ID getter
    public get id(): string {
      return this._id;
    }

    // Inject Equality logic based on ID
    public equals(entity?: object): boolean {
      if (!entity) return false;
      if (this === entity) return true;

      // Ensures the comparison is done between objects that are structurally entities
      if (!('id' in entity)) return false;
      if (typeof entity.id !== 'string') return false;

      return this.id === entity.id;
    }
  };
}