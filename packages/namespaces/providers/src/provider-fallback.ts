/**
 * Provider fallback (ai/providers/provider-fallback.md, OL-AI-PROVIDERS-PROVIDER-FALLBACK).
 *
 * How the layer falls back to an alternate provider through a bounded, acyclic chain, as immutable
 * definitions (ADR-0020). This concern owns the fallback model only; it never defines the selection
 * criteria a fallback reapplies (owned by ai/providers/provider-selection.md) nor the safe degradation
 * of the AI when no provider can serve (owned by ai/safety/safe-degradation.md). Walking a concrete
 * fallback chain over registered providers is a runtime evaluation this concern does not own; it is
 * deferred to the runtime. This concern states what fallback is and the invariants it always satisfies,
 * including that the chain is finite and acyclic and terminates safely.
 */

/**
 * A provider-fallback principle (ai/providers/provider-fallback.md, "Principles"). Each instantiates a
 * provider invariant owned by ai/providers/README.md.
 */
export type ProviderFallbackPrinciple =
  | 'recovers-never-lowers-protection'
  | 'bounded-and-acyclic'
  | 'reapplies-selection-rules'
  | 'terminates-safely';

/** The four provider-fallback principles, in constitutional order; frozen. */
export const PROVIDER_FALLBACK_PRINCIPLES: readonly ProviderFallbackPrinciple[] = Object.freeze([
  'recovers-never-lowers-protection',
  'bounded-and-acyclic',
  'reapplies-selection-rules',
  'terminates-safely',
]);

/** The statement each provider-fallback principle makes (ai/providers/provider-fallback.md). */
export const PROVIDER_FALLBACK_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ProviderFallbackPrinciple, string>
> = Object.freeze({
  'recovers-never-lowers-protection':
    'Fallback finds an alternate provider for a request, and never one that governance or safety would not allow.',
  'bounded-and-acyclic':
    'Fallback follows a finite, acyclic chain of alternates, so no infinite fallback and no fallback cycle are possible.',
  'reapplies-selection-rules':
    'An alternate is chosen by the same selection and compatibility rules as the original, so a fallback provider is always compatible and governed.',
  'terminates-safely':
    'When no alternate can serve a request, the layer stops falling back and hands the matter to safe degradation, never looping.',
});

/**
 * A provider-fallback invariant (ai/providers/provider-fallback.md, "Invariants"): a guarantee that
 * always holds for the fallback model.
 */
export type ProviderFallbackInvariant =
  | 'alternate-only-compatible-governed-safe'
  | 'chain-finite-and-acyclic'
  | 'no-provider-tried-twice'
  | 'exhaustion-hands-to-safe-degradation'
  | 'falling-back-is-inert';

/** The five provider-fallback invariants, in constitutional order; frozen. */
export const PROVIDER_FALLBACK_INVARIANTS: readonly ProviderFallbackInvariant[] = Object.freeze([
  'alternate-only-compatible-governed-safe',
  'chain-finite-and-acyclic',
  'no-provider-tried-twice',
  'exhaustion-hands-to-safe-degradation',
  'falling-back-is-inert',
]);

/** The guarantee each provider-fallback invariant states (ai/providers/provider-fallback.md). */
export const PROVIDER_FALLBACK_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ProviderFallbackInvariant, string>
> = Object.freeze({
  'alternate-only-compatible-governed-safe':
    'Fallback chooses an alternate only from compatible, governed, safe providers.',
  'chain-finite-and-acyclic':
    'The fallback chain is finite and acyclic, so infinite fallback and fallback cycles are impossible.',
  'no-provider-tried-twice': 'A provider already tried in a chain is not tried again in it.',
  'exhaustion-hands-to-safe-degradation':
    'When no alternate can serve, the layer hands the matter to safe degradation rather than looping.',
  'falling-back-is-inert':
    'Falling back never executes, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.',
});
