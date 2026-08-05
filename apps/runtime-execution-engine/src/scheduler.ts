import type { ResolvedStep } from './dependency-resolver.js';

/** An execution stage: a set of steps the runtime runs together (concurrently), in resolved order. */
export type ExecutionStage = readonly ResolvedStep[];

/**
 * The scheduler: it partitions the resolved, ordered steps into ordered stages the runtime runs one after another. A
 * stage holds at most `maxConcurrency` steps and never spans a barrier capability (a step whose capability is a barrier
 * runs alone in its own stage), so a sensitive capability is never co-scheduled. With `maxConcurrency` of 1 every stage
 * holds one step and execution is fully sequential in plan order. The scheduler never reorders across the resolved order;
 * it only groups adjacent independent steps. It schedules order only; it executes nothing.
 */
export class Scheduler {
  /** Partition the resolved steps into ordered stages of at most `maxConcurrency`, breaking at a barrier capability. */
  schedule(
    resolved: readonly ResolvedStep[],
    maxConcurrency: number,
    barriers: ReadonlySet<string>,
  ): readonly ExecutionStage[] {
    const stages: ResolvedStep[][] = [];
    let current: ResolvedStep[] = [];
    for (const resolvedStep of resolved) {
      const isBarrier = barriers.has(resolvedStep.step.capability);
      if (isBarrier) {
        if (current.length > 0) {
          stages.push(current);
          current = [];
        }
        stages.push([resolvedStep]);
        continue;
      }
      if (current.length >= maxConcurrency) {
        stages.push(current);
        current = [];
      }
      current.push(resolvedStep);
    }
    if (current.length > 0) {
      stages.push(current);
    }
    return Object.freeze(stages.map((stage) => Object.freeze(stage)));
  }
}
