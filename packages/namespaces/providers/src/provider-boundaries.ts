/**
 * Provider boundaries (ai/providers/provider-boundaries.md, OL-AI-PROVIDERS-PROVIDER-BOUNDARIES).
 *
 * What a provider never owns, and where a provider stops, as immutable definitions (ADR-0020). This
 * concern owns the architectural boundaries of providers only; it never defines the governance rules
 * that bound providers (owned by ai/governance/) nor the concerns of the surrounding namespaces (owned
 * by them). The boundaries are architectural; how they are enforced is the runtime's execution, outside
 * this concern.
 */

/**
 * A provider-boundaries principle (ai/providers/provider-boundaries.md, "Principles"). Each
 * instantiates a provider invariant owned by ai/providers/README.md.
 */
export type ProviderBoundariesPrinciple =
  | 'abstracts-not-reason-express-retain-retrieve-execute'
  | 'carries-no-truth'
  | 'produces-no-intelligence'
  | 'stays-within-governance-and-safety';

/** The four provider-boundaries principles, in constitutional order; frozen. */
export const PROVIDER_BOUNDARIES_PRINCIPLES: readonly ProviderBoundariesPrinciple[] = Object.freeze(
  [
    'abstracts-not-reason-express-retain-retrieve-execute',
    'carries-no-truth',
    'produces-no-intelligence',
    'stays-within-governance-and-safety',
  ],
);

/** The statement each provider-boundaries principle makes (ai/providers/provider-boundaries.md). */
export const PROVIDER_BOUNDARIES_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ProviderBoundariesPrinciple, string>
> = Object.freeze({
  'abstracts-not-reason-express-retain-retrieve-execute':
    'A provider presents a source of intelligence and stops there; reasoning, expression, retention, and retrieval belong to other namespaces.',
  'carries-no-truth':
    'A provider carries no business truth and never owns, restates, or becomes it.',
  'produces-no-intelligence':
    "The intelligence a source produces is the source's own, outside this architecture; the abstraction never claims it.",
  'stays-within-governance-and-safety':
    'A provider is selected, routed to, and used only within the rules governance sets and the limits safety allows.',
});

/**
 * An architectural boundary a provider operates within (ai/providers/provider-boundaries.md,
 * "Specification"). A provider operates within exactly these six boundaries; each names a concern owned
 * elsewhere that a provider never crosses.
 */
export type ProviderBoundary =
  'behavior' | 'execution' | 'truth' | 'actor' | 'governance-and-safety' | 'implementation';

/** The six architectural boundaries of a provider, in constitutional order; frozen. */
export const PROVIDER_BOUNDARIES: readonly ProviderBoundary[] = Object.freeze([
  'behavior',
  'execution',
  'truth',
  'actor',
  'governance-and-safety',
  'implementation',
]);

/** What each provider boundary delimits, and its owner (ai/providers/provider-boundaries.md). */
export const PROVIDER_BOUNDARY_DESCRIPTIONS: Readonly<Record<ProviderBoundary, string>> =
  Object.freeze({
    behavior:
      'A provider abstracts a source of intelligence and never reasons, expresses, retains, or retrieves; those are owned by ai/reasoning/, ai/prompts/, ai/memory/, and ai/retrieval/.',
    execution:
      'A provider is invoked and executed by ai/runtime/; it never orchestrates, schedules, executes, networks, or defines a protocol or an interface.',
    truth:
      'A provider carries no business truth and never owns, restates, amends, or becomes it, which is owned by the knowledge repository; the intelligence a source produces is judged by the Evaluation namespace, not claimed here.',
    actor:
      'A provider is composed by an agent as a capability and is never an actor; agents are owned by ai/agents/.',
    'governance-and-safety':
      'A provider is selected and used only within the rules owned by ai/governance/ and the limits owned by ai/safety/, and never defines them.',
    implementation:
      'A provider is an architectural abstraction, never a vendor, a model, a network, a protocol, an interface, a framework, a runtime, or code, and this namespace names none.',
  });

/**
 * A provider-boundaries invariant (ai/providers/provider-boundaries.md, "Invariants"): a guarantee that
 * always holds for the boundaries of providers.
 */
export type ProviderBoundariesInvariant =
  | 'abstracts-never-reasons-expresses-retains-retrieves-executes'
  | 'no-truth-no-intelligence'
  | 'composed-never-actor'
  | 'used-within-governance-and-safety'
  | 'enforcing-a-boundary-is-inert';

/** The five provider-boundaries invariants, in constitutional order; frozen. */
export const PROVIDER_BOUNDARIES_INVARIANTS: readonly ProviderBoundariesInvariant[] = Object.freeze(
  [
    'abstracts-never-reasons-expresses-retains-retrieves-executes',
    'no-truth-no-intelligence',
    'composed-never-actor',
    'used-within-governance-and-safety',
    'enforcing-a-boundary-is-inert',
  ],
);

/** The guarantee each provider-boundaries invariant states (ai/providers/provider-boundaries.md). */
export const PROVIDER_BOUNDARIES_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ProviderBoundariesInvariant, string>
> = Object.freeze({
  'abstracts-never-reasons-expresses-retains-retrieves-executes':
    'A provider abstracts a source of intelligence and never reasons, expresses, retains, retrieves, or executes.',
  'no-truth-no-intelligence':
    'A provider carries no business truth and produces no intelligence of its own.',
  'composed-never-actor': 'A provider is composed as a capability and is never an actor.',
  'used-within-governance-and-safety':
    'A provider is used only within the rules governance sets and the limits safety allows.',
  'enforcing-a-boundary-is-inert':
    'Enforcing a boundary never changes ownership, authority, governance, or business truth.',
});
