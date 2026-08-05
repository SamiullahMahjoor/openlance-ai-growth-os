import { RUNTIME_EVENTS } from '@openlance/aios-runtime';
import type { RuntimeEvent } from '@openlance/aios-runtime';
import type { ExecutionRecord } from '@openlance/aios-runtime-execution-engine';

import type { Observation, OperationalFacts } from './types.js';

/** The zero facts: an observation that contributes nothing (a statistics snapshot, or a known liveness event). */
const EMPTY_FACTS: OperationalFacts = Object.freeze({
  executions: 0,
  completed: 0,
  failed: 0,
  cancelled: 0,
  stepsRun: 0,
  retries: 0,
  recoveries: 0,
  timeouts: 0,
  unknown: 0,
});

/**
 * The telemetry collector: it extracts the raw operational facts from one immutable observation, reading it and never
 * modifying it. An `ExecutionRecord` yields its execution, terminal, step, retry, recovery, and timeout facts (retries
 * and recoveries and timeouts are read from the record's step attempts, state path, and step details, never recomputed
 * from a runtime internal). An unrecognized `RuntimeEvent` yields an `unknown` fact (zero trust); a recognized event and a
 * statistics snapshot yield no facts. It collects only; it executes nothing.
 */
export class TelemetryCollector {
  /** Collect the raw operational facts from one observation. */
  collect(observation: Observation): OperationalFacts {
    if (observation.kind === 'record') {
      return this.#fromRecord(observation.record);
    }
    if (observation.kind === 'event') {
      return this.#fromEvent(observation.event);
    }
    return EMPTY_FACTS;
  }

  #fromRecord(record: ExecutionRecord): OperationalFacts {
    // Zero trust: a structurally-malformed record must never make the public API throw; treat missing arrays as empty.
    const steps = Array.isArray(record.steps) ? record.steps : [];
    const path = Array.isArray(record.path) ? record.path : [];
    let retries = 0;
    let timeouts = 0;
    for (const step of steps) {
      retries += Math.max(0, step.attempts - 1);
      if (step.detail === 'deadline exceeded') {
        timeouts += 1;
      }
    }
    return {
      executions: 1,
      completed: record.terminal === 'completed' ? 1 : 0,
      failed: record.terminal === 'failed' ? 1 : 0,
      cancelled: record.terminal === 'cancelled' ? 1 : 0,
      stepsRun: steps.length,
      retries,
      recoveries: path.filter((state) => state === 'recovering').length,
      timeouts,
      unknown: 0,
    };
  }

  #fromEvent(event: RuntimeEvent): OperationalFacts {
    return RUNTIME_EVENTS.includes(event) ? EMPTY_FACTS : { ...EMPTY_FACTS, unknown: 1 };
  }
}

/**
 * The telemetry aggregator: a stateful accumulator of the raw operational facts across the observations processed, so the
 * operational metrics are computed incrementally. Each instance accumulates one engine's telemetry; it holds no shared
 * static state. It aggregates only; it decides nothing.
 */
export class TelemetryAggregator {
  #executions = 0;
  #completed = 0;
  #failed = 0;
  #cancelled = 0;
  #stepsRun = 0;
  #retries = 0;
  #recoveries = 0;
  #timeouts = 0;
  #unknown = 0;

  /** Add one observation's facts to the running totals. */
  record(facts: OperationalFacts): void {
    this.#executions += facts.executions;
    this.#completed += facts.completed;
    this.#failed += facts.failed;
    this.#cancelled += facts.cancelled;
    this.#stepsRun += facts.stepsRun;
    this.#retries += facts.retries;
    this.#recoveries += facts.recoveries;
    this.#timeouts += facts.timeouts;
    this.#unknown += facts.unknown;
  }

  /** The current running totals. */
  totals(): OperationalFacts {
    return Object.freeze({
      executions: this.#executions,
      completed: this.#completed,
      failed: this.#failed,
      cancelled: this.#cancelled,
      stepsRun: this.#stepsRun,
      retries: this.#retries,
      recoveries: this.#recoveries,
      timeouts: this.#timeouts,
      unknown: this.#unknown,
    });
  }
}
