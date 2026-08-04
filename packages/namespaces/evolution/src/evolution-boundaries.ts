/**
 * Evolution boundaries: what evolution never owns, and where evolution stops
 * (ai/evolution/evolution-boundaries.md, OL-AI-EVOLUTION-EVOLUTION-BOUNDARIES).
 *
 * The Specification enumerates a closed set of the named architectural boundaries evolution operates within.
 * This module owns the boundaries; the rules that set them are owned by ai/governance/, the execution by
 * ai/runtime/ and the running of the layer by ai/operations/, the amendment workflow by ai/CONTRIBUTING.md and
 * the maturity map by ai/architecture/repository-evolution.md, and business truth by the knowledge repository.
 * An evolution action that would cross any boundary does not proceed; a change reserved to governance or the
 * amendment workflow is deferred to it. The boundaries carry no ordering and no predicate; how a change is
 * carried out is the amendment workflow's and the runtime's, and this module is their immutable definition
 * (ADR-0020, ADR-0025).
 */

/**
 * An evolution-boundaries principle: a permanent rule the boundaries uphold, each instantiating an evolution
 * invariant (ai/evolution/evolution-boundaries.md, "Principles").
 */
export type EvolutionBoundaryPrinciple =
  | 'evolution-defines-change-it-does-not-perform-behavior'
  | 'evolution-changes-the-architecture-not-the-behavior'
  | 'evolution-owns-no-workflow-rule-or-map'
  | 'evolution-owns-no-truth';

/** The evolution-boundaries principles, in constitutional order; frozen. */
export const EVOLUTION_BOUNDARY_PRINCIPLES: readonly EvolutionBoundaryPrinciple[] = Object.freeze([
  'evolution-defines-change-it-does-not-perform-behavior',
  'evolution-changes-the-architecture-not-the-behavior',
  'evolution-owns-no-workflow-rule-or-map',
  'evolution-owns-no-truth',
]);

/** What each evolution-boundaries principle requires (ai/evolution/evolution-boundaries.md, "Principles"). */
export const EVOLUTION_BOUNDARY_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<EvolutionBoundaryPrinciple, string>
> = Object.freeze({
  'evolution-defines-change-it-does-not-perform-behavior':
    'Evolution defines how the architecture changes and stops there; execution, reasoning, operation, and governance belong to other namespaces.',
  'evolution-changes-the-architecture-not-the-behavior':
    'Evolution never changes what a namespace does; it changes the architecture that defines the namespace, additively and under governance.',
  'evolution-owns-no-workflow-rule-or-map':
    'The amendment workflow, the change rules, and the maturity map are owned by ai/CONTRIBUTING.md, ai/governance/, and ai/architecture/repository-evolution.md; evolution applies and defers to them.',
  'evolution-owns-no-truth':
    'Business truth and its own evolution are owned by the knowledge repository; evolution describes the structural integration only.',
});

/**
 * An evolution boundary: one architectural boundary evolution operates within, in constitutional listing order
 * (ai/evolution/evolution-boundaries.md, "Specification"). The set is unordered.
 */
export type EvolutionBoundary =
  | 'behavior'
  | 'runtime-and-operations'
  | 'governance'
  | 'workflow-and-map'
  | 'knowledge'
  | 'implementation';

/** The evolution boundaries, in constitutional listing order; frozen. */
export const EVOLUTION_BOUNDARIES: readonly EvolutionBoundary[] = Object.freeze([
  'behavior',
  'runtime-and-operations',
  'governance',
  'workflow-and-map',
  'knowledge',
  'implementation',
]);

/** What each evolution boundary is (ai/evolution/evolution-boundaries.md, "Specification"). */
export const EVOLUTION_BOUNDARY_DESCRIPTIONS: Readonly<Record<EvolutionBoundary, string>> =
  Object.freeze({
    behavior:
      'Evolution defines how the architecture changes and never executes, reasons, retrieves, stores truth, evaluates, or operates; the behavior of the layer is owned by the subject namespaces, and evolution changes the architecture that defines them and performs none of their behavior.',
    'runtime-and-operations':
      'Evolution never performs runtime behavior and never runs the layer; execution is owned by ai/runtime/, and running the layer by ai/operations/, and evolution changes the architecture both are defined by, and neither executes nor operates.',
    governance:
      'Evolution proceeds only within the change rules owned by ai/governance/ and never defines, changes, or overrides a rule, and never makes a governed decision; a change that would exceed the rules is refused and escalated under ai/governance/escalation.md.',
    'workflow-and-map':
      'Evolution serves the amendment workflow owned by ai/CONTRIBUTING.md and reads the maturity map owned by ai/architecture/repository-evolution.md, and owns neither; it never restates the workflow or the map.',
    knowledge:
      'Evolution describes the structural integration of the AI layer with the knowledge repository and never owns, restates, or changes business truth, which the knowledge repository owns and evolves under its own process.',
    implementation:
      'Evolution is a model of controlled architectural change, never a deployment, a migration tool, a version-control system, a provider, a framework, or code, and this namespace names none.',
  });

/**
 * An evolution-boundaries invariant: a guarantee the boundaries always uphold
 * (ai/evolution/evolution-boundaries.md, "Invariants").
 */
export type EvolutionBoundaryInvariant =
  | 'defines-change-never-executes-reasons-operates-or-performs-runtime-behavior'
  | 'changes-the-architecture-additively-never-the-behavior-of-a-namespace'
  | 'owns-no-workflow-rule-or-map-defers-each-to-its-owner'
  | 'owns-no-business-truth-only-describes-structural-integration-with-knowledge'
  | 'enforcing-a-boundary-is-inert';

/** The evolution-boundaries invariants, in constitutional order; frozen. */
export const EVOLUTION_BOUNDARY_INVARIANTS: readonly EvolutionBoundaryInvariant[] = Object.freeze([
  'defines-change-never-executes-reasons-operates-or-performs-runtime-behavior',
  'changes-the-architecture-additively-never-the-behavior-of-a-namespace',
  'owns-no-workflow-rule-or-map-defers-each-to-its-owner',
  'owns-no-business-truth-only-describes-structural-integration-with-knowledge',
  'enforcing-a-boundary-is-inert',
]);

/** What each evolution-boundaries invariant guarantees (ai/evolution/evolution-boundaries.md, "Invariants"). */
export const EVOLUTION_BOUNDARY_INVARIANT_DESCRIPTIONS: Readonly<
  Record<EvolutionBoundaryInvariant, string>
> = Object.freeze({
  'defines-change-never-executes-reasons-operates-or-performs-runtime-behavior':
    'Evolution defines how the architecture changes and never executes, reasons, operates, or performs runtime behavior.',
  'changes-the-architecture-additively-never-the-behavior-of-a-namespace':
    'Evolution changes the architecture additively and never changes the behavior of a namespace.',
  'owns-no-workflow-rule-or-map-defers-each-to-its-owner':
    'Evolution owns no amendment workflow, no governance rule, and no maturity map, and defers each to its owner.',
  'owns-no-business-truth-only-describes-structural-integration-with-knowledge':
    'Evolution owns no business truth and only describes the structural integration with the knowledge repository.',
  'enforcing-a-boundary-is-inert':
    'Enforcing a boundary never changes ownership, authority, governance, or business truth.',
});
