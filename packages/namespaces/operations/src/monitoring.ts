/**
 * Monitoring: how the signals of the running layer are watched against expectations over time, the
 * relationships a monitor holds, and the boundaries of monitoring (ai/operations/monitoring.md,
 * OL-AI-OPERATIONS-MONITORING).
 *
 * The Specification narrates the monitoring model as heterogeneous facets (the monitoring model, monitoring
 * relationships, monitoring boundaries, recognizing not judging or protecting). It enumerates no closed
 * homogeneous set the model refers to by identity, so this concern is definitions only (principles and
 * invariants), consistent with the modeling rule recorded in docs/implementation/13-retrieval.md section 4. The
 * signals it watches are owned by ai/operations/observability.md and the health derived by
 * ai/operations/health-management.md, referenced not restated (ADR-0020, ADR-0025).
 */

/**
 * A monitoring principle: a permanent rule the monitoring model upholds, each instantiating an operational
 * invariant (ai/operations/monitoring.md, "Principles").
 */
export type MonitoringPrinciple =
  | 'monitoring-watches-it-does-not-produce-signals'
  | 'monitoring-is-against-a-defined-expectation'
  | 'monitoring-observes-it-never-changes'
  | 'monitoring-is-bounded';

/** The monitoring principles, in constitutional order; frozen. */
export const MONITORING_PRINCIPLES: readonly MonitoringPrinciple[] = Object.freeze([
  'monitoring-watches-it-does-not-produce-signals',
  'monitoring-is-against-a-defined-expectation',
  'monitoring-observes-it-never-changes',
  'monitoring-is-bounded',
]);

/** What each monitoring principle requires (ai/operations/monitoring.md, "Principles"). */
export const MONITORING_PRINCIPLE_DESCRIPTIONS: Readonly<Record<MonitoringPrinciple, string>> =
  Object.freeze({
    'monitoring-watches-it-does-not-produce-signals':
      'Monitoring watches the signals owned by ai/operations/observability.md against expectations; it never produces a signal or changes the behavior that emits it.',
    'monitoring-is-against-a-defined-expectation':
      'A monitor watches a signal against a defined expectation, so a deviation is defined, never a matter of opinion.',
    'monitoring-observes-it-never-changes':
      'Watching the running layer observes it and never alters the behavior watched.',
    'monitoring-is-bounded':
      'A monitor watches defined signals within defined boundaries, and never reaches into the behavior it watches.',
  });

/**
 * A monitoring invariant: a guarantee the monitoring model always upholds (ai/operations/monitoring.md,
 * "Invariants").
 */
export type MonitoringInvariant =
  | 'watches-observability-signals-against-expectations-never-produces-a-signal'
  | 'a-deviation-is-defined-against-an-expectation-never-opinion'
  | 'observes-within-bounds-never-reaches-into-or-changes-behavior'
  | 'a-recognized-deviation-is-passed-to-health-or-incident-never-protects-or-decides'
  | 'monitoring-is-inert';

/** The monitoring invariants, in constitutional order; frozen. */
export const MONITORING_INVARIANTS: readonly MonitoringInvariant[] = Object.freeze([
  'watches-observability-signals-against-expectations-never-produces-a-signal',
  'a-deviation-is-defined-against-an-expectation-never-opinion',
  'observes-within-bounds-never-reaches-into-or-changes-behavior',
  'a-recognized-deviation-is-passed-to-health-or-incident-never-protects-or-decides',
  'monitoring-is-inert',
]);

/** What each monitoring invariant guarantees (ai/operations/monitoring.md, "Invariants"). */
export const MONITORING_INVARIANT_DESCRIPTIONS: Readonly<Record<MonitoringInvariant, string>> =
  Object.freeze({
    'watches-observability-signals-against-expectations-never-produces-a-signal':
      'Monitoring watches the signals owned by observability against defined expectations and never produces a signal.',
    'a-deviation-is-defined-against-an-expectation-never-opinion':
      'A deviation is defined against an expectation, never a matter of opinion.',
    'observes-within-bounds-never-reaches-into-or-changes-behavior':
      'Monitoring observes within defined boundaries and never reaches into or changes the behavior it watches.',
    'a-recognized-deviation-is-passed-to-health-or-incident-never-protects-or-decides':
      'A recognized deviation is passed to health or incident management, and monitoring never itself protects or decides.',
    'monitoring-is-inert':
      'Monitoring never reasons, executes, decides, changes behavior, or changes ownership, authority, governance, or business truth.',
  });
