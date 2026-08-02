import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import type { BaseError } from './base.js';

/**
 * Bridges between throwing code and the value-based `Result` channel owned by
 * @openlance/aios-kernel. Expected failures become `Err<BaseError>`; the caller
 * supplies the mapping from an unknown thrown value to a `BaseError` so the error
 * type stays explicit and the boundary stays deterministic.
 */

/** Runs a synchronous function, capturing a thrown value as an `Err<BaseError>`. */
export const fromThrowable = <T>(
  fn: () => T,
  map: (error: unknown) => BaseError,
): Result<T, BaseError> => {
  try {
    return ok(fn());
  } catch (error) {
    return err(map(error));
  }
};

/** Awaits a promise, capturing a rejection as an `Err<BaseError>`. */
export const toResult = async <T>(
  promise: Promise<T>,
  map: (error: unknown) => BaseError,
): Promise<Result<T, BaseError>> => {
  try {
    return ok(await promise);
  } catch (error) {
    return err(map(error));
  }
};
