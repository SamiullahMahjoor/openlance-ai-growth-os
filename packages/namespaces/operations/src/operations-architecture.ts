/**
 * Operations architecture: the operational identity and structural composition, what operating the layer is
 * and the parts it is composed of (ai/operations/operations-architecture.md,
 * OL-AI-OPERATIONS-OPERATIONS-ARCHITECTURE).
 *
 * Operating the layer is a distinct, composed discipline that runs the layer without changing its behavior.
 * This module defines the closed set of parts the operational model is composed of, plus the structural
 * principles and invariants. The parts are unordered and carry no predicate; each part is owned by its named
 * document (observability, monitoring, health management, incident management, diagnostics, maintenance), and
 * the runtime behavior operated is owned by ai/runtime/, referenced not restated (ADR-0020).
 */

/**
 * An operations-architecture principle: a permanent rule the structural model upholds, each instantiating an
 * operational invariant (ai/operations/operations-architecture.md, "Principles").
 */
export type OperationsArchitecturePrinciple =
  | 'operating-is-a-discipline-not-a-behavior'
  | 'operating-has-a-distinct-identity'
  | 'operating-is-composed-of-defined-parts'
  | 'the-operational-structure-is-deterministic';

/** The operations-architecture principles, in constitutional order; frozen. */
export const OPERATIONS_ARCHITECTURE_PRINCIPLES: readonly OperationsArchitecturePrinciple[] =
  Object.freeze([
    'operating-is-a-discipline-not-a-behavior',
    'operating-has-a-distinct-identity',
    'operating-is-composed-of-defined-parts',
    'the-operational-structure-is-deterministic',
  ]);

/** What each operations-architecture principle requires (ai/operations/operations-architecture.md, "Principles"). */
export const OPERATIONS_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<OperationsArchitecturePrinciple, string>
> = Object.freeze({
  'operating-is-a-discipline-not-a-behavior':
    'Operating is the architectural means by which the running of the layer is kept well; it never produces or changes the behavior of the layer.',
  'operating-has-a-distinct-identity':
    'The operation of the layer is a defined, identifiable discipline, so it can be observed, versioned, and reasoned about as one operation.',
  'operating-is-composed-of-defined-parts':
    'The operational model is composed of observability, monitoring, health, incident, diagnostic, and maintenance parts, each owned by its named document.',
  'the-operational-structure-is-deterministic':
    'The same operational definition over the same state resolves to the same operational model, with no randomness.',
});

/**
 * An operational part: one of the parts the operational model is composed of, in constitutional listing order
 * (ai/operations/operations-architecture.md, "Specification"). The set is closed and unordered. Each part is
 * owned by its named document.
 */
export type OperationsPart =
  'observability' | 'monitoring' | 'health' | 'incident' | 'diagnostic' | 'maintenance';

/** The parts the operational model is composed of, in constitutional listing order; frozen. */
export const OPERATIONS_PARTS: readonly OperationsPart[] = Object.freeze([
  'observability',
  'monitoring',
  'health',
  'incident',
  'diagnostic',
  'maintenance',
]);

/** What each operational part is (ai/operations/operations-architecture.md, "Specification"). */
export const OPERATIONS_PART_DESCRIPTIONS: Readonly<Record<OperationsPart, string>> = Object.freeze(
  {
    observability:
      'The observability owned by ai/operations/observability.md; this document owns that operating the layer is composed of it.',
    monitoring:
      'The monitoring owned by ai/operations/monitoring.md; this document owns that operating the layer is composed of it.',
    health:
      'The health management owned by ai/operations/health-management.md; this document owns that operating the layer is composed of it.',
    incident:
      'The incident management owned by ai/operations/incident-management.md; this document owns that operating the layer is composed of it.',
    diagnostic:
      'The diagnostics owned by ai/operations/diagnostics.md; this document owns that operating the layer is composed of it.',
    maintenance:
      'The maintenance owned by ai/operations/maintenance.md; this document owns that operating the layer is composed of it.',
  },
);

/**
 * An operations-architecture invariant: a guarantee the structural model always upholds
 * (ai/operations/operations-architecture.md, "Invariants").
 */
export type OperationsArchitectureInvariant =
  | 'operating-is-a-distinct-identifiable-discipline-separate-from-behavior'
  | 'composed-of-observability-monitoring-health-incident-diagnostic-and-maintenance'
  | 'composes-over-runtime-never-orchestrates-schedules-or-changes'
  | 'same-definition-same-operational-model'
  | 'defining-structure-is-inert';

/** The operations-architecture invariants, in constitutional order; frozen. */
export const OPERATIONS_ARCHITECTURE_INVARIANTS: readonly OperationsArchitectureInvariant[] =
  Object.freeze([
    'operating-is-a-distinct-identifiable-discipline-separate-from-behavior',
    'composed-of-observability-monitoring-health-incident-diagnostic-and-maintenance',
    'composes-over-runtime-never-orchestrates-schedules-or-changes',
    'same-definition-same-operational-model',
    'defining-structure-is-inert',
  ]);

/** What each operations-architecture invariant guarantees (ai/operations/operations-architecture.md, "Invariants"). */
export const OPERATIONS_ARCHITECTURE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<OperationsArchitectureInvariant, string>
> = Object.freeze({
  'operating-is-a-distinct-identifiable-discipline-separate-from-behavior':
    'Operating the layer is a distinct, identifiable discipline, separate from the behavior it operates.',
  'composed-of-observability-monitoring-health-incident-diagnostic-and-maintenance':
    'The operational model is composed of observability, monitoring, health, incident, diagnostic, and maintenance parts, each owned by its named document.',
  'composes-over-runtime-never-orchestrates-schedules-or-changes':
    'Operating composes over the runtime it operates and never orchestrates, schedules, or changes runtime behavior.',
  'same-definition-same-operational-model':
    'The same operational definition over the same state resolves to the same operational model, with no randomness.',
  'defining-structure-is-inert':
    'Defining the operational structure never reasons, executes, decides, changes behavior, or changes ownership, authority, governance, or business truth.',
});
