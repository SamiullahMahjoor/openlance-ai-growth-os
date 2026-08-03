/**
 * Dependency resolution (ai/retrieval/dependency-resolution.md, OL-AI-RETRIEVAL-DEPENDENCY-RESOLUTION).
 *
 * How the selected knowledge is expanded to include its declared dependencies, so the retrieved set is
 * dependency-complete, as immutable definitions (ADR-0020). This concern owns dependency expansion only;
 * it never owns the dependencies themselves (declared by each knowledge document's depends_on and mapped
 * by knowledge/architecture/dependency-map.md) nor selects the base set (owned by
 * ai/retrieval/knowledge-selection.md). Expanding a concrete set over the concrete dependency graph is a
 * runtime evaluation this concern does not own; it is deferred to the runtime. This concern states what
 * expansion is and the invariants it always satisfies.
 */

/**
 * A dependency-resolution principle (ai/retrieval/dependency-resolution.md, "Principles"). Each
 * instantiates a retrieval invariant owned by ai/retrieval/README.md.
 */
export type DependencyResolutionPrinciple =
  | 'set-is-dependency-complete'
  | 'declared-not-inferred'
  | 'transitive-and-terminating'
  | 'preserves-authority';

/** The four dependency-resolution principles, in constitutional order; frozen. */
export const DEPENDENCY_RESOLUTION_PRINCIPLES: readonly DependencyResolutionPrinciple[] =
  Object.freeze([
    'set-is-dependency-complete',
    'declared-not-inferred',
    'transitive-and-terminating',
    'preserves-authority',
  ]);

/** The statement each dependency-resolution principle makes (ai/retrieval/dependency-resolution.md). */
export const DEPENDENCY_RESOLUTION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<DependencyResolutionPrinciple, string>
> = Object.freeze({
  'set-is-dependency-complete':
    'No selected source is retrieved without the sources it declares it depends on.',
  'declared-not-inferred':
    'Expansion follows the dependencies each document declares, and never invents a dependency the repository does not record.',
  'transitive-and-terminating':
    "A dependency's own dependencies are included, and because the knowledge dependency graph is acyclic, expansion always terminates.",
  'preserves-authority':
    'A dependency is included together with the authority it holds, so a governing dependency is present with the source it governs.',
});

/**
 * A dependency-resolution invariant (ai/retrieval/dependency-resolution.md, "Invariants"): a guarantee
 * that always holds for dependency expansion.
 */
export type DependencyResolutionInvariant =
  | 'every-declared-dependency-present'
  | 'follows-only-declared'
  | 'expansion-terminates'
  | 'each-owner-once'
  | 'resolving-is-inert';

/** The five dependency-resolution invariants, in constitutional order; frozen. */
export const DEPENDENCY_RESOLUTION_INVARIANTS: readonly DependencyResolutionInvariant[] =
  Object.freeze([
    'every-declared-dependency-present',
    'follows-only-declared',
    'expansion-terminates',
    'each-owner-once',
    'resolving-is-inert',
  ]);

/** The guarantee each dependency-resolution invariant states (ai/retrieval/dependency-resolution.md). */
export const DEPENDENCY_RESOLUTION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<DependencyResolutionInvariant, string>
> = Object.freeze({
  'every-declared-dependency-present':
    'Every source in the retrieved set has all of its declared dependencies in the set.',
  'follows-only-declared': 'Expansion follows only declared dependencies and never invents one.',
  'expansion-terminates': 'Expansion always terminates, because the dependency graph is acyclic.',
  'each-owner-once': 'Each canonical owner appears in the set exactly once.',
  'resolving-is-inert':
    'Resolving dependencies never loads knowledge, never changes ownership, authority, governance, or business truth.',
});
