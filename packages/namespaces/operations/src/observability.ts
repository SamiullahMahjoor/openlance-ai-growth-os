/**
 * Observability: operational visibility, the signals the running layer makes available and the operational
 * awareness they provide (ai/operations/observability.md, OL-AI-OPERATIONS-OBSERVABILITY).
 *
 * The Specification narrates the observability model as heterogeneous facets (operational signals, operational
 * awareness, observing not evaluating or protecting, neutral and non-invasive). It enumerates no closed
 * homogeneous set the model refers to by identity, so this concern is definitions only (principles and
 * invariants), consistent with the modeling rule recorded in docs/implementation/13-retrieval.md section 4. The
 * watching of signals over time is owned by ai/operations/monitoring.md, the runtime that emits execution by
 * ai/runtime/, and the judgment and protection a signal may indicate by ai/evaluation/ and ai/safety/,
 * referenced not restated (ADR-0020, ADR-0025).
 */

/**
 * An observability principle: a permanent rule the observability model upholds, each instantiating an
 * operational invariant (ai/operations/observability.md, "Principles").
 */
export type ObservabilityPrinciple =
  | 'observability-is-visibility-not-watching'
  | 'a-signal-is-defined-not-raw'
  | 'observability-observes-it-never-changes'
  | 'observability-is-neutral';

/** The observability principles, in constitutional order; frozen. */
export const OBSERVABILITY_PRINCIPLES: readonly ObservabilityPrinciple[] = Object.freeze([
  'observability-is-visibility-not-watching',
  'a-signal-is-defined-not-raw',
  'observability-observes-it-never-changes',
  'observability-is-neutral',
]);

/** What each observability principle requires (ai/operations/observability.md, "Principles"). */
export const OBSERVABILITY_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ObservabilityPrinciple, string>
> = Object.freeze({
  'observability-is-visibility-not-watching':
    'Observability makes the running layer visible through signals; watching those signals over time is owned by ai/operations/monitoring.md.',
  'a-signal-is-defined-not-raw':
    'A signal is a defined, meaningful indication of the operational state, so what is observed is explicit, never an undefined stream.',
  'observability-observes-it-never-changes':
    'Making the layer visible observes its running and never alters the behavior it observes.',
  'observability-is-neutral':
    'A signal is defined in technology-neutral terms, never as a log, a metric mechanism, a dashboard, or a tool.',
});

/**
 * An observability invariant: a guarantee the observability model always upholds
 * (ai/operations/observability.md, "Invariants").
 */
export type ObservabilityInvariant =
  | 'a-signal-is-a-defined-indication-never-an-undefined-stream-or-business-truth'
  | 'observing-never-changes-the-behavior-it-observes'
  | 'operational-awareness-is-a-picture-not-a-judgment-or-decision'
  | 'signals-defined-technology-neutral-never-a-log-or-tool'
  | 'making-the-layer-observable-is-inert';

/** The observability invariants, in constitutional order; frozen. */
export const OBSERVABILITY_INVARIANTS: readonly ObservabilityInvariant[] = Object.freeze([
  'a-signal-is-a-defined-indication-never-an-undefined-stream-or-business-truth',
  'observing-never-changes-the-behavior-it-observes',
  'operational-awareness-is-a-picture-not-a-judgment-or-decision',
  'signals-defined-technology-neutral-never-a-log-or-tool',
  'making-the-layer-observable-is-inert',
]);

/** What each observability invariant guarantees (ai/operations/observability.md, "Invariants"). */
export const OBSERVABILITY_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ObservabilityInvariant, string>
> = Object.freeze({
  'a-signal-is-a-defined-indication-never-an-undefined-stream-or-business-truth':
    'A signal is a defined indication of operational state, never an undefined stream and never business truth.',
  'observing-never-changes-the-behavior-it-observes':
    'Observing the running layer never changes the behavior it observes.',
  'operational-awareness-is-a-picture-not-a-judgment-or-decision':
    'Operational awareness is a picture of how the layer runs, not a judgment or a decision.',
  'signals-defined-technology-neutral-never-a-log-or-tool':
    'Signals are defined in technology-neutral terms, never as a log, metric mechanism, dashboard, or tool.',
  'making-the-layer-observable-is-inert':
    'Making the layer observable never reasons, executes, decides, changes behavior, or changes ownership, authority, governance, or business truth.',
});
