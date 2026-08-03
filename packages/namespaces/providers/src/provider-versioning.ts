/**
 * Provider versioning (ai/providers/provider-versioning.md, OL-AI-PROVIDERS-PROVIDER-VERSIONING).
 *
 * How a provider definition is versioned, evolves, migrates, and is deprecated, as immutable
 * definitions (ADR-0020). This concern owns provider versioning only; it never defines the
 * compatibility a version preserves (owned by ai/providers/provider-compatibility.md) nor the document
 * amendment workflow (owned by ai/CONTRIBUTING.md). Provider evolution is governed by the change rules
 * owned by ai/governance/change-governance.md, which this concern references and never restates
 * (referenced-model non-restatement). This concern states the four aspects of versioning and the
 * invariants it always satisfies.
 */

/**
 * A provider-versioning principle (ai/providers/provider-versioning.md, "Principles"). Each
 * instantiates a provider invariant owned by ai/providers/README.md.
 */
export type ProviderVersioningPrinciple =
  | 'definition-is-versioned'
  | 'change-is-governed'
  | 'compatibility-preserved-or-migrated'
  | 'churn-absorbed-here';

/** The four provider-versioning principles, in constitutional order; frozen. */
export const PROVIDER_VERSIONING_PRINCIPLES: readonly ProviderVersioningPrinciple[] = Object.freeze(
  [
    'definition-is-versioned',
    'change-is-governed',
    'compatibility-preserved-or-migrated',
    'churn-absorbed-here',
  ],
);

/** The statement each provider-versioning principle makes (ai/providers/provider-versioning.md). */
export const PROVIDER_VERSIONING_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ProviderVersioningPrinciple, string>
> = Object.freeze({
  'definition-is-versioned':
    'A provider, its capabilities, and its abstraction carry a version, so a change is identified and traceable.',
  'change-is-governed':
    'A provider definition evolves only under the change rules owned by ai/governance/, never arbitrarily.',
  'compatibility-preserved-or-migrated':
    'A change that preserves compatibility is absorbed; a change that breaks it is versioned and migrated, so no consumer is silently broken.',
  'churn-absorbed-here':
    'Provider and model change is absorbed by this abstraction, so no foundational document is amended by operational churn.',
});

/**
 * An aspect of provider versioning (ai/providers/provider-versioning.md, "Specification"). Versioning
 * is composed of exactly these four aspects.
 */
export type ProviderVersioningAspect = 'version-rules' | 'evolution' | 'migration' | 'deprecation';

/** The four aspects of provider versioning, in constitutional order; frozen. */
export const PROVIDER_VERSIONING_ASPECTS: readonly ProviderVersioningAspect[] = Object.freeze([
  'version-rules',
  'evolution',
  'migration',
  'deprecation',
]);

/** What each aspect of provider versioning covers (ai/providers/provider-versioning.md). */
export const PROVIDER_VERSIONING_ASPECT_DESCRIPTIONS: Readonly<
  Record<ProviderVersioningAspect, string>
> = Object.freeze({
  'version-rules':
    'A provider definition, a capability declaration, or an abstraction carries a version that identifies it, so a change is explicit and traceable.',
  evolution:
    'A provider definition evolves by governed change under ai/governance/change-governance.md, additively where possible, so the model grows and new providers and models are absorbed without redesign.',
  migration:
    'A change that breaks compatibility is issued as a new version and migrated deliberately, so there is never a window in which a consumer relies on an incompatible provider.',
  deprecation:
    'A superseded provider definition or version is deprecated rather than abruptly removed, and continues to serve compatible consumers until each is migrated, after which the provider is retired under ai/providers/provider-lifecycle.md.',
});

/**
 * A provider-versioning invariant (ai/providers/provider-versioning.md, "Invariants"): a guarantee that
 * always holds for provider versioning.
 */
export type ProviderVersioningInvariant =
  | 'carries-a-version'
  | 'evolves-only-under-governed-change'
  | 'breaking-change-versioned-and-migrated'
  | 'deprecated-serves-until-migrated'
  | 'versioning-is-inert';

/** The five provider-versioning invariants, in constitutional order; frozen. */
export const PROVIDER_VERSIONING_INVARIANTS: readonly ProviderVersioningInvariant[] = Object.freeze(
  [
    'carries-a-version',
    'evolves-only-under-governed-change',
    'breaking-change-versioned-and-migrated',
    'deprecated-serves-until-migrated',
    'versioning-is-inert',
  ],
);

/** The guarantee each provider-versioning invariant states (ai/providers/provider-versioning.md). */
export const PROVIDER_VERSIONING_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ProviderVersioningInvariant, string>
> = Object.freeze({
  'carries-a-version':
    'A provider definition carries a version, so a change to it is explicit and traceable.',
  'evolves-only-under-governed-change':
    'A provider definition evolves only under the governed change rules.',
  'breaking-change-versioned-and-migrated':
    'A change that breaks compatibility is versioned and migrated, never applied silently.',
  'deprecated-serves-until-migrated':
    'A deprecated provider continues to serve compatible consumers until each is migrated.',
  'versioning-is-inert':
    'Versioning a provider never executes, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.',
});
