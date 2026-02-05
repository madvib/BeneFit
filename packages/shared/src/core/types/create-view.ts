import { z } from 'zod';

// --- 1. CONFIG ---

export type DomainBrandTag = 'domain';

// A CONSTANT error message.
// Because this string is static, all generated View types are compatible with each other.
type DomainError = '⛔ ERROR: Raw Domain detected. You must Map or Omit this field! ⛔';

/**
 * ViewSafe marker indicates this object contains no Domain-branded fields.
 * 
 * It appears in type hints as `& ViewSafe` but does not affect runtime behavior
 * or require any additional properties when constructing objects.
 * 
 * Think of it as TypeScript's way of saying "✅ This is safe for API responses"
 */
type ViewSafe = {
  [K in typeof z.$brand]?: DomainError;
  // [z.$brand]?: never would give quieter type hints 
};

// --- 2. LOGIC ---

type ResolveValue<T> = T extends unknown
  ? // Case A: Date -> string
  T extends Date
  ? string
  : // Case B: Array -> Recurse
  T extends (infer U)[]
  ? ResolveValue<U>[]
  : // Case C: Object -> Recurse, Strip Brand, Inject Safety
  T extends object
  ? {
    // 1. Map Keys (Strip brand from the key list)
    [K in keyof T as K extends typeof z.$brand ? never : K]: ResolveValue<T[K]>;
  } &
  // 2. Inject the Poison Pill (Standardized)
  ViewSafe
  : // Case D: Primitive -> Keep
  T
  : never;

// Helper to Strip Brand from Root (for safe spreading)
export type Unbrand<T> = T extends unknown ? Omit<T, typeof z.$brand> : never;

// Helper to Flatten types
type Simplify<T> = T extends unknown ? { [K in keyof T]: T[K] } & {} : never;

// --- 3. THE UTILITY ---

export type CreateView<
  TDomain,
  TOmit extends keyof Unbrand<TDomain> | never = never,
  TOverrides extends object = object,
> = TDomain extends unknown ? Simplify<
  Omit<
    // We map the ROOT properties individually.
    // We apply ResolveValue to the *Values*, which makes the *Children* strict.
    // But we do NOT apply '& ViewSafe' to the Root, so you can still spread '...plan'.
    {
      [K in keyof Unbrand<TDomain>]: ResolveValue<Unbrand<TDomain>[K]>;
    },
    TOmit | keyof TOverrides
  > &
  TOverrides
> : never;
