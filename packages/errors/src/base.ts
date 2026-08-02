/**
 * The error hierarchy root and the failure category taxonomy.
 *
 * Errors are standardized so failure is deterministic and inspectable rather than
 * stack-shaped or ad hoc (docs/implementation/02-error-framework.md). Every error
 * carries a stable, registry-checked code and a frozen structured context, so the
 * same failure serializes identically across runs. This is an engineering error
 * taxonomy only; the constitutional refusal, escalation, and safe-failure models
 * (owned by Safety and Governance) are distinct and deferred (ADR-0006).
 *
 * `Result` (owned by @openlance/aios-kernel) is the value-based failure channel;
 * this package owns the errors that populate it.
 */

/** The three ways the system reasons about failure. */
export type ErrorCategory = 'domain' | 'infrastructure' | 'validation';

/**
 * Base of every error in the system. Immutable after construction: the code,
 * category, context, and cause never change. Serialization is intentionally
 * deterministic: `toJSON` excludes the stack and any ambient time, so identical
 * inputs yield identical output.
 */
export abstract class BaseError extends Error {
  /** The failure category, fixed by each concrete subclass. */
  abstract readonly category: ErrorCategory;

  /** Stable, registry-checked code, namespaced by package (for example `CONFIG.MISSING_KEY`). */
  readonly code: string;

  /** Frozen structured context describing the failure. */
  readonly context: Readonly<Record<string, unknown>>;

  /** The underlying cause, if this error wraps another. */
  override readonly cause?: unknown;

  constructor(code: string, message: string, context?: Record<string, unknown>, cause?: unknown) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    this.context = Object.freeze({ ...context });
    this.cause = cause;
  }

  /**
   * Deterministic, serializable projection of the error. Deliberately omits the
   * stack and any timestamp so identical failures compare equal.
   */
  toJSON(): {
    code: string;
    category: ErrorCategory;
    message: string;
    context: Readonly<Record<string, unknown>>;
  } {
    return {
      code: this.code,
      category: this.category,
      message: this.message,
      context: this.context,
    };
  }
}
