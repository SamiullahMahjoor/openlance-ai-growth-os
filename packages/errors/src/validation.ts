import { BaseError } from './base.js';

/**
 * A validation error: input did not conform. It carries a frozen list of
 * structured issues alongside the base code and context, so a caller can inspect
 * every individual conformance failure deterministically. Each issue records what
 * failed (`message`) and where (`path`).
 */
export class ValidationError extends BaseError {
  readonly category = 'validation';

  /** The individual conformance failures, frozen and order-preserving. */
  readonly issues: ReadonlyArray<{ readonly path: string; readonly message: string }>;

  constructor(
    code: string,
    message: string,
    issues: ReadonlyArray<{ readonly path: string; readonly message: string }>,
    context?: Record<string, unknown>,
    cause?: unknown,
  ) {
    super(code, message, context, cause);
    this.issues = Object.freeze(
      issues.map((issue) => Object.freeze({ path: issue.path, message: issue.message })),
    );
  }
}
