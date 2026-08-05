/**
 * The engine's operational settings. `strictPermission` controls whether a retrieval requires an explicit
 * governance permission set on the request (strict) or treats all discovered candidates as eligible when
 * none is given. Owned by the engine; a later stage may source these from the frozen `ConfigService`.
 */
export interface RetrievalEngineSettings {
  readonly strictPermission: boolean;
}

/** The default operational settings: permission is not required (permission is applied when provided). */
export const DEFAULT_SETTINGS: RetrievalEngineSettings = Object.freeze({
  strictPermission: false,
});

/**
 * Retrieval engine configuration. It holds the immutable operational settings the engine runs with. It
 * defines no new configuration mechanism.
 */
export class RetrievalConfiguration {
  readonly #settings: RetrievalEngineSettings;

  constructor(overrides?: Partial<RetrievalEngineSettings>) {
    const settings: RetrievalEngineSettings = { ...DEFAULT_SETTINGS, ...overrides };
    this.#settings = Object.freeze(settings);
  }

  /** The immutable operational settings. */
  get settings(): RetrievalEngineSettings {
    return this.#settings;
  }
}
