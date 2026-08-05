/**
 * The engine's operational settings. `maxSteps` bounds an agent's composition and `maxLinks` bounds its coordination
 * topology (no unbounded composition or delegation, per the frozen `coordination-acyclic-delegation-bounded` invariant);
 * a plan that exceeds either is refused. Owned by the engine; a later stage may source these from the frozen
 * `ConfigService`.
 */
export interface AgentSettings {
  readonly maxSteps: number;
  readonly maxLinks: number;
}

/** The default operational settings: composition and coordination are bounded to generous default counts. */
export const DEFAULT_SETTINGS: AgentSettings = Object.freeze({
  maxSteps: 64,
  maxLinks: 64,
});

/**
 * Agent engine configuration. It holds the immutable operational settings the engine runs with. It defines no new
 * configuration mechanism.
 */
export class AgentConfiguration {
  readonly #settings: AgentSettings;

  constructor(overrides?: Partial<AgentSettings>) {
    const settings: AgentSettings = { ...DEFAULT_SETTINGS, ...overrides };
    this.#settings = Object.freeze(settings);
  }

  /** The immutable operational settings. */
  get settings(): AgentSettings {
    return this.#settings;
  }
}
