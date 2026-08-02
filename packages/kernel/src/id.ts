/**
 * IdGenerator: the injectable identity seam.
 *
 * The kernel defines only the contract. The concrete generator chooses a real
 * identifier strategy (for example a uuid) and is constructed at a composition
 * edge and injected, so identity is reproducible in tests via a deterministic
 * generator (docs/implementation/01-core-framework.md). Deliberately no concrete
 * implementation lives here, so the kernel takes on no dependency and reads no
 * ambient randomness.
 */

export interface IdGenerator {
  /** Returns the next identifier. Uniqueness and format are the generator's contract. */
  next(): string;
}
