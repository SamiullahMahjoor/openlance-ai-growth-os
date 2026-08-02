/**
 * Typed injection tokens. A token is a unique symbol carrying a phantom type so a
 * `Token<Engine>` cannot be confused with a `Token<Logger>` at the type level while
 * remaining a plain, explicit, reflection-free key at runtime.
 */

export type Token<T> = symbol & { readonly __type?: T };

/** Creates a fresh, unique token. The description is used only for diagnostics. */
export const token = <T>(description: string): Token<T> => Symbol(description) as Token<T>;

/** Internal: a readable name for a token, used in diagnostics. Not part of the public API. */
export const describeToken = (value: symbol): string => value.description ?? '(anonymous)';
