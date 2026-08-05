/**
 * The engine's operational settings. `requireExplicitApproval` controls whether every action requires a recorded human
 * approval to be authorized (organization-wide human-in-the-loop), or only the high and critical trust actions the frozen
 * risk model requires. Owned by the engine; a later stage may source these from the frozen `ConfigService`.
 */
export interface GovernanceEngineSettings {
  readonly requireExplicitApproval: boolean;
}

/** The default operational settings: only the trust levels the frozen risk model requires need human approval. */
export const DEFAULT_SETTINGS: GovernanceEngineSettings = Object.freeze({
  requireExplicitApproval: false,
});

/**
 * Governance engine configuration. It holds the immutable operational settings the engine runs with. It defines no new
 * configuration mechanism.
 */
export class GovernanceConfiguration {
  readonly #settings: GovernanceEngineSettings;

  constructor(overrides?: Partial<GovernanceEngineSettings>) {
    const settings: GovernanceEngineSettings = { ...DEFAULT_SETTINGS, ...overrides };
    this.#settings = Object.freeze(settings);
  }

  /** The immutable operational settings. */
  get settings(): GovernanceEngineSettings {
    return this.#settings;
  }
}
