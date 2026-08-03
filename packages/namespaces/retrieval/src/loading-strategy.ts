/**
 * Retrieval loading strategy (ai/retrieval/loading-strategy.md, OL-AI-RETRIEVAL-LOADING-STRATEGY).
 *
 * The enduring architectural principles by which retrieval determines the minimum sufficient set of
 * knowledge for a task, applying the knowledge loading strategy, as immutable definitions (ADR-0020).
 * This concern owns the retrieval loading principles only; it never owns the loading tiers or the
 * task-to-knowledge guidance (owned by knowledge/README.md and knowledge/architecture/loading-map.md,
 * which it applies and never redefines) nor loads knowledge (owned by
 * ai/runtime/knowledge-resolution.md). Determining a concrete set is a runtime evaluation this concern
 * does not own; it is deferred to the runtime. This concern states the principles the determination
 * follows and the invariants it always satisfies.
 */

/**
 * A loading-strategy principle (ai/retrieval/loading-strategy.md, "Principles"). Each instantiates a
 * retrieval invariant owned by ai/retrieval/README.md and applies the knowledge loading strategy owned
 * by knowledge/README.md.
 */
export type LoadingStrategyPrinciple =
  | 'minimum-sufficient-knowledge'
  | 'authority-precedence'
  | 'ownership-precision'
  | 'dependency-expansion'
  | 'context-minimization'
  | 'relevance'
  | 'determinism';

/** The seven loading-strategy principles, in constitutional order; frozen. */
export const LOADING_STRATEGY_PRINCIPLES: readonly LoadingStrategyPrinciple[] = Object.freeze([
  'minimum-sufficient-knowledge',
  'authority-precedence',
  'ownership-precision',
  'dependency-expansion',
  'context-minimization',
  'relevance',
  'determinism',
]);

/** The statement each loading-strategy principle makes (ai/retrieval/loading-strategy.md). */
export const LOADING_STRATEGY_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<LoadingStrategyPrinciple, string>
> = Object.freeze({
  'minimum-sufficient-knowledge':
    'Retrieval determines the least knowledge that is sufficient for the task, plus the sources that govern it, and no more; availability is never a reason to load.',
  'authority-precedence':
    'The higher-authority knowledge that governs a task is always included with the lower-authority knowledge it governs, from the top of the Knowledge Hierarchy downward.',
  'ownership-precision':
    'Every piece is drawn from its single canonical owner, so the set contains no duplicate and no restated source.',
  'dependency-expansion':
    'The set includes the declared dependencies of everything in it, so it is complete without being enlarged by anything undeclared.',
  'context-minimization':
    'The determined set is kept as small as sufficiency allows, so an execution is never burdened with knowledge it does not require.',
  relevance:
    'Knowledge is included because the task requires the concern it owns, judged against the task, never by a variable score.',
  determinism:
    "The same task against the same repository state determines the same set, because the strategy is a fixed function of the task and the repository's own metadata, with no randomness and no heuristic ranking.",
});

/**
 * A loading-strategy invariant (ai/retrieval/loading-strategy.md, "Invariants"): a guarantee that always
 * holds for the loading strategy.
 */
export type LoadingStrategyInvariant =
  | 'minimum-sufficient-plus-governing-and-dependencies'
  | 'includes-governing-and-dependencies'
  | 'applies-tiers-never-redefines'
  | 'deterministic'
  | 'applying-is-inert';

/** The five loading-strategy invariants, in constitutional order; frozen. */
export const LOADING_STRATEGY_INVARIANTS: readonly LoadingStrategyInvariant[] = Object.freeze([
  'minimum-sufficient-plus-governing-and-dependencies',
  'includes-governing-and-dependencies',
  'applies-tiers-never-redefines',
  'deterministic',
  'applying-is-inert',
]);

/** The guarantee each loading-strategy invariant states (ai/retrieval/loading-strategy.md). */
export const LOADING_STRATEGY_INVARIANT_DESCRIPTIONS: Readonly<
  Record<LoadingStrategyInvariant, string>
> = Object.freeze({
  'minimum-sufficient-plus-governing-and-dependencies':
    'The determined set is the minimum sufficient set, plus governing and dependency sources, and nothing more.',
  'includes-governing-and-dependencies':
    'The set always includes the higher-authority knowledge that governs it and the declared dependencies of everything in it.',
  'applies-tiers-never-redefines':
    'The strategy applies the knowledge loading tiers and never redefines them.',
  deterministic: 'The strategy is deterministic over the same task and repository state.',
  'applying-is-inert':
    'Applying the strategy never loads knowledge and never changes ownership, authority, governance, or business truth.',
});
