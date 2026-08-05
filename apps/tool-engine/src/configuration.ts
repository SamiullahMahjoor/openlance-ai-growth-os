/**
 * The engine's operational settings. `strictPermission` controls whether a preparation requires an explicit permission
 * set on the request (strict) or treats a request with no permission set as unrestricted. Owned by the engine; a later
 * stage may source these from the frozen `ConfigService`.
 */
export interface ToolEngineSettings {
  readonly strictPermission: boolean;
}

/** The default operational settings: permission is not required (permission is applied when provided). */
export const DEFAULT_SETTINGS: ToolEngineSettings = Object.freeze({
  strictPermission: false,
});

/**
 * Tool engine configuration. It holds the immutable operational settings the engine runs with. It defines no new
 * configuration mechanism.
 */
export class ToolConfiguration {
  readonly #settings: ToolEngineSettings;

  constructor(overrides?: Partial<ToolEngineSettings>) {
    const settings: ToolEngineSettings = { ...DEFAULT_SETTINGS, ...overrides };
    this.#settings = Object.freeze(settings);
  }

  /** The immutable operational settings. */
  get settings(): ToolEngineSettings {
    return this.#settings;
  }
}
