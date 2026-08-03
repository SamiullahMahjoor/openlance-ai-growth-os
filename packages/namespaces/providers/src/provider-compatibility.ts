/**
 * Provider compatibility (ai/providers/provider-compatibility.md, OL-AI-PROVIDERS-PROVIDER-COMPATIBILITY).
 *
 * What it means for a provider to be compatible - with a need, or a version with a consumer - as
 * immutable definitions (ADR-0020). This concern owns the compatibility relation only; it never defines
 * the evolution and version rules (owned by ai/providers/provider-versioning.md) nor the declaration of
 * capabilities (owned by ai/providers/provider-capabilities.md). Judging a concrete provider or version
 * against a concrete need or consumer is a runtime evaluation over a need and requirements this concern
 * does not own; it is deferred to the runtime. This concern states the two kinds of compatibility and
 * the invariants the relation always satisfies.
 */

/**
 * A provider-compatibility principle (ai/providers/provider-compatibility.md, "Principles"). Each
 * instantiates a provider invariant owned by ai/providers/README.md.
 */
export type ProviderCompatibilityPrinciple =
  'defined-relation' | 'rests-on-declared-capabilities' | 'neutral' | 'incompatibility-explicit';

/** The four provider-compatibility principles, in constitutional order; frozen. */
export const PROVIDER_COMPATIBILITY_PRINCIPLES: readonly ProviderCompatibilityPrinciple[] =
  Object.freeze([
    'defined-relation',
    'rests-on-declared-capabilities',
    'neutral',
    'incompatibility-explicit',
  ]);

/** The statement each provider-compatibility principle makes (ai/providers/provider-compatibility.md). */
export const PROVIDER_COMPATIBILITY_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ProviderCompatibilityPrinciple, string>
> = Object.freeze({
  'defined-relation':
    'A provider is compatible with a need, or a version with a consumer, by a defined relation, never by assumption.',
  'rests-on-declared-capabilities':
    "A provider is compatible with a need when its declared capabilities satisfy the need's requirements.",
  neutral:
    'Compatibility is judged in provider- and model-neutral terms, so any compatible provider is interchangeable with another for the need.',
  'incompatibility-explicit':
    'An incompatible provider or version is identified as such, so an unsuitable provider is never used and a broken version is never assumed compatible.',
});

/**
 * A kind of compatibility (ai/providers/provider-compatibility.md, "Specification"). Compatibility is
 * one of exactly these two relations.
 */
export type CompatibilityKind = 'capability' | 'version';

/** The two kinds of provider compatibility, in constitutional order; frozen. */
export const COMPATIBILITY_KINDS: readonly CompatibilityKind[] = Object.freeze([
  'capability',
  'version',
]);

/** What each kind of compatibility relates (ai/providers/provider-compatibility.md). */
export const COMPATIBILITY_KIND_DESCRIPTIONS: Readonly<Record<CompatibilityKind, string>> =
  Object.freeze({
    capability:
      "Whether a provider's declared capabilities, owned by ai/providers/provider-capabilities.md, satisfy a need's requirements.",
    version:
      "Whether a provider version is compatible with a consumer, that is, whether the consumer's requirements still hold against that version.",
  });

/**
 * A provider-compatibility invariant (ai/providers/provider-compatibility.md, "Invariants"): a
 * guarantee that always holds for the compatibility model.
 */
export type ProviderCompatibilityInvariant =
  | 'capability-compatible-when-satisfies-need'
  | 'version-compatible-when-requirements-hold'
  | 'compatible-are-interchangeable'
  | 'incompatible-identified-not-used'
  | 'determining-is-inert';

/** The five provider-compatibility invariants, in constitutional order; frozen. */
export const PROVIDER_COMPATIBILITY_INVARIANTS: readonly ProviderCompatibilityInvariant[] =
  Object.freeze([
    'capability-compatible-when-satisfies-need',
    'version-compatible-when-requirements-hold',
    'compatible-are-interchangeable',
    'incompatible-identified-not-used',
    'determining-is-inert',
  ]);

/** The guarantee each provider-compatibility invariant states (ai/providers/provider-compatibility.md). */
export const PROVIDER_COMPATIBILITY_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ProviderCompatibilityInvariant, string>
> = Object.freeze({
  'capability-compatible-when-satisfies-need':
    "A provider is compatible with a need only when its declared capabilities satisfy the need's requirements.",
  'version-compatible-when-requirements-hold':
    "A version is compatible with a consumer only when the consumer's requirements still hold against it.",
  'compatible-are-interchangeable':
    'Providers compatible with the same need are interchangeable for it.',
  'incompatible-identified-not-used':
    'An incompatible provider or version is identified as such and never used as if compatible.',
  'determining-is-inert':
    'Determining compatibility never executes, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.',
});
