import type { ValidationError } from '@openlance/aios-errors';
import type { Result } from '@openlance/aios-kernel';

/**
 * A neutral validation seam. Consumers supply a `Schema<T>` that parses untyped,
 * merged configuration into a typed value or a `ValidationError`. Abstracting the
 * validator keeps the configuration surface free of any specific validation
 * library, so a concrete one can be adopted later without touching consumers.
 */
export interface Schema<T> {
  parse(input: unknown): Result<T, ValidationError>;
}
