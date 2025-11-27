// For modern Node.js environments (v14.17+), crypto.randomUUID is global.
// If using older Node or strict environments, you might need: 
// import { randomUUID } from 'crypto'; 
const crypto = globalThis.crypto; 

// IEntity.ts
export interface IEntity<T> {
  // Required properties and methods
  readonly id: string;
  props: T;
  equals(other: IEntity<unknown>): boolean;
}

export abstract class Entity<T> {
  // Use a private readonly property to ensure the ID cannot be reassigned later.
  private readonly _id: string;
  protected readonly props: T;

  /**
   * Initializes the Entity. If no ID is provided (e.g., creating a new object), 
   * a cryptographically secure UUID is generated.
   * @param props The data/properties of the Entity.
   * @param id Optional existing ID for hydration (loading from a database).
   */
  constructor(props: T, id?: string) {
    // 1. UUID Assignment on Creation:
    // If ID is provided, use it (hydration). If not, generate a new UUID (creation).
    this._id = id ? id : crypto.randomUUID();
    
    this.props = props;
  }

  /**
   * Getter for the ID, ensuring it remains readonly outside the constructor.
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Checks equality based on ID.
   * @param entity The entity to compare against.
   */
  public equals(entity?: Entity<T>): boolean {
    // 1. Check for null/undefined
    if (!entity) return false;
    
    // 2. Check if it's the exact same object reference
    if (this === entity) return true;
    
    // 3. Check if the type is compatible (optional, but good practice)
    if (!(entity instanceof Entity)) return false; 
    
    // 4. Identity equality check (the core DDD principle)
    return this.id === entity.id;
  }
}