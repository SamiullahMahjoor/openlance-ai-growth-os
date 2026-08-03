/**
 * Provider architecture (ai/providers/provider-architecture.md, OL-AI-PROVIDERS-PROVIDER-ARCHITECTURE).
 *
 * What a provider is structurally - its identity and the parts it is composed of - as immutable
 * definitions (ADR-0020). This concern owns the provider structural model only; it never defines the
 * lifecycle of a provider (owned by ai/providers/provider-lifecycle.md) nor the abstraction it presents
 * (owned by ai/providers/provider-abstraction.md), and it names no vendor, model, or implementation.
 */

/**
 * A provider-architecture principle (ai/providers/provider-architecture.md, "Principles"). Each
 * instantiates a provider invariant owned by ai/providers/README.md.
 */
export type ProviderArchitecturePrinciple =
  | 'abstraction-not-vendor'
  | 'distinct-identity'
  | 'composed-of-defined-parts'
  | 'deterministic-structure';

/** The four provider-architecture principles, in constitutional order; frozen. */
export const PROVIDER_ARCHITECTURE_PRINCIPLES: readonly ProviderArchitecturePrinciple[] =
  Object.freeze([
    'abstraction-not-vendor',
    'distinct-identity',
    'composed-of-defined-parts',
    'deterministic-structure',
  ]);

/** The statement each provider-architecture principle makes (ai/providers/provider-architecture.md). */
export const PROVIDER_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ProviderArchitecturePrinciple, string>
> = Object.freeze({
  'abstraction-not-vendor':
    'A provider is the architectural stand-in for a source of intelligence; it is never a named vendor, model, or implementation.',
  'distinct-identity':
    'Every provider is uniquely identified, so it can be registered, described, selected, and routed to as one provider.',
  'composed-of-defined-parts':
    'A provider is composed of its identity, its declared capabilities, and the abstraction it presents, each owned by its named document.',
  'deterministic-structure':
    'The same provider definition resolves to the same identity and parts, with no randomness.',
});

/**
 * A structural part a provider is composed of (ai/providers/provider-architecture.md,
 * "Specification"). A provider is composed of exactly these three parts; each part's model is owned by
 * its named document, and this concern owns that a provider is composed of them.
 */
export type ProviderPart = 'identity' | 'capabilities' | 'abstraction';

/** The three parts a provider is composed of, in constitutional order; frozen. */
export const PROVIDER_PARTS: readonly ProviderPart[] = Object.freeze([
  'identity',
  'capabilities',
  'abstraction',
]);

/** What each provider part is, and its owner (ai/providers/provider-architecture.md). */
export const PROVIDER_PART_DESCRIPTIONS: Readonly<Record<ProviderPart, string>> = Object.freeze({
  identity:
    'A distinct, stable identity that uniquely identifies a provider as an abstraction over a source of intelligence, owned by this concern (ai/providers/provider-architecture.md).',
  capabilities:
    'The abilities a provider declares, owned by ai/providers/provider-capabilities.md.',
  abstraction:
    'The neutral abstraction a provider presents, owned by ai/providers/provider-abstraction.md.',
});

/**
 * A provider-architecture invariant (ai/providers/provider-architecture.md, "Invariants"): a guarantee
 * that always holds for the provider structural model.
 */
export type ProviderArchitectureInvariant =
  | 'distinct-stable-identity'
  | 'composed-of-parts'
  | 'stands-for-source-not-output'
  | 'same-definition-same-structure'
  | 'structural-definition-is-inert';

/** The five provider-architecture invariants, in constitutional order; frozen. */
export const PROVIDER_ARCHITECTURE_INVARIANTS: readonly ProviderArchitectureInvariant[] =
  Object.freeze([
    'distinct-stable-identity',
    'composed-of-parts',
    'stands-for-source-not-output',
    'same-definition-same-structure',
    'structural-definition-is-inert',
  ]);

/** The guarantee each provider-architecture invariant states (ai/providers/provider-architecture.md). */
export const PROVIDER_ARCHITECTURE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ProviderArchitectureInvariant, string>
> = Object.freeze({
  'distinct-stable-identity':
    'Every provider has a distinct, stable identity that is never shared.',
  'composed-of-parts':
    'A provider is composed of its identity, capabilities, and abstraction, each owned by its named document.',
  'stands-for-source-not-output':
    'A provider stands for a source of intelligence and is never the source or its output.',
  'same-definition-same-structure':
    'The same provider definition resolves to the same structure, with no randomness.',
  'structural-definition-is-inert':
    "Defining a provider's structure never executes, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.",
});
