import type { StepResult } from './types.js';

/**
 * The checkpoint manager: it records the result of each completed step, so that when a stage is re-attempted during
 * recovery a completed step is restored from its checkpoint rather than executed again. This makes recovery idempotent:
 * a completed step's side effect is never duplicated by a retry. Each instance tracks one execution, so executions never
 * share checkpoints. It records and restores only; it executes nothing.
 */
export class CheckpointManager {
  readonly #byIndex = new Map<number, StepResult>();
  readonly #enabled: boolean;

  constructor(enabled: boolean) {
    this.#enabled = enabled;
  }

  /** Record a completed step's result, when checkpointing is enabled. */
  record(result: StepResult): void {
    if (this.#enabled) {
      this.#byIndex.set(result.index, result);
    }
  }

  /** The checkpointed result for a step index, or `undefined` if none is recorded. */
  restore(index: number): StepResult | undefined {
    return this.#byIndex.get(index);
  }

  /** How many completed steps are checkpointed. */
  get count(): number {
    return this.#byIndex.size;
  }
}
