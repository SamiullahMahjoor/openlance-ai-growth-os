/**
 * Event lifecycle: the architectural lifecycle events an execution emits (ai/runtime/event-lifecycle.md,
 * OL-AI-RUNTIME-EVENT-LIFECYCLE).
 *
 * The Specification enumerates a closed set of the named lifecycle events an execution emits as it moves
 * through its life. This module owns the events; the transitions and steps they mark are owned by
 * ai/runtime/execution-states.md and ai/runtime/execution-workflow.md, referenced not restated. The events are
 * an unordered classification and carry no predicate: the three terminal events (Completed, Failed, Cancelled)
 * are mutually exclusive alternatives, so the set is not a total order. This module is their immutable
 * definition (ADR-0020).
 */

/**
 * An event-lifecycle principle: a permanent rule the event model upholds, each instantiating a runtime
 * invariant (ai/runtime/event-lifecycle.md, "Principles").
 */
export type EventLifecyclePrinciple =
  | 'every-execution-is-observable'
  | 'events-are-architectural-not-a-mechanism'
  | 'events-mirror-the-lifecycle'
  | 'events-carry-no-truth-or-rule';

/** The event-lifecycle principles, in constitutional order; frozen. */
export const EVENT_LIFECYCLE_PRINCIPLES: readonly EventLifecyclePrinciple[] = Object.freeze([
  'every-execution-is-observable',
  'events-are-architectural-not-a-mechanism',
  'events-mirror-the-lifecycle',
  'events-carry-no-truth-or-rule',
]);

/** What each event-lifecycle principle requires (ai/runtime/event-lifecycle.md, "Principles"). */
export const EVENT_LIFECYCLE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<EventLifecyclePrinciple, string>
> = Object.freeze({
  'every-execution-is-observable':
    'An execution emits the defined events across its life, so it can be followed.',
  'events-are-architectural-not-a-mechanism':
    'An event marks that a defined point in the lifecycle was reached; it is not a transport, a record, or a log.',
  'events-mirror-the-lifecycle':
    'The events correspond to the lifecycle phases, the states, and the workflow steps owned by the other runtime documents.',
  'events-carry-no-truth-or-rule':
    'An event marks a runtime moment; it never carries business truth or a governance decision, which are owned elsewhere.',
});

/**
 * A runtime lifecycle event: one of the architectural events an execution emits, in constitutional listing
 * order (ai/runtime/event-lifecycle.md, "Specification"). The set is unordered; the three terminal events are
 * mutually exclusive alternatives.
 */
export type RuntimeEvent =
  | 'execution-started'
  | 'validation-started'
  | 'knowledge-loaded'
  | 'context-loaded'
  | 'execution-completed'
  | 'execution-failed'
  | 'execution-cancelled'
  | 'session-closed';

/** The runtime lifecycle events, in constitutional listing order; frozen. */
export const RUNTIME_EVENTS: readonly RuntimeEvent[] = Object.freeze([
  'execution-started',
  'validation-started',
  'knowledge-loaded',
  'context-loaded',
  'execution-completed',
  'execution-failed',
  'execution-cancelled',
  'session-closed',
]);

/** What each runtime event marks (ai/runtime/event-lifecycle.md, "Specification"). */
export const RUNTIME_EVENT_DESCRIPTIONS: Readonly<Record<RuntimeEvent, string>> = Object.freeze({
  'execution-started': 'The execution has entered its lifecycle and begun initialization.',
  'validation-started':
    'The execution has begun the validation pipeline owned by ai/runtime/validation-pipeline.md.',
  'knowledge-loaded':
    'The knowledge the execution requires has been loaded, under ai/runtime/knowledge-resolution.md.',
  'context-loaded':
    'The execution context has been assembled, under ai/runtime/context-loading.md.',
  'execution-completed': 'The task finished and produced its result.',
  'execution-failed': 'The execution ended without completing, after recovery did not succeed.',
  'execution-cancelled':
    'The execution was stopped before completion by a governed or human decision.',
  'session-closed':
    'The session containing the execution has closed, under ai/runtime/session-lifecycle.md.',
});

/**
 * An event-lifecycle invariant: a guarantee the event model always upholds (ai/runtime/event-lifecycle.md,
 * "Invariants").
 */
export type EventLifecycleInvariant =
  | 'emits-started-and-reaches-exactly-one-terminal-event'
  | 'an-event-marks-a-runtime-moment-carries-no-truth-or-decision'
  | 'events-correspond-to-states-and-steps-never-contradict'
  | 'emitting-an-event-is-inert';

/** The event-lifecycle invariants, in constitutional order; frozen. */
export const EVENT_LIFECYCLE_INVARIANTS: readonly EventLifecycleInvariant[] = Object.freeze([
  'emits-started-and-reaches-exactly-one-terminal-event',
  'an-event-marks-a-runtime-moment-carries-no-truth-or-decision',
  'events-correspond-to-states-and-steps-never-contradict',
  'emitting-an-event-is-inert',
]);

/** What each event-lifecycle invariant guarantees (ai/runtime/event-lifecycle.md, "Invariants"). */
export const EVENT_LIFECYCLE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<EventLifecycleInvariant, string>
> = Object.freeze({
  'emits-started-and-reaches-exactly-one-terminal-event':
    'Every execution emits Execution Started and reaches exactly one of Execution Completed, Execution Failed, or Execution Cancelled.',
  'an-event-marks-a-runtime-moment-carries-no-truth-or-decision':
    'An event marks a runtime moment only; it carries no business truth and no governance decision.',
  'events-correspond-to-states-and-steps-never-contradict':
    'The events correspond to the states and workflow steps owned by the other runtime documents, and never contradict them.',
  'emitting-an-event-is-inert':
    'Emitting an event never changes ownership, authority, governance, or business truth.',
});
