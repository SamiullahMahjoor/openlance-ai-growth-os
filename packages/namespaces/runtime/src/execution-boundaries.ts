/**
 * Execution boundaries: the architectural boundaries of an execution, its scope, isolation, and the limits it
 * operates within (ai/runtime/execution-boundaries.md, OL-AI-RUNTIME-EXECUTION-BOUNDARIES).
 *
 * The Specification enumerates a closed set of the named architectural boundaries a single execution operates
 * within. This module owns the boundaries; the permissions and autonomy that set them are owned by
 * ai/governance/. An execution that would cross any boundary does not proceed; it is handled by
 * ai/runtime/failure-recovery.md, and whether it escalates or refuses is decided by ai/governance/. The
 * boundaries carry no ordering and no predicate; how a boundary is enforced is the runtime's, and this module
 * is their immutable definition (ADR-0020).
 */

/**
 * An execution-boundaries principle: a permanent rule the boundaries uphold, each instantiating a runtime
 * invariant (ai/runtime/execution-boundaries.md, "Principles").
 */
export type ExecutionBoundaryPrinciple =
  | 'an-execution-is-scoped'
  | 'executions-are-isolated'
  | 'an-execution-stays-within-its-grant'
  | 'an-execution-never-crosses-the-layer-boundaries'
  | 'bounds-hold-at-any-scale';

/** The execution-boundaries principles, in constitutional order; frozen. */
export const EXECUTION_BOUNDARY_PRINCIPLES: readonly ExecutionBoundaryPrinciple[] = Object.freeze([
  'an-execution-is-scoped',
  'executions-are-isolated',
  'an-execution-stays-within-its-grant',
  'an-execution-never-crosses-the-layer-boundaries',
  'bounds-hold-at-any-scale',
]);

/** What each execution-boundaries principle requires (ai/runtime/execution-boundaries.md, "Principles"). */
export const EXECUTION_BOUNDARY_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ExecutionBoundaryPrinciple, string>
> = Object.freeze({
  'an-execution-is-scoped':
    'Every execution runs within a defined scope, granted at initialization, and never acts outside it.',
  'executions-are-isolated':
    "One execution does not reach into another's scope, state, or context.",
  'an-execution-stays-within-its-grant':
    'It acts only within the permissions and autonomy granted to it, owned by ai/governance/, and never expands them.',
  'an-execution-never-crosses-the-layer-boundaries':
    'It never owns or writes business truth, never changes ownership, and never amends governance.',
  'bounds-hold-at-any-scale':
    'The same bounds confine one execution and millions of concurrent executions.',
});

/**
 * An execution boundary: one architectural boundary a single execution operates within, in constitutional
 * listing order (ai/runtime/execution-boundaries.md, "Specification"). The set is unordered.
 */
export type ExecutionBoundary = 'scope' | 'isolation' | 'authority' | 'layer' | 'resource';

/** The execution boundaries, in constitutional listing order; frozen. */
export const EXECUTION_BOUNDARIES: readonly ExecutionBoundary[] = Object.freeze([
  'scope',
  'isolation',
  'authority',
  'layer',
  'resource',
]);

/** What each execution boundary is (ai/runtime/execution-boundaries.md, "Specification"). */
export const EXECUTION_BOUNDARY_DESCRIPTIONS: Readonly<Record<ExecutionBoundary, string>> =
  Object.freeze({
    scope:
      'An execution runs within the scope established at initialization: its session, its task, and the grant it was given; it reads and acts only within that scope.',
    isolation:
      'An execution is isolated from other executions; it does not read, alter, or depend on the private state of another execution, and its failure does not corrupt another.',
    authority:
      'An execution acts only within the authority and permissions granted to it, owned by ai/governance/permission-governance.md, and within its granted autonomy level, owned by ai/governance/autonomy-boundaries.md.',
    layer:
      'An execution never owns or writes business truth, never changes the ownership of a concern, never amends a governance rule, and never promotes runtime state into the knowledge repository, consistent with the AI boundary owned by ai/README.md.',
    resource:
      'An execution holds resources only for its lifecycle and releases them at closure, so no execution retains a hold beyond its life.',
  });

/**
 * An execution-boundaries invariant: a guarantee the boundaries always uphold
 * (ai/runtime/execution-boundaries.md, "Invariants").
 */
export type ExecutionBoundaryInvariant =
  | 'acts-only-within-granted-scope-authority-and-autonomy'
  | 'isolated-from-every-other-execution'
  | 'never-writes-truth-never-changes-ownership-or-governance'
  | 'releases-resources-at-closure'
  | 'enforcing-a-boundary-is-inert';

/** The execution-boundaries invariants, in constitutional order; frozen. */
export const EXECUTION_BOUNDARY_INVARIANTS: readonly ExecutionBoundaryInvariant[] = Object.freeze([
  'acts-only-within-granted-scope-authority-and-autonomy',
  'isolated-from-every-other-execution',
  'never-writes-truth-never-changes-ownership-or-governance',
  'releases-resources-at-closure',
  'enforcing-a-boundary-is-inert',
]);

/** What each execution-boundaries invariant guarantees (ai/runtime/execution-boundaries.md, "Invariants"). */
export const EXECUTION_BOUNDARY_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ExecutionBoundaryInvariant, string>
> = Object.freeze({
  'acts-only-within-granted-scope-authority-and-autonomy':
    'An execution acts only within its granted scope, authority, and autonomy.',
  'isolated-from-every-other-execution': 'An execution is isolated from every other execution.',
  'never-writes-truth-never-changes-ownership-or-governance':
    'An execution never writes business truth and never changes ownership or governance.',
  'releases-resources-at-closure': 'An execution releases its resources at closure.',
  'enforcing-a-boundary-is-inert':
    'Enforcing a boundary never changes ownership, authority, governance, or business truth.',
});
