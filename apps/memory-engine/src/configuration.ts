/**
 * The engine's operational settings. `strictGrounding` controls whether a record with empty content is a
 * hard validation failure (strict, the default) or is allowed. Owned by the engine; a later stage may
 * source these from the frozen `ConfigService`.
 */
export interface MemoryEngineSettings {
  readonly strictGrounding: boolean;
}

/** The default operational settings: strict grounding validation. */
export const DEFAULT_SETTINGS: MemoryEngineSettings = Object.freeze({
  strictGrounding: true,
});

/**
 * Memory engine configuration. It holds the immutable operational settings the engine runs with. It
 * defines no new configuration mechanism.
 */
export class MemoryConfiguration {
  readonly #settings: MemoryEngineSettings;

  constructor(overrides?: Partial<MemoryEngineSettings>) {
    const settings: MemoryEngineSettings = { ...DEFAULT_SETTINGS, ...overrides };
    this.#settings = Object.freeze(settings);
  }

  /** The immutable operational settings. */
  get settings(): MemoryEngineSettings {
    return this.#settings;
  }
}
