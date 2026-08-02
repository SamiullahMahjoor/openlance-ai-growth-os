/**
 * Result: railway-oriented, deterministic failure propagation.
 *
 * A computation that can fail returns a `Result<T, E>` value rather than throwing.
 * Failure therefore becomes part of the type signature and control flow is
 * reproducible: identical inputs produce an identical `Ok`/`Err` outcome. This is
 * the code-level form of the determinism invariant that recurs across the AI
 * namespaces (see docs/implementation/01-core-framework.md and ADR-0006).
 *
 * Owned by @openlance/aios-kernel. The error hierarchy that populates `E` is owned
 * by @openlance/aios-errors, which depends on this type; the dependency never runs
 * the other way.
 */

export interface Ok<T> {
  readonly ok: true;
  readonly value: T;
}

export interface Err<E> {
  readonly ok: false;
  readonly error: E;
}

export type Result<T, E> = Ok<T> | Err<E>;

/** Wraps a success value. */
export const ok = <T>(value: T): Ok<T> => ({ ok: true, value });

/** Wraps a failure value. */
export const err = <E>(error: E): Err<E> => ({ ok: false, error });

/** Narrows a `Result` to its success branch. */
export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> => result.ok;

/** Narrows a `Result` to its failure branch. */
export const isErr = <T, E>(result: Result<T, E>): result is Err<E> => !result.ok;

/** Transforms the success value, leaving a failure untouched. */
export const map = <T, U, E>(result: Result<T, E>, f: (value: T) => U): Result<U, E> =>
  result.ok ? ok(f(result.value)) : result;

/** Transforms the failure value, leaving a success untouched. */
export const mapErr = <T, E, F>(result: Result<T, E>, f: (error: E) => F): Result<T, F> =>
  result.ok ? result : err(f(result.error));

/** Chains a fallible computation onto the success value (monadic bind). */
export const andThen = <T, U, E>(
  result: Result<T, E>,
  f: (value: T) => Result<U, E>,
): Result<U, E> => (result.ok ? f(result.value) : result);

/** Returns the success value, or a fallback when the result is a failure. */
export const unwrapOr = <T, E>(result: Result<T, E>, fallback: T): T =>
  result.ok ? result.value : fallback;
