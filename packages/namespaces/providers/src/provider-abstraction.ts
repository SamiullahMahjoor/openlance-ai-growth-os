/**
 * Provider abstraction (ai/providers/provider-abstraction.md, OL-AI-PROVIDERS-PROVIDER-ABSTRACTION).
 *
 * How a provider is presented uniformly and neutrally, as immutable definitions (ADR-0020). This
 * concern owns the abstraction only; it never defines the intelligence a source produces (the source's
 * own) nor the runtime that invokes a provider (owned by ai/runtime/). The abstraction names no vendor,
 * model, or technology, so this concern defines no enumeration of them.
 */

/**
 * A provider-abstraction principle (ai/providers/provider-abstraction.md, "Principles"). Each
 * instantiates a provider invariant owned by ai/providers/README.md.
 */
export type ProviderAbstractionPrinciple =
  'uniform' | 'neutral' | 'endures-while-providers-are-transient' | 'carries-no-intelligence';

/** The four provider-abstraction principles, in constitutional order; frozen. */
export const PROVIDER_ABSTRACTION_PRINCIPLES: readonly ProviderAbstractionPrinciple[] =
  Object.freeze([
    'uniform',
    'neutral',
    'endures-while-providers-are-transient',
    'carries-no-intelligence',
  ]);

/** The statement each provider-abstraction principle makes (ai/providers/provider-abstraction.md). */
export const PROVIDER_ABSTRACTION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ProviderAbstractionPrinciple, string>
> = Object.freeze({
  uniform:
    'Every provider is presented the same way, so the layer uses any provider through one neutral abstraction.',
  neutral:
    'The abstraction ties nothing to a vendor, model, or technology, so the layer stays provider- and model-neutral.',
  'endures-while-providers-are-transient':
    'The abstraction is durable and shared; the providers and models behind it are replaceable without changing the layer.',
  'carries-no-intelligence':
    "The abstraction presents a source of intelligence; the intelligence produced is the source's own.",
});

/**
 * A provider-abstraction invariant (ai/providers/provider-abstraction.md, "Invariants"): a guarantee
 * that always holds for the provider abstraction.
 */
export type ProviderAbstractionInvariant =
  | 'one-uniform-neutral-abstraction'
  | 'names-no-vendor-model-technology'
  | 'source-change-changes-nothing'
  | 'no-intelligence-of-its-own'
  | 'presenting-is-inert';

/** The five provider-abstraction invariants, in constitutional order; frozen. */
export const PROVIDER_ABSTRACTION_INVARIANTS: readonly ProviderAbstractionInvariant[] =
  Object.freeze([
    'one-uniform-neutral-abstraction',
    'names-no-vendor-model-technology',
    'source-change-changes-nothing',
    'no-intelligence-of-its-own',
    'presenting-is-inert',
  ]);

/** The guarantee each provider-abstraction invariant states (ai/providers/provider-abstraction.md). */
export const PROVIDER_ABSTRACTION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ProviderAbstractionInvariant, string>
> = Object.freeze({
  'one-uniform-neutral-abstraction':
    'Every provider is presented through one uniform, provider- and model-neutral abstraction.',
  'names-no-vendor-model-technology':
    'The abstraction names no vendor, model, or technology, so the layer stays neutral.',
  'source-change-changes-nothing':
    'Adding, replacing, or retiring a source changes no behavior of the layer.',
  'no-intelligence-of-its-own':
    "The abstraction carries no intelligence of its own; the intelligence is the source's own.",
  'presenting-is-inert':
    'Presenting a provider never executes, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.',
});
