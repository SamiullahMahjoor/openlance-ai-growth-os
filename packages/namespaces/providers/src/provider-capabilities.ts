/**
 * Provider capabilities (ai/providers/provider-capabilities.md, OL-AI-PROVIDERS-PROVIDER-CAPABILITIES).
 *
 * How a provider's abilities are described, as immutable definitions (ADR-0020). This concern owns the
 * provider capability model only; it never defines whether a capability matches a need (owned by
 * ai/providers/provider-compatibility.md) nor the agent capability that composes a provider (owned by
 * ai/agents/agent-capabilities.md). A capability names an ability of the abstraction and never the
 * intelligence a source produces; the set of capabilities is open and names no vendor or model, so this
 * concern defines no capability enumeration.
 */

/**
 * A provider-capabilities principle (ai/providers/provider-capabilities.md, "Principles"). Each
 * instantiates a provider invariant owned by ai/providers/README.md.
 */
export type ProviderCapabilitiesPrinciple =
  'declared-ability' | 'describes-not-performs' | 'neutral' | 'bounded';

/** The four provider-capabilities principles, in constitutional order; frozen. */
export const PROVIDER_CAPABILITIES_PRINCIPLES: readonly ProviderCapabilitiesPrinciple[] =
  Object.freeze(['declared-ability', 'describes-not-performs', 'neutral', 'bounded']);

/** The statement each provider-capabilities principle makes (ai/providers/provider-capabilities.md). */
export const PROVIDER_CAPABILITIES_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ProviderCapabilitiesPrinciple, string>
> = Object.freeze({
  'declared-ability':
    'A provider declares what it can do, so its abilities are explicit and never assumed.',
  'describes-not-performs':
    "A capability names an ability of the abstraction; the intelligence that carries it out is the source's own.",
  neutral:
    'A capability is described in provider- and model-neutral terms, so it is comparable across providers without binding to a vendor or model.',
  bounded:
    'A provider offers only its declared capabilities, and it is never selected for an ability it does not declare.',
});

/**
 * A provider-capabilities invariant (ai/providers/provider-capabilities.md, "Invariants"): a guarantee
 * that always holds for the provider capability model.
 */
export type ProviderCapabilitiesInvariant =
  | 'offers-only-declared'
  | 'names-ability-not-intelligence'
  | 'neutral-description'
  | 'same-provider-same-capabilities'
  | 'describing-is-inert';

/** The five provider-capabilities invariants, in constitutional order; frozen. */
export const PROVIDER_CAPABILITIES_INVARIANTS: readonly ProviderCapabilitiesInvariant[] =
  Object.freeze([
    'offers-only-declared',
    'names-ability-not-intelligence',
    'neutral-description',
    'same-provider-same-capabilities',
    'describing-is-inert',
  ]);

/** The guarantee each provider-capabilities invariant states (ai/providers/provider-capabilities.md). */
export const PROVIDER_CAPABILITIES_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ProviderCapabilitiesInvariant, string>
> = Object.freeze({
  'offers-only-declared':
    'A provider offers only its declared capabilities, and is never selected for an undeclared one.',
  'names-ability-not-intelligence':
    'A capability names an ability of the abstraction and never defines the intelligence a source produces.',
  'neutral-description': 'Capabilities are described in provider- and model-neutral terms.',
  'same-provider-same-capabilities':
    'The same provider declares the same capabilities, with no randomness.',
  'describing-is-inert':
    'Describing capabilities never executes, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.',
});
