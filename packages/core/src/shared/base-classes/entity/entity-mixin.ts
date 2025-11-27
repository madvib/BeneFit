// EntityMixin.ts
// Note: This needs to be compiled with a target that supports decorators or mixins (ES6/ES2015 or later).


type Constructor<T = {}> = new (...args: any[]) => T;

const crypto = globalThis.crypto;

/**
 * Mixin that injects the required Identity (id) and Equality (equals) logic 
 * into any class implementing IEntity.
 */
export function IdentityMixin<T extends Constructor>(Base: T) {
  // Define a class that extends the input class (Base)
  return class extends Base {
    public readonly _id: string;

    constructor(...args: any[]) {
      super(...args);

      // Assume the constructor args are (props, id?)
      const id: string | undefined = args[1];

      // Inject ID assignment logic
      this._id = id ? id : crypto.randomUUID();
    }

    // Inject ID getter
    public get id(): string {
      return this._id;
    }

    // Inject Equality logic based on ID
    public equals(entity?: object | any): boolean {
      if (!entity) return false;
      if (this === entity) return true;

      // Ensures the comparison is done between objects that are structurally entities
      if (!('id' in entity)) return false;
      if (typeof entity.id !== 'string') return false;

      return this.id === entity.id;
    }
  };
}