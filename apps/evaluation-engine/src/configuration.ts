/**
 * The engine's immutable settings. `historyLimit` bounds the retained audit trail returned to a reader, so the audit is
 * always a bounded, deterministic view. Owned by the engine; a later stage may source it from the frozen `ConfigService`.
 */
export interface EvaluationSettings {
  readonly historyLimit: number;
}

/** The default settings. */
export const DEFAULT_SETTINGS: EvaluationSettings = Object.freeze({
  historyLimit: 256,
});

/** Clamp a positive integer to `[1, max]`, falling back to `fallback` when it is not finite. */
const count = (value: number, max: number, fallback: number): number =>
  Number.isFinite(value) ? Math.min(max, Math.max(1, Math.trunc(value))) : fallback;

/**
 * Evaluation engine configuration. It holds the immutable settings the engine runs with, clamping the audit bound to a
 * finite range (a non-finite override falls back to the default), so a misconfiguration can never make the audit
 * unbounded. It defines no new configuration mechanism.
 */
export class EvaluationConfiguration {
  readonly #settings: EvaluationSettings;

  constructor(overrides?: Partial<EvaluationSettings>) {
    const merged: EvaluationSettings = { ...DEFAULT_SETTINGS, ...overrides };
    this.#settings = Object.freeze({
      historyLimit: count(merged.historyLimit, 4096, DEFAULT_SETTINGS.historyLimit),
    });
  }

  /** The immutable settings. */
  get settings(): EvaluationSettings {
    return this.#settings;
  }
}
