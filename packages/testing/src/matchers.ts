import type { BaseError } from '@openlance/aios-errors';

const isOkResult = (received: unknown): received is { readonly ok: true } =>
  typeof received === 'object' && received !== null && (received as { ok?: unknown }).ok === true;

const isErrResult = (
  received: unknown,
): received is { readonly ok: false; readonly error: unknown } =>
  typeof received === 'object' && received !== null && (received as { ok?: unknown }).ok === false;

const toBeOk = (received: unknown) => {
  const pass = isOkResult(received);
  return {
    pass,
    message: () =>
      pass
        ? 'expected Result not to be Ok'
        : `expected Result to be Ok, received ${JSON.stringify(received)}`,
  };
};

const toBeErr = (received: unknown) => {
  const pass = isErrResult(received);
  return {
    pass,
    message: () =>
      pass
        ? 'expected Result not to be Err'
        : `expected Result to be Err, received ${JSON.stringify(received)}`,
  };
};

const toHaveErrorCode = (received: unknown, code: string) => {
  const error = isErrResult(received) ? (received.error as Partial<BaseError>) : undefined;
  const actual = error?.code;
  const pass = actual === code;
  return {
    pass,
    message: () =>
      pass
        ? `expected error code not to be '${code}'`
        : `expected error code '${code}', received '${String(actual)}'`,
  };
};

/**
 * Vitest matchers for `Result` assertions: `toBeOk`, `toBeErr`, and
 * `toHaveErrorCode(code)`. Register them once with `expect.extend(resultMatchers)`.
 */
export const resultMatchers = { toBeOk, toBeErr, toHaveErrorCode };
