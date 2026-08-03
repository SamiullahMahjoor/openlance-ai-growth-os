/**
 * Operations boundaries: what operations never owns, and where operating stops
 * (ai/operations/operations-boundaries.md, OL-AI-OPERATIONS-OPERATIONS-BOUNDARIES).
 *
 * The Specification enumerates a closed set of the named architectural boundaries operations operates within.
 * This module owns the boundaries; the rules that set them are owned by ai/governance/ and ai/safety/, the
 * runtime execution by ai/runtime/, the behavior operated by the subject namespaces, and the evolution of the
 * layer by the Evolution namespace. An operating action that would cross any boundary does not proceed; a
 * matter reserved to another namespace is deferred to it. The boundaries carry no ordering and no predicate;
 * how a boundary is enforced is the runtime's, and this module is their immutable definition (ADR-0020,
 * ADR-0025).
 */

/**
 * An operations-boundaries principle: a permanent rule the boundaries uphold, each instantiating an operational
 * invariant (ai/operations/operations-boundaries.md, "Principles").
 */
export type OperationsBoundaryPrinciple =
  | 'operations-operates-it-does-not-reason-execute-or-change-behavior'
  | 'operations-changes-no-rule-and-no-behavior'
  | 'operations-owns-no-protection-or-judgment'
  | 'operations-carries-no-truth-and-no-tool';

/** The operations-boundaries principles, in constitutional order; frozen. */
export const OPERATIONS_BOUNDARY_PRINCIPLES: readonly OperationsBoundaryPrinciple[] = Object.freeze(
  [
    'operations-operates-it-does-not-reason-execute-or-change-behavior',
    'operations-changes-no-rule-and-no-behavior',
    'operations-owns-no-protection-or-judgment',
    'operations-carries-no-truth-and-no-tool',
  ],
);

/** What each operations-boundaries principle requires (ai/operations/operations-boundaries.md, "Principles"). */
export const OPERATIONS_BOUNDARY_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<OperationsBoundaryPrinciple, string>
> = Object.freeze({
  'operations-operates-it-does-not-reason-execute-or-change-behavior':
    'Operating observes and maintains the running of the layer and stops there; reasoning, execution, and behavior belong to other namespaces.',
  'operations-changes-no-rule-and-no-behavior':
    'Operating runs the layer within governance and never amends a rule or alters what a namespace does.',
  'operations-owns-no-protection-or-judgment':
    'A protective response is owned by ai/safety/, and output judgment by ai/evaluation/; operations observes their signals and defers.',
  'operations-carries-no-truth-and-no-tool':
    'Operating carries no business truth, and it owns no monitoring tool, log, dashboard, infrastructure, or deployment system.',
});

/**
 * An operations boundary: one architectural boundary operations operates within, in constitutional listing
 * order (ai/operations/operations-boundaries.md, "Specification"). The set is unordered.
 */
export type OperationsBoundary =
  'behavior' | 'runtime' | 'governance' | 'safety-and-evaluation' | 'evolution' | 'implementation';

/** The operations boundaries, in constitutional listing order; frozen. */
export const OPERATIONS_BOUNDARIES: readonly OperationsBoundary[] = Object.freeze([
  'behavior',
  'runtime',
  'governance',
  'safety-and-evaluation',
  'evolution',
  'implementation',
]);

/** What each operations boundary is (ai/operations/operations-boundaries.md, "Specification"). */
export const OPERATIONS_BOUNDARY_DESCRIPTIONS: Readonly<Record<OperationsBoundary, string>> =
  Object.freeze({
    behavior:
      'Operating observes and maintains the running of the layer and never produces or changes its behavior; reasoning, retrieval, memory, prompts, agents, providers, and tools own the behavior, and operations keeps their running well and performs none of it.',
    runtime:
      'Operations operates the runtime it runs and never orchestrates, schedules, or executes; the execution and its lifecycles are owned by ai/runtime/, and operations observes their running without changing them.',
    governance:
      'Operating runs the layer within the rules owned by ai/governance/ and never defines, changes, or overrides a rule, and never makes a governed decision; a matter reserved to governance is deferred to it.',
    'safety-and-evaluation':
      'Operations observes safety and evaluation signals and defers to them: a protective response, a refusal, and safe degradation are owned by ai/safety/, and the judgment of output quality is owned by ai/evaluation/; operations never protects or judges.',
    evolution:
      "Operations keeps the running layer aligned as it evolves, but the evolution of the layer is owned by the Evolution namespace; operations never grows or migrates the layer's structure itself.",
    implementation:
      'Operations is a model of running the layer, never a monitoring tool, a log, a dashboard, an alerting platform, a deployment system, an infrastructure product, a provider, a framework, or code, and this namespace names none.',
  });

/**
 * An operations-boundaries invariant: a guarantee the boundaries always uphold
 * (ai/operations/operations-boundaries.md, "Invariants").
 */
export type OperationsBoundaryInvariant =
  | 'observes-and-maintains-never-produces-or-changes-behavior'
  | 'never-orchestrates-schedules-or-executes-never-defines-or-changes-a-governance-rule'
  | 'observes-safety-and-evaluation-signals-defers-protection-and-judgment'
  | 'carries-no-business-truth-owns-no-tool-dashboard-infrastructure-or-deployment-system'
  | 'enforcing-a-boundary-is-inert';

/** The operations-boundaries invariants, in constitutional order; frozen. */
export const OPERATIONS_BOUNDARY_INVARIANTS: readonly OperationsBoundaryInvariant[] = Object.freeze(
  [
    'observes-and-maintains-never-produces-or-changes-behavior',
    'never-orchestrates-schedules-or-executes-never-defines-or-changes-a-governance-rule',
    'observes-safety-and-evaluation-signals-defers-protection-and-judgment',
    'carries-no-business-truth-owns-no-tool-dashboard-infrastructure-or-deployment-system',
    'enforcing-a-boundary-is-inert',
  ],
);

/** What each operations-boundaries invariant guarantees (ai/operations/operations-boundaries.md, "Invariants"). */
export const OPERATIONS_BOUNDARY_INVARIANT_DESCRIPTIONS: Readonly<
  Record<OperationsBoundaryInvariant, string>
> = Object.freeze({
  'observes-and-maintains-never-produces-or-changes-behavior':
    'Operating observes and maintains the running of the layer and never produces or changes its behavior.',
  'never-orchestrates-schedules-or-executes-never-defines-or-changes-a-governance-rule':
    'Operations never orchestrates, schedules, or executes, and never defines or changes a governance rule.',
  'observes-safety-and-evaluation-signals-defers-protection-and-judgment':
    'Operations observes safety and evaluation signals and defers protection and judgment to them.',
  'carries-no-business-truth-owns-no-tool-dashboard-infrastructure-or-deployment-system':
    'Operations carries no business truth and owns no monitoring tool, dashboard, infrastructure, or deployment system.',
  'enforcing-a-boundary-is-inert':
    'Enforcing a boundary never changes ownership, authority, governance, or business truth.',
});
