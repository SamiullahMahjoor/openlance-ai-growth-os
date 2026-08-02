/**
 * Option: an explicit presence-or-absence value that removes null/undefined
 * ambiguity from a type. `Some<T>` carries a value; `None` carries nothing.
 *
 * Owned by @openlance/aios-kernel (docs/implementation/01-core-framework.md).
 *
 * The combinators mirror the shape of `Result` (constructors, guards,
 * transformers, extractor). They carry an `Option` suffix where a bare name would
 * collide with the `Result` combinator of the same shape in the package barrel, so
 * the flat `Result` surface defined by the design is preserved unchanged. See
 * ADR-0008.
 */

export interface Some<T> {
  readonly some: true;
  readonly value: T;
}

export interface None {
  readonly some: false;
}

export type Option<T> = Some<T> | None;

/** Wraps a present value. */
export const some = <T>(value: T): Some<T> => ({ some: true, value });

/** The single shared absent value. */
export const none: None = { some: false };

/** Builds an `Option` from a nullable value: `null`/`undefined` become `none`. */
export const fromNullable = <T>(value: T | null | undefined): Option<T> =>
  value === null || value === undefined ? none : some(value);

/** Narrows an `Option` to its present branch. */
export const isSome = <T>(option: Option<T>): option is Some<T> => option.some;

/** Narrows an `Option` to its absent branch. */
export const isNone = <T>(option: Option<T>): option is None => !option.some;

/** Transforms a present value, leaving `none` untouched. */
export const mapOption = <T, U>(option: Option<T>, f: (value: T) => U): Option<U> =>
  option.some ? some(f(option.value)) : option;

/** Chains an `Option`-returning computation onto a present value (monadic bind). */
export const andThenOption = <T, U>(option: Option<T>, f: (value: T) => Option<U>): Option<U> =>
  option.some ? f(option.value) : option;

/** Returns the present value, or a fallback when the option is absent. */
export const unwrapOrOption = <T>(option: Option<T>, fallback: T): T =>
  option.some ? option.value : fallback;
