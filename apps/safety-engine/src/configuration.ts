/**
 * The engine's immutable, deterministic safety policy. It is a zero-trust allowlist with denylist overlays: a tool
 * capability or a memory or retrieval scope that is not on its allowlist is unknown and fails closed, and a capability,
 * combination, token, or scope on a denylist raises protection. `known...` and `allowed...` are allowlists (what is
 * confirmed safe); `sandboxed...`, `restricted...`, and `dangerous...` are denylist overlays. The bounds cap plan size,
 * coordination size, and prompt reference count. Owned by the engine; a later stage may source it from the frozen
 * `ConfigService`.
 */
export interface SafetyPolicy {
  readonly knownToolCapabilities: readonly string[];
  readonly sandboxedToolCapabilities: readonly string[];
  readonly restrictedToolCapabilities: readonly string[];
  readonly dangerousToolCombinations: readonly (readonly string[])[];
  readonly restrictedPromptTokens: readonly string[];
  readonly allowedMemoryScopes: readonly string[];
  readonly restrictedMemoryScopes: readonly string[];
  readonly allowedRetrievalScopes: readonly string[];
  readonly restrictedRetrievalScopes: readonly string[];
  readonly restrictedStepCapabilities: readonly string[];
  readonly maxSteps: number;
  readonly maxCoordinationLinks: number;
  readonly maxContextReferences: number;
}

/**
 * The default policy. It is fail-closed and zero-trust: every allowlist is empty, so an unconfigured engine treats every
 * tool capability and every memory and retrieval scope as unknown and fails closed to `UNSAFE`. A plan with no tool,
 * memory, or retrieval step and no configured hazard is safe. The bounds mirror the Agent Engine's structural bounds.
 */
export const DEFAULT_POLICY: SafetyPolicy = Object.freeze({
  knownToolCapabilities: Object.freeze([]),
  sandboxedToolCapabilities: Object.freeze([]),
  restrictedToolCapabilities: Object.freeze([]),
  dangerousToolCombinations: Object.freeze([]),
  restrictedPromptTokens: Object.freeze([]),
  allowedMemoryScopes: Object.freeze([]),
  restrictedMemoryScopes: Object.freeze([]),
  allowedRetrievalScopes: Object.freeze([]),
  restrictedRetrievalScopes: Object.freeze([]),
  restrictedStepCapabilities: Object.freeze([]),
  maxSteps: 64,
  maxCoordinationLinks: 64,
  maxContextReferences: 32,
}) as SafetyPolicy;

/**
 * Safety engine configuration. It holds the immutable base safety policy the engine runs with, merging any overrides
 * over the fail-closed default. It defines no new configuration mechanism.
 */
export class SafetyConfiguration {
  readonly #policy: SafetyPolicy;

  constructor(overrides?: Partial<SafetyPolicy>) {
    const policy: SafetyPolicy = { ...DEFAULT_POLICY, ...overrides };
    this.#policy = Object.freeze(policy);
  }

  /** The immutable base safety policy. */
  get policy(): SafetyPolicy {
    return this.#policy;
  }
}
