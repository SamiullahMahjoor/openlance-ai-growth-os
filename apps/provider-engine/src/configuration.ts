import type { ExecutionOptions } from './types.js';

/**
 * The engine's operational settings: the per-provider attempt bound and an optional clock-time
 * deadline (`null` for none). Owned by the engine; a later stage may source these from the frozen
 * `ConfigService`.
 */
export interface ProviderEngineSettings {
  readonly maxAttempts: number;
  readonly deadline: number | null;
}

/** The default operational settings: one attempt per provider, no deadline. */
export const DEFAULT_SETTINGS: ProviderEngineSettings = Object.freeze({
  maxAttempts: 1,
  deadline: null,
});

/**
 * Provider engine configuration. It holds the immutable operational settings the engine runs with and
 * derives the bounded execution options for one governed invocation. It defines no new configuration
 * mechanism.
 */
export class ProviderConfiguration {
  readonly #settings: ProviderEngineSettings;

  constructor(overrides?: Partial<ProviderEngineSettings>) {
    const settings: ProviderEngineSettings = { ...DEFAULT_SETTINGS, ...overrides };
    this.#settings = Object.freeze(settings);
  }

  /** The immutable operational settings. */
  get settings(): ProviderEngineSettings {
    return this.#settings;
  }

  /** The bounded execution options derived from the settings (no cancellation signal by default). */
  executionOptions(): ExecutionOptions {
    return {
      maxAttempts: this.#settings.maxAttempts,
      deadline: this.#settings.deadline,
      signal: null,
    };
  }
}
