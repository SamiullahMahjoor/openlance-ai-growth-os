/**
 * The engine's immutable operational settings. `failedThreshold` is the failure ratio at or above which health is
 * assessed `failed`; `alertThreshold` is the failure ratio above which an alert is raised; `historyLimit` bounds the
 * retained health history. Owned by the engine; a later stage may source these from the frozen `ConfigService`.
 */
export interface OperationsSettings {
  readonly failedThreshold: number;
  readonly alertThreshold: number;
  readonly historyLimit: number;
}

/** The default operational settings. */
export const DEFAULT_SETTINGS: OperationsSettings = Object.freeze({
  failedThreshold: 0.5,
  alertThreshold: 0.2,
  historyLimit: 64,
});

/** Clamp a ratio to `[0, 1]`, falling back to `fallback` when it is not finite. */
const ratio = (value: number, fallback: number): number =>
  Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : fallback;

/** Clamp a positive integer to `[1, max]`, falling back to `fallback` when it is not finite. */
const count = (value: number, max: number, fallback: number): number =>
  Number.isFinite(value) ? Math.min(max, Math.max(1, Math.trunc(value))) : fallback;

/**
 * Operations engine configuration. It holds the immutable operational settings the engine runs with, clamping every
 * threshold to `[0, 1]` and every bound to a finite range (a non-finite override falls back to the default), so a
 * misconfiguration can never make assessment non-deterministic or unbounded. It defines no new configuration mechanism.
 */
export class OperationsConfiguration {
  readonly #settings: OperationsSettings;

  constructor(overrides?: Partial<OperationsSettings>) {
    const merged: OperationsSettings = { ...DEFAULT_SETTINGS, ...overrides };
    this.#settings = Object.freeze({
      failedThreshold: ratio(merged.failedThreshold, DEFAULT_SETTINGS.failedThreshold),
      alertThreshold: ratio(merged.alertThreshold, DEFAULT_SETTINGS.alertThreshold),
      historyLimit: count(merged.historyLimit, 4096, DEFAULT_SETTINGS.historyLimit),
    });
  }

  /** The immutable operational settings. */
  get settings(): OperationsSettings {
    return this.#settings;
  }
}
