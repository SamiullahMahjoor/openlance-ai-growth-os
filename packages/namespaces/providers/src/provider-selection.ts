/**
 * Provider selection (ai/providers/provider-selection.md, OL-AI-PROVIDERS-PROVIDER-SELECTION).
 *
 * How a provider is chosen for a need, deterministically, as immutable definitions (ADR-0020). This
 * concern owns the selection model only; it never defines the routing of a request (owned by
 * ai/providers/provider-routing.md) nor whether a provider is compatible with the need (owned by
 * ai/providers/provider-compatibility.md). The actual choice - selecting from a candidate set of
 * registered providers for a specific need under governance and safety - is a runtime evaluation over a
 * need and a provider registry that this concern does not own; it is deferred to the runtime, exactly
 * as a governance concern defers its runtime evaluation. This concern states what selection is and the
 * invariants it always satisfies.
 */

/**
 * A provider-selection principle (ai/providers/provider-selection.md, "Principles"). Each instantiates
 * a provider invariant owned by ai/providers/README.md.
 */
export type ProviderSelectionPrinciple =
  'deterministic' | 'chooses-from-compatible' | 'governed-and-bounded' | 'neutral';

/** The four provider-selection principles, in constitutional order; frozen. */
export const PROVIDER_SELECTION_PRINCIPLES: readonly ProviderSelectionPrinciple[] = Object.freeze([
  'deterministic',
  'chooses-from-compatible',
  'governed-and-bounded',
  'neutral',
]);

/** The statement each provider-selection principle makes (ai/providers/provider-selection.md). */
export const PROVIDER_SELECTION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ProviderSelectionPrinciple, string>
> = Object.freeze({
  deterministic:
    'The same need and the same available providers under the same rules yield the same choice, with no randomness.',
  'chooses-from-compatible':
    'A provider is chosen only from those compatible with the need, so an unsuitable provider is never chosen.',
  'governed-and-bounded':
    'A provider is chosen only within the rules governance sets and the limits safety allows, and never one that would exceed them.',
  neutral:
    'A provider is chosen by its declared capabilities and compatibility, not by any vendor or model preference, so the choice stays provider- and model-neutral.',
});

/**
 * A provider-selection invariant (ai/providers/provider-selection.md, "Invariants"): a guarantee that
 * always holds for the selection model.
 */
export type ProviderSelectionInvariant =
  | 'same-inputs-same-choice'
  | 'chosen-from-active-and-compatible'
  | 'permitted-under-governance-and-safety'
  | 'settled-by-defined-tiebreak'
  | 'choosing-is-inert';

/** The five provider-selection invariants, in constitutional order; frozen. */
export const PROVIDER_SELECTION_INVARIANTS: readonly ProviderSelectionInvariant[] = Object.freeze([
  'same-inputs-same-choice',
  'chosen-from-active-and-compatible',
  'permitted-under-governance-and-safety',
  'settled-by-defined-tiebreak',
  'choosing-is-inert',
]);

/** The guarantee each provider-selection invariant states (ai/providers/provider-selection.md). */
export const PROVIDER_SELECTION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ProviderSelectionInvariant, string>
> = Object.freeze({
  'same-inputs-same-choice':
    'The same need and the same available providers under the same rules yield the same choice.',
  'chosen-from-active-and-compatible':
    'A provider is chosen only from those active and compatible with the need.',
  'permitted-under-governance-and-safety':
    'A chosen provider is permitted under governance and usable within safety limits.',
  'settled-by-defined-tiebreak':
    'Selection is settled by a defined tiebreak, so it is never ambiguous or random.',
  'choosing-is-inert':
    'Choosing a provider never executes, routes, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.',
});
