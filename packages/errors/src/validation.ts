import { BaseError } from './base.js';

/**
 * A single conformance failure: what failed (`message`) and where (`path`). This is
 * the canonical, exported shape of an entry in {@link ValidationError.issues}, so
 * callers reference one type instead of re-declaring the structure inline.
 */
export interface ValidationIssue {
  readonly path: string;
  readonly message: string;
}

/**
 * A validation error: input did not conform. It carries a frozen list of
 * structured issues alongside the base code and context, so a caller can inspect
 * every individual conformance failure deterministically. Each issue records what
 * failed (`message`) and where (`path`).
 */
export class ValidationError extends BaseError {
  readonly category = 'validation';

  /** The individual conformance failures, frozen and order-preserving. */
  readonly issues: ReadonlyArray<ValidationIssue>;

  constructor(
    code: string,
    message: string,
    issues: ReadonlyArray<ValidationIssue>,
    context?: Record<string, unknown>,
    cause?: unknown,
  ) {
    super(code, message, context, cause);
    this.issues = Object.freeze(
      issues.map((issue) => Object.freeze({ path: issue.path, message: issue.message })),
    );
  }
}
