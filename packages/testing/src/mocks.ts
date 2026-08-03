/**
 * A spy: a callable that records the arguments of every call and the value each
 * call returned.
 */
export interface Spy<A extends unknown[], R> {
  (...args: A): R;
  calls: A[];
  returned: R[];
}

/**
 * Builds a typed partial double. Only the fields provided are present; the result
 * is typed as the full `T` for use where a `T` is expected in a test.
 */
export const mock = <T>(partial?: Partial<T>): T => (partial ?? {}) as T;

/**
 * Builds a spy. Each call records its arguments and return value; an optional
 * implementation supplies the return value (otherwise `undefined`).
 */
export const spy = <A extends unknown[], R>(impl?: (...args: A) => R): Spy<A, R> => {
  const calls: A[] = [];
  const returned: R[] = [];
  const fn = (...args: A): R => {
    calls.push(args);
    const result = impl ? impl(...args) : (undefined as R);
    returned.push(result);
    return result;
  };
  return Object.assign(fn, { calls, returned });
};
