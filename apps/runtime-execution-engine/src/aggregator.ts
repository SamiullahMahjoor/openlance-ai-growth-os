import type { ExecutionState, RuntimeEvent } from '@openlance/aios-runtime';

import type { ExecutionRecord, StepResult, TerminalOutcome } from './types.js';

/** The inputs a record is composed from; every field is already computed by the coordinator. */
export interface RecordInput {
  readonly executionId: string;
  readonly terminal: TerminalOutcome;
  readonly terminalEvent: RuntimeEvent;
  readonly steps: readonly StepResult[];
  readonly path: readonly ExecutionState[];
  readonly startedAt: number;
  readonly finishedAt: number;
  readonly governance: string;
  readonly safety: string;
  readonly reason: string;
}

/**
 * The result aggregator: it composes the per-step results into the immutable execution record, ordered deterministically
 * by plan-step index (never by completion order), and deep-freezes the record and its nested step results and state
 * path. It aggregates only; it carries no business truth and decides nothing.
 */
export class ResultAggregator {
  /** Compose an immutable, deterministically-ordered execution record. */
  aggregate(input: RecordInput): ExecutionRecord {
    const steps = Object.freeze(
      [...input.steps]
        .sort((left, right) => left.index - right.index)
        .map((step) => Object.freeze({ ...step })),
    );
    const path = Object.freeze([...input.path]);
    const record: ExecutionRecord = {
      executionId: input.executionId,
      terminal: input.terminal,
      terminalEvent: input.terminalEvent,
      steps,
      path,
      startedAt: input.startedAt,
      finishedAt: input.finishedAt,
      governance: input.governance,
      safety: input.safety,
      reason: input.reason,
      validated: true,
    };
    return Object.freeze(record);
  }
}
