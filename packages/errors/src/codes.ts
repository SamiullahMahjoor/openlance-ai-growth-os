import { DomainError } from './domain.js';

/**
 * Registry for error codes. Codes are namespaced per package (`CONFIG.*`, `DI.*`,
 * `PLUGIN.*`, ...) and must be globally unique; a collision is a programming error
 * surfaced by `assertUnique`, which the build wiring (subsystem 09) runs over every
 * registered code. The registry owns only uniqueness; it never formats, resolves,
 * or interprets a code.
 */
export interface ErrorCodeRegistry {
  /** Records a code as registered. Registering the same code twice is a collision. */
  register(code: string): void;
  /** Throws if any code was registered more than once; otherwise returns. */
  assertUnique(): void;
}

/**
 * In-memory {@link ErrorCodeRegistry}. Holds no ambient state and reads no
 * environment; a caller constructs one, registers into it, and asserts. The
 * duplicate report is sorted so the failure is deterministic.
 */
export class InMemoryErrorCodeRegistry implements ErrorCodeRegistry {
  readonly #counts = new Map<string, number>();

  register(code: string): void {
    this.#counts.set(code, (this.#counts.get(code) ?? 0) + 1);
  }

  assertUnique(): void {
    const duplicates = [...this.#counts.entries()]
      .filter(([, count]) => count > 1)
      .map(([code]) => code)
      .sort();
    if (duplicates.length > 0) {
      throw new DomainError(
        'ERRORS.DUPLICATE_CODE',
        `Duplicate error code(s) registered: ${duplicates.join(', ')}`,
        { duplicates },
      );
    }
  }
}
