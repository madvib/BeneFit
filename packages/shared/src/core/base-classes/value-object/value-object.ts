// NOTE: Assuming `isDeepEqual` is an imported utility function that correctly 
// compares objects recursively, ignoring property order.

import { isDeepEqual } from "../../isDeepEqual.js";

export abstract class ValueObject<T> {
  protected readonly props: T;

  constructor(props: T) {
    // Ensuring immutability is key for Value Objects
    this.props = Object.freeze(props);
  }

  /**
   * Retrieves the properties as a plain object.
   */
  public toJSON(): T {
    return this.props;
  }

  /**
   * Compares the current ValueObject to another object for equality.
   * Compares by value (properties), not identity.
   * * @param vo The value object to compare against.
   * @returns True if both objects have identical properties and structure.
   */
  public equals(vo?: ValueObject<T>): boolean {
    // 1. Handle null/undefined comparison
    if (vo === null || vo === undefined) return false;

    // 2. Optimization: Check reference identity
    if (this === vo) return true;

    // 3. (Optional but Robust) Ensure they are the same concrete type
    if (vo.constructor !== this.constructor) return false;

    // 4. Core comparison logic: Use deep equality check on props
    // This is much safer than JSON.stringify
    return isDeepEqual(this.props, vo.props);

  }
}