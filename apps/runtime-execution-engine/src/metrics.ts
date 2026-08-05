import type { ExecutionStatistics, TerminalOutcome } from './types.js';

/**
 * Operational metrics: counters over executions, terminal outcomes, steps run, and retries. It records operational facts
 * only; it carries no execution truth and decides nothing.
 */
export class ExecutionMetrics {
  #executions = 0;
  #completed = 0;
  #failed = 0;
  #cancelled = 0;
  #stepsRun = 0;
  #retries = 0;

  /** Record that an execution was run. */
  recordExecution(): void {
    this.#executions += 1;
  }

  /** Record an execution's terminal outcome. */
  recordTerminal(terminal: TerminalOutcome): void {
    if (terminal === 'completed') {
      this.#completed += 1;
    } else if (terminal === 'cancelled') {
      this.#cancelled += 1;
    } else {
      this.#failed += 1;
    }
  }

  /** Record that a step was run. */
  recordStep(): void {
    this.#stepsRun += 1;
  }

  /** Record that a step attempt was retried. */
  recordRetry(): void {
    this.#retries += 1;
  }

  /** A frozen snapshot of the current counters. */
  statistics(): ExecutionStatistics {
    return Object.freeze({
      executions: this.#executions,
      completed: this.#completed,
      failed: this.#failed,
      cancelled: this.#cancelled,
      stepsRun: this.#stepsRun,
      retries: this.#retries,
    });
  }
}
