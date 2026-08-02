/**
 * Brand: nominal ("branded") typing for values that are structurally identical
 * but must not be interchangeable, such as different kinds of identifier.
 *
 * `Brand<T, B>` is `T` tagged with a phantom brand `B`; it carries no runtime
 * field, so a branded value is exactly its underlying value at runtime.
 *
 * Owned by @openlance/aios-kernel (docs/implementation/01-core-framework.md).
 */

export type Brand<T, B extends string> = T & { readonly __brand: B };

/**
 * Constructs a branded value. This is the single sanctioned place a brand is
 * applied; callers use this helper (or a canonical constructor built on it, such
 * as those in `types.ts`) rather than a raw `as` cast, so branding stays
 * intentional and searchable.
 */
export const brand = <T, B extends string>(value: T): Brand<T, B> => value as Brand<T, B>;
