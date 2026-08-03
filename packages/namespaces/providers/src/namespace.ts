/**
 * The Providers namespace, namespace-wide truth (ai/providers/README.md, OL-AI-PROVIDERS-README;
 * ai/providers/providers.md, OL-AI-PROVIDERS-PROVIDERS).
 *
 * The provider invariants every provider concern upholds, and the canonical inventory of the provider
 * concerns, as immutable definitions (ADR-0020). The namespace is a Pure Domain Model of the provider-
 * and model-neutral abstraction: it states what a provider is and how it is chosen, routed to, and
 * evolved, and it never executes a provider, never networks, and never defines a protocol, an
 * interface, or code (ai/providers/README.md). The provider abstraction is deterministic and scalable:
 * the same need, the same registered providers, the same declared capabilities, and the same governing
 * rules yield the same selection, routing, and fallback outcome, and the model holds for one provider
 * or many thousands (ai/providers/providers.md). It is provider-neutral and additively extensible.
 */

/**
 * A provider invariant: a permanent guarantee every provider document upholds and no provider may
 * violate (ai/providers/README.md, "Provider Invariants"). Every provider concern's principles
 * instantiate these.
 */
export type ProviderInvariant =
  | 'abstraction-not-vendor'
  | 'uniquely-identified-and-neutral'
  | 'deterministic-selection-routing-fallback'
  | 'governed-and-bounded'
  | 'bounded-acyclic-fallback-and-routing'
  | 'serves-owns-nothing'
  | 'single-owned-neutral-scalable';

/** The seven provider invariants, in constitutional order; frozen. */
export const PROVIDER_INVARIANTS: readonly ProviderInvariant[] = Object.freeze([
  'abstraction-not-vendor',
  'uniquely-identified-and-neutral',
  'deterministic-selection-routing-fallback',
  'governed-and-bounded',
  'bounded-acyclic-fallback-and-routing',
  'serves-owns-nothing',
  'single-owned-neutral-scalable',
]);

/** The guarantee each provider invariant states (ai/providers/README.md, "Provider Invariants"). */
export const PROVIDER_INVARIANT_DESCRIPTIONS: Readonly<Record<ProviderInvariant, string>> =
  Object.freeze({
    'abstraction-not-vendor':
      'A provider is an architectural abstraction, never a vendor, a model, or an implementation; this namespace names none and defines the abstraction alone.',
    'uniquely-identified-and-neutral':
      'A provider is uniquely identified and presents a neutral abstraction, so the rest of the layer uses intelligence without binding to a vendor or model.',
    'deterministic-selection-routing-fallback':
      'The same need, the same registered providers, and the same governing rules yield the same selection, routing, and fallback outcome, with no randomness.',
    'governed-and-bounded':
      'A provider is selected and used only within the rules governance sets and the limits safety allows, and never beyond them.',
    'bounded-acyclic-fallback-and-routing':
      'Provider fallback and routing are bounded and acyclic; no infinite fallback and no routing cycle are possible.',
    'serves-owns-nothing':
      "A provider serves and owns none of the behavior it serves; reasoning, prompts, memory, retrieval, execution, and truth are owned by their namespaces, and the intelligence a provider produces is the source's own.",
    'single-owned-neutral-scalable':
      'A provider is single-owned, technology-neutral, and scalable; each provider concern has exactly one owning document, and the abstraction holds for one provider or many thousands.',
  });

/**
 * A provider concern: one aspect of the provider abstraction, each owned by exactly one document
 * (ai/providers/providers.md, "The Provider Concerns"). This is the namespace inventory identity; the
 * model of each concern is owned by its named document and this package's corresponding module.
 */
export type ProviderConcern =
  | 'provider-architecture'
  | 'provider-lifecycle'
  | 'provider-capabilities'
  | 'provider-abstraction'
  | 'provider-selection'
  | 'provider-routing'
  | 'provider-fallback'
  | 'provider-compatibility'
  | 'provider-boundaries'
  | 'provider-versioning';

/** The ten provider concerns, in inventory order; frozen. */
export const PROVIDER_CONCERNS: readonly ProviderConcern[] = Object.freeze([
  'provider-architecture',
  'provider-lifecycle',
  'provider-capabilities',
  'provider-abstraction',
  'provider-selection',
  'provider-routing',
  'provider-fallback',
  'provider-compatibility',
  'provider-boundaries',
  'provider-versioning',
]);

/** What each provider concern owns (ai/providers/providers.md, "The Provider Concerns"). */
export const PROVIDER_CONCERN_DESCRIPTIONS: Readonly<Record<ProviderConcern, string>> =
  Object.freeze({
    'provider-architecture':
      'The architectural definition of a provider: its identity and the parts it is composed of.',
    'provider-lifecycle':
      'The phases of a provider, including registration, activation, operation, and retirement, and provider discovery.',
    'provider-capabilities':
      "The capability model: how a provider's abilities are described, and capability declaration.",
    'provider-abstraction':
      'The provider- and model-neutral abstraction: how a provider is presented uniformly so the layer uses intelligence without binding to a vendor or model.',
    'provider-selection':
      'The selection model: how a provider is chosen for a need, deterministically.',
    'provider-routing':
      'The routing model: how a request is directed to a selected provider, the routing topology, and provider limits.',
    'provider-fallback':
      'The fallback model: how the layer falls back to an alternate provider, through a bounded, acyclic fallback chain.',
    'provider-compatibility':
      'The compatibility model: whether a provider is compatible with a need, and whether a provider version is compatible with a consumer.',
    'provider-boundaries': 'What providers never own, and where a provider stops.',
    'provider-versioning':
      'Provider versioning, evolution, migration, deprecation, and change governance consumption.',
  });
