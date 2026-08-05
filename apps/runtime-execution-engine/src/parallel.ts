import type { ExecutionStage } from './scheduler.js';
import type { ResolvedStep } from './dependency-resolver.js';
import type { StepResult } from './types.js';

/**
 * The parallel execution coordinator: it runs the steps of one stage concurrently over an injected runner and collects
 * their results in the stage's resolved order, never in completion order, so aggregation is deterministic regardless of
 * which step finishes first. It coordinates concurrency only; the per-step work is the injected runner's, and the
 * runner's results carry each step's plan index.
 */
export class ParallelExecutionCoordinator {
  /** Run every step of the stage concurrently and return their results in resolved order. */
  async run(
    stage: ExecutionStage,
    runner: (resolved: ResolvedStep) => Promise<StepResult>,
  ): Promise<readonly StepResult[]> {
    return Promise.all(stage.map((resolved) => runner(resolved)));
  }
}
