/**
 * Provider lifecycle (ai/providers/provider-lifecycle.md, OL-AI-PROVIDERS-PROVIDER-LIFECYCLE).
 *
 * The ordered phases a provider passes through, and the two pure predicates the constitutional
 * ordering supports, as an immutable domain model (ADR-0020). This concern owns the provider lifecycle
 * only; it never defines the selection of a provider (owned by ai/providers/provider-selection.md) nor
 * the versioning of a provider definition (owned by ai/providers/provider-versioning.md). A lifecycle
 * transition never executes or persists; the invocation of an operating provider is owned by
 * ai/runtime/.
 */

/**
 * A provider-lifecycle principle (ai/providers/provider-lifecycle.md, "Principles"). Each instantiates
 * a provider invariant owned by ai/providers/README.md.
 */
export type ProviderLifecyclePrinciple =
  | 'defined-beginning-and-end'
  | 'registration-precedes-availability'
  | 'discovery-follows-registration'
  | 'retirement-is-clean';

/** The four provider-lifecycle principles, in constitutional order; frozen. */
export const PROVIDER_LIFECYCLE_PRINCIPLES: readonly ProviderLifecyclePrinciple[] = Object.freeze([
  'defined-beginning-and-end',
  'registration-precedes-availability',
  'discovery-follows-registration',
  'retirement-is-clean',
]);

/** The statement each provider-lifecycle principle makes (ai/providers/provider-lifecycle.md). */
export const PROVIDER_LIFECYCLE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ProviderLifecyclePrinciple, string>
> = Object.freeze({
  'defined-beginning-and-end':
    'A provider begins when it is registered and ends when it is retired; it is never used before activation or after retirement.',
  'registration-precedes-availability':
    'A provider exists and is discoverable before it is available to be selected.',
  'discovery-follows-registration':
    'A registered provider is discoverable by its identity and declared capabilities; an unregistered provider is not.',
  'retirement-is-clean':
    'A retired provider is no longer selected or routed to, and its retirement never disrupts a provider that remains.',
});

/**
 * A phase of a provider (ai/providers/provider-lifecycle.md, "Specification"). A provider passes
 * through these ordered phases, and each phase precedes the next. A provider is never used outside
 * Activation and Operation.
 */
export type ProviderLifecyclePhase =
  'registration' | 'discovery' | 'activation' | 'operation' | 'retirement';

/** The five provider lifecycle phases, in constitutional order; frozen. Each phase precedes the next. */
export const PROVIDER_LIFECYCLE_PHASES: readonly ProviderLifecyclePhase[] = Object.freeze([
  'registration',
  'discovery',
  'activation',
  'operation',
  'retirement',
]);

/** What happens in each provider lifecycle phase (ai/providers/provider-lifecycle.md). */
export const PROVIDER_LIFECYCLE_PHASE_DESCRIPTIONS: Readonly<
  Record<ProviderLifecyclePhase, string>
> = Object.freeze({
  registration:
    'A provider is registered with its distinct identity and declared capabilities, so it exists as an abstraction and is discoverable; registration records that the provider exists and never activates or uses it.',
  discovery:
    'A registered provider is discoverable by its identity and declared capabilities, so selection can find it; discovery finds a registered provider and never chooses one.',
  activation:
    'A registered provider is activated, becoming available to be selected and routed to; a provider is used only while active, and activation never widens its declared capabilities.',
  operation:
    'An active provider is available for selection, routing, and use, invoked by ai/runtime/; this concern owns that the provider is in operation, and the invocation and the intelligence produced are owned elsewhere.',
  retirement:
    'A provider is deactivated, is no longer selected or routed to, and is superseded or removed; retirement is orderly and never disrupts a provider that remains, and a request that would have used it is handled by ai/providers/provider-fallback.md.',
});

const LIFECYCLE_RANK: Readonly<Record<ProviderLifecyclePhase, number>> = {
  registration: 0,
  discovery: 1,
  activation: 2,
  operation: 3,
  retirement: 4,
};

/**
 * Whether phase `a` is at or after phase `b` in the provider lifecycle, by the constitutional ordering
 * in which each phase precedes the next (ai/providers/provider-lifecycle.md, "Specification").
 */
export const phaseAtOrAfter = (a: ProviderLifecyclePhase, b: ProviderLifecyclePhase): boolean =>
  LIFECYCLE_RANK[a] >= LIFECYCLE_RANK[b];

/**
 * Whether a provider may be used in the given phase. A provider is used only in Activation and
 * Operation, and never outside them (ai/providers/provider-lifecycle.md, "Specification" and
 * "Invariants").
 */
export const usableInPhase = (phase: ProviderLifecyclePhase): boolean =>
  phase === 'activation' || phase === 'operation';

/**
 * A provider-lifecycle invariant (ai/providers/provider-lifecycle.md, "Invariants"): a guarantee that
 * always holds for the provider lifecycle.
 */
export type ProviderLifecycleInvariant =
  | 'registered-then-discoverable-then-active'
  | 'used-only-while-active'
  | 'retired-not-selected-or-routed'
  | 'retirement-is-orderly'
  | 'transition-is-inert';

/** The five provider-lifecycle invariants, in constitutional order; frozen. */
export const PROVIDER_LIFECYCLE_INVARIANTS: readonly ProviderLifecycleInvariant[] = Object.freeze([
  'registered-then-discoverable-then-active',
  'used-only-while-active',
  'retired-not-selected-or-routed',
  'retirement-is-orderly',
  'transition-is-inert',
]);

/** The guarantee each provider-lifecycle invariant states (ai/providers/provider-lifecycle.md). */
export const PROVIDER_LIFECYCLE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ProviderLifecycleInvariant, string>
> = Object.freeze({
  'registered-then-discoverable-then-active':
    'A provider is registered before it is discoverable, and discoverable before it is activated.',
  'used-only-while-active':
    'A provider is used only while active, and activation never widens its declared capabilities.',
  'retired-not-selected-or-routed': 'A retired provider is no longer selected or routed to.',
  'retirement-is-orderly':
    "A provider's retirement is orderly and never disrupts a provider that remains.",
  'transition-is-inert':
    'A lifecycle transition never executes, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.',
});
