/**
 * The engine's operational settings. `strictVariables` controls whether a missing required variable is a
 * hard failure (strict, the default) or is left as a placeholder for boundary validation to reject.
 * Owned by the engine; a later stage may source these from the frozen `ConfigService`.
 */
export interface PromptEngineSettings {
  readonly strictVariables: boolean;
}

/** The default operational settings: strict variable resolution. */
export const DEFAULT_SETTINGS: PromptEngineSettings = Object.freeze({
  strictVariables: true,
});

/**
 * Prompt engine configuration. It holds the immutable operational settings the engine runs with. It
 * defines no new configuration mechanism.
 */
export class PromptConfiguration {
  readonly #settings: PromptEngineSettings;

  constructor(overrides?: Partial<PromptEngineSettings>) {
    const settings: PromptEngineSettings = { ...DEFAULT_SETTINGS, ...overrides };
    this.#settings = Object.freeze(settings);
  }

  /** The immutable operational settings. */
  get settings(): PromptEngineSettings {
    return this.#settings;
  }
}
