/**
 * The engine's operational settings. `strictGovernance` controls whether a reasoning requires an explicit governance
 * verdict on the request (strict) or treats a request with no verdict as permitted. Owned by the engine; a later stage
 * may source these from the frozen `ConfigService`.
 */
export interface ReasoningEngineSettings {
  readonly strictGovernance: boolean;
}

/** The default operational settings: a governance verdict is not required (a reasoning is permitted when none is given). */
export const DEFAULT_SETTINGS: ReasoningEngineSettings = Object.freeze({
  strictGovernance: false,
});

/**
 * Reasoning engine configuration. It holds the immutable operational settings the engine runs with. It defines no new
 * configuration mechanism.
 */
export class ReasoningConfiguration {
  readonly #settings: ReasoningEngineSettings;

  constructor(overrides?: Partial<ReasoningEngineSettings>) {
    const settings: ReasoningEngineSettings = { ...DEFAULT_SETTINGS, ...overrides };
    this.#settings = Object.freeze(settings);
  }

  /** The immutable operational settings. */
  get settings(): ReasoningEngineSettings {
    return this.#settings;
  }
}
