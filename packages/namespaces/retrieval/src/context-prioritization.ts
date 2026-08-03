/**
 * Context prioritization (ai/retrieval/context-prioritization.md, OL-AI-RETRIEVAL-CONTEXT-PRIORITIZATION).
 *
 * How the knowledge in the dependency-complete set is prioritized and ordered, by authority and by
 * relevance, within the loading tiers, as immutable definitions (ADR-0020). This concern owns
 * prioritization only; it never owns the loading tiers (Critical, Required, Optional, Contextual, owned
 * by knowledge/README.md and referenced, never redefined) nor orders the runtime load (owned by
 * ai/runtime/knowledge-resolution.md). Ordering a concrete set is a runtime evaluation this concern does
 * not own; it is deferred to the runtime. This concern states what prioritization is and the invariants
 * it always satisfies.
 */

/**
 * A context-prioritization principle (ai/retrieval/context-prioritization.md, "Principles"). Each
 * instantiates a retrieval invariant owned by ai/retrieval/README.md.
 */
export type ContextPrioritizationPrinciple =
  | 'authority-orders-first'
  | 'loading-tiers-frame-priority'
  | 'relevance-orders-within-a-level'
  | 'deterministic';

/** The four context-prioritization principles, in constitutional order; frozen. */
export const CONTEXT_PRIORITIZATION_PRINCIPLES: readonly ContextPrioritizationPrinciple[] =
  Object.freeze([
    'authority-orders-first',
    'loading-tiers-frame-priority',
    'relevance-orders-within-a-level',
    'deterministic',
  ]);

/** The statement each context-prioritization principle makes (ai/retrieval/context-prioritization.md). */
export const CONTEXT_PRIORITIZATION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ContextPrioritizationPrinciple, string>
> = Object.freeze({
  'authority-orders-first':
    'Higher-authority knowledge is prioritized above the lower-authority knowledge it governs, so a governing source is never placed below what it governs.',
  'loading-tiers-frame-priority':
    'The tiers owned by knowledge/README.md, Critical, Required, Optional, and Contextual, frame the priority, and prioritization applies them and never redefines them.',
  'relevance-orders-within-a-level':
    'Among knowledge of the same authority and tier, the knowledge most relevant to the task is prioritized higher.',
  deterministic:
    'The same set for the same task and repository state is ordered identically, by defined criteria, with no heuristic scoring.',
});

/**
 * A context-prioritization invariant (ai/retrieval/context-prioritization.md, "Invariants"): a guarantee
 * that always holds for prioritization.
 */
export type ContextPrioritizationInvariant =
  | 'higher-authority-ordered-above'
  | 'applies-tiers-never-redefines'
  | 'deterministic-over-set'
  | 'orders-only-is-inert';

/** The four context-prioritization invariants, in constitutional order; frozen. */
export const CONTEXT_PRIORITIZATION_INVARIANTS: readonly ContextPrioritizationInvariant[] =
  Object.freeze([
    'higher-authority-ordered-above',
    'applies-tiers-never-redefines',
    'deterministic-over-set',
    'orders-only-is-inert',
  ]);

/** The guarantee each context-prioritization invariant states (ai/retrieval/context-prioritization.md). */
export const CONTEXT_PRIORITIZATION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ContextPrioritizationInvariant, string>
> = Object.freeze({
  'higher-authority-ordered-above':
    'Higher-authority knowledge is ordered above the lower-authority knowledge it governs.',
  'applies-tiers-never-redefines':
    'Prioritization applies the loading tiers owned by the knowledge repository and never redefines them.',
  'deterministic-over-set':
    'Prioritization is deterministic over the same set, task, and repository state.',
  'orders-only-is-inert':
    'Prioritization orders the set only; it never adds, removes, loads, or alters knowledge, and never changes ownership, authority, governance, or business truth.',
});
