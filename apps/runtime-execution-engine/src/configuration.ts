/**
 * The engine's operational execution settings. `maxAttempts` bounds per-step retries (so recovery is bounded and never
 * runs without end); `backoffBaseMillis` is the base of the deterministic exponential backoff the retry policy reports;
 * `maxConcurrency` bounds how many steps a stage runs at once (1 is fully sequential in plan order); `checkpointing`
 * enables recording completed-step results so a resume never re-executes a completed step. Owned by the engine; a later
 * stage may source these from the frozen `ConfigService`.
 */
export interface ExecutionSettings {
  readonly maxAttempts: number;
  readonly maxRecoveries: number;
  readonly backoffBaseMillis: number;
  readonly maxConcurrency: number;
  readonly checkpointing: boolean;
}

/** The default operational settings: bounded single-attempt, no execution-level recovery, sequential, checkpointing on. */
export const DEFAULT_SETTINGS: ExecutionSettings = Object.freeze({
  maxAttempts: 1,
  maxRecoveries: 0,
  backoffBaseMillis: 10,
  maxConcurrency: 1,
  checkpointing: true,
});

/** The finite upper caps that keep every bound bounded, so retries, recovery, and concurrency can never run unbounded. */
const MAX_ATTEMPTS = 10_000;
const MAX_RECOVERIES = 10_000;
const MAX_CONCURRENCY = 1_024;
const MAX_BACKOFF_MILLIS = 3_600_000;

/** Clamp a setting to `[min, max]`, falling back to `fallback` when it is not a finite number (guards NaN and Infinity). */
const bound = (value: number, min: number, max: number, fallback: number): number =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, Math.trunc(value))) : fallback;

/**
 * Runtime execution engine configuration. It holds the immutable operational settings the engine runs with, clamping
 * every bound to a finite `[minimum, maximum]` range (a non-finite override falls back to the default), so a
 * misconfiguration - even `Infinity`, `NaN`, or a huge value - can never unbound retries, recovery, or concurrency, and
 * the engine always terminates. It defines no new configuration mechanism.
 */
export class ExecutionConfiguration {
  readonly #settings: ExecutionSettings;

  constructor(overrides?: Partial<ExecutionSettings>) {
    const merged: ExecutionSettings = { ...DEFAULT_SETTINGS, ...overrides };
    this.#settings = Object.freeze({
      maxAttempts: bound(merged.maxAttempts, 1, MAX_ATTEMPTS, DEFAULT_SETTINGS.maxAttempts),
      maxRecoveries: bound(merged.maxRecoveries, 0, MAX_RECOVERIES, DEFAULT_SETTINGS.maxRecoveries),
      backoffBaseMillis: bound(
        merged.backoffBaseMillis,
        0,
        MAX_BACKOFF_MILLIS,
        DEFAULT_SETTINGS.backoffBaseMillis,
      ),
      maxConcurrency: bound(
        merged.maxConcurrency,
        1,
        MAX_CONCURRENCY,
        DEFAULT_SETTINGS.maxConcurrency,
      ),
      checkpointing: merged.checkpointing,
    });
  }

  /** The immutable operational settings. */
  get settings(): ExecutionSettings {
    return this.#settings;
  }
}
