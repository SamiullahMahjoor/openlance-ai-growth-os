/**
 * Operations lifecycle: the phases the operation of the layer passes through, from startup to retirement
 * (ai/operations/operations-lifecycle.md, OL-AI-OPERATIONS-OPERATIONS-LIFECYCLE).
 *
 * The operation of the layer passes through a fixed order of phases; each phase precedes the next, and the
 * operation returns from a maintenance phase to steady-state. This module defines the ordered phases, their
 * principles, and their invariants, plus the pure ordering predicate the document's ordering states. The
 * predicate expresses the canonical phase order (startup, steady-state, maintenance, retirement); the return
 * from maintenance to steady-state is a described operational transition, recorded in the phase and invariant
 * descriptions, not a separate transition map. The maintenance model within the maintenance phase is owned by
 * ai/operations/maintenance.md, and the versioning of an operational definition by
 * ai/operations/operations-versioning.md, referenced not restated (ADR-0020).
 */

/**
 * An operations-lifecycle principle: a permanent rule the lifecycle upholds, each instantiating an operational
 * invariant (ai/operations/operations-lifecycle.md, "Principles").
 */
export type OperationsLifecyclePrinciple =
  | 'operation-has-a-defined-beginning-and-end'
  | 'startup-precedes-steady-state'
  | 'steady-state-is-observed-and-kept-healthy'
  | 'retirement-is-orderly';

/** The operations-lifecycle principles, in constitutional order; frozen. */
export const OPERATIONS_LIFECYCLE_PRINCIPLES: readonly OperationsLifecyclePrinciple[] =
  Object.freeze([
    'operation-has-a-defined-beginning-and-end',
    'startup-precedes-steady-state',
    'steady-state-is-observed-and-kept-healthy',
    'retirement-is-orderly',
  ]);

/** What each operations-lifecycle principle requires (ai/operations/operations-lifecycle.md, "Principles"). */
export const OPERATIONS_LIFECYCLE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<OperationsLifecyclePrinciple, string>
> = Object.freeze({
  'operation-has-a-defined-beginning-and-end':
    'The operation of the layer begins with startup and ends with retirement; it never runs without a defined operational state.',
  'startup-precedes-steady-state':
    'The layer is brought into a running state before it is operated in steady-state.',
  'steady-state-is-observed-and-kept-healthy':
    'In steady-state, the layer is observed, monitored, and kept healthy without its behavior being changed.',
  'retirement-is-orderly':
    'The operation of the layer, or a part of it, is brought down in an orderly way that changes no behavior and leaves nothing running unattended.',
});

/**
 * An operations-lifecycle phase, in constitutional order from earliest to latest
 * (ai/operations/operations-lifecycle.md, "Specification"). The order is the document's; it is total and is
 * exposed by {@link operationsPhaseAtOrAfter}. The operation returns from the maintenance phase to steady-state
 * (a described transition), which does not change the canonical order in which the phases are declared.
 */
export type OperationsLifecyclePhase = 'startup' | 'steady-state' | 'maintenance' | 'retirement';

/** The operations-lifecycle phases, earliest to latest; frozen. */
export const OPERATIONS_LIFECYCLE_PHASES: readonly OperationsLifecyclePhase[] = Object.freeze([
  'startup',
  'steady-state',
  'maintenance',
  'retirement',
]);

/** What each operations-lifecycle phase is (ai/operations/operations-lifecycle.md, "Specification"). */
export const OPERATIONS_LIFECYCLE_PHASE_DESCRIPTIONS: Readonly<
  Record<OperationsLifecyclePhase, string>
> = Object.freeze({
  startup:
    'The layer, or a part of it, is brought into a running state, and its operation begins: observability under ai/operations/observability.md and monitoring under ai/operations/monitoring.md are established, so the running layer is visible from the start; startup begins operation and never changes the behavior of the layer.',
  'steady-state':
    'In steady-state, the layer is operated continuously: it is observed, monitored, and its health assessed under ai/operations/health-management.md, and incidents are handled under ai/operations/incident-management.md as they arise; steady-state keeps the running layer well without changing what it does.',
  maintenance:
    'When maintenance is called for, the operation enters a maintenance phase in which maintenance activities are carried out under ai/operations/maintenance.md; this document owns that maintenance is a phase of the operation, and the model of a maintenance activity is owned by ai/operations/maintenance.md.',
  retirement:
    'The operation of the layer, or a part of it, is retired: it is brought down in an orderly way, its observation is concluded, and nothing is left running unattended; retirement ends operation and changes no behavior.',
});

/**
 * An operations-lifecycle invariant: a guarantee the lifecycle always upholds
 * (ai/operations/operations-lifecycle.md, "Invariants").
 */
export type OperationsLifecycleInvariant =
  | 'begins-at-startup-ends-at-retirement'
  | 'startup-precedes-steady-state-and-returns-from-maintenance-to-steady-state'
  | 'every-phase-observes-and-maintains-without-changing-behavior'
  | 'retirement-is-orderly-and-leaves-nothing-running-unattended'
  | 'a-phase-transition-is-inert';

/** The operations-lifecycle invariants, in constitutional order; frozen. */
export const OPERATIONS_LIFECYCLE_INVARIANTS: readonly OperationsLifecycleInvariant[] =
  Object.freeze([
    'begins-at-startup-ends-at-retirement',
    'startup-precedes-steady-state-and-returns-from-maintenance-to-steady-state',
    'every-phase-observes-and-maintains-without-changing-behavior',
    'retirement-is-orderly-and-leaves-nothing-running-unattended',
    'a-phase-transition-is-inert',
  ]);

/** What each operations-lifecycle invariant guarantees (ai/operations/operations-lifecycle.md, "Invariants"). */
export const OPERATIONS_LIFECYCLE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<OperationsLifecycleInvariant, string>
> = Object.freeze({
  'begins-at-startup-ends-at-retirement':
    'The operation of the layer begins at Startup and ends at Retirement.',
  'startup-precedes-steady-state-and-returns-from-maintenance-to-steady-state':
    'Startup precedes Steady-state, and the operation returns from Maintenance to Steady-state.',
  'every-phase-observes-and-maintains-without-changing-behavior':
    'Every phase observes and maintains the running layer without changing its behavior.',
  'retirement-is-orderly-and-leaves-nothing-running-unattended':
    'Retirement is orderly and leaves nothing running unattended.',
  'a-phase-transition-is-inert':
    'A phase transition never reasons, executes runtime behavior, decides, changes behavior, or changes ownership, authority, governance, or business truth.',
});

/**
 * The private rank of each lifecycle phase in the constitutional order (earliest = 0). Internal to the
 * ordering predicate; never exported.
 */
const OPERATIONS_LIFECYCLE_PHASE_RANK: Readonly<Record<OperationsLifecyclePhase, number>> =
  Object.freeze({
    startup: 0,
    'steady-state': 1,
    maintenance: 2,
    retirement: 3,
  });

/**
 * Whether lifecycle phase `a` is at or after lifecycle phase `b` in the constitutional phase order, from
 * startup first to retirement last (ai/operations/operations-lifecycle.md, "Specification"). Pure and total:
 * it reads only the fixed order the document declares ("each phase precedes the next") and expresses that order
 * verbatim. It states no policy of its own and does not model the described return from maintenance to
 * steady-state.
 */
export function operationsPhaseAtOrAfter(
  a: OperationsLifecyclePhase,
  b: OperationsLifecyclePhase,
): boolean {
  return OPERATIONS_LIFECYCLE_PHASE_RANK[a] >= OPERATIONS_LIFECYCLE_PHASE_RANK[b];
}
