import type { IdGenerator } from '@openlance/aios-kernel';

/**
 * A deterministic `IdGenerator` for tests. It yields `prefix-1`, `prefix-2`, ...
 * (default prefix `id`), so identity is reproducible in place of random ids.
 */
export class SequentialId implements IdGenerator {
  #counter = 0;
  readonly #prefix: string;

  constructor(prefix = 'id') {
    this.#prefix = prefix;
  }

  next(): string {
    this.#counter += 1;
    return `${this.#prefix}-${this.#counter}`;
  }
}
