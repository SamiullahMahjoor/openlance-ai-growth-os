/**
 * Health management: the operational health of the running layer, expressed as a health model with defined
 * health states, and how that health is assessed (ai/operations/health-management.md,
 * OL-AI-OPERATIONS-HEALTH-MANAGEMENT).
 *
 * The Specification enumerates a closed, ordered set of health states, "ordered from healthy to degraded to
 * failed", of which the layer holds exactly one at a time; the set is restated in the invariants ("from healthy
 * to failed"). This module defines those ordered states, the principles, the invariants, and the pure ordering
 * predicate the document's ordering states. The monitoring that feeds health is owned by
 * ai/operations/monitoring.md, the incident raised on ill health by ai/operations/incident-management.md, and
 * the safety state a health state is not by ai/safety/, referenced not restated (ADR-0020, ADR-0025).
 */

/**
 * A health-management principle: a permanent rule the health model upholds, each instantiating an operational
 * invariant (ai/operations/health-management.md, "Principles").
 */
export type HealthManagementPrinciple =
  | 'health-is-an-operational-state-not-a-behavior'
  | 'health-is-assessed-from-monitored-signals'
  | 'health-states-are-defined'
  | 'assessing-health-observes-it-never-changes';

/** The health-management principles, in constitutional order; frozen. */
export const HEALTH_MANAGEMENT_PRINCIPLES: readonly HealthManagementPrinciple[] = Object.freeze([
  'health-is-an-operational-state-not-a-behavior',
  'health-is-assessed-from-monitored-signals',
  'health-states-are-defined',
  'assessing-health-observes-it-never-changes',
]);

/** What each health-management principle requires (ai/operations/health-management.md, "Principles"). */
export const HEALTH_MANAGEMENT_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<HealthManagementPrinciple, string>
> = Object.freeze({
  'health-is-an-operational-state-not-a-behavior':
    'Health describes how well the layer is running; it is never the behavior of the layer, which is owned by the subject namespaces.',
  'health-is-assessed-from-monitored-signals':
    'Health is derived from what monitoring recognizes under ai/operations/monitoring.md, never from an unfounded impression.',
  'health-states-are-defined':
    'The layer holds one defined health state at a time, so its condition is explicit and never ambiguous.',
  'assessing-health-observes-it-never-changes':
    'Assessing health observes the running layer and never alters the behavior it assesses.',
});

/**
 * A health state: one of the defined operational health states the layer holds one of at a time, in
 * constitutional order from healthy to failed (ai/operations/health-management.md, "Specification"). The order
 * is the document's ("ordered from healthy to degraded to failed"); it is total and is exposed by
 * {@link healthStateAtOrAfter}.
 */
export type HealthState = 'healthy' | 'degraded' | 'failed';

/** The health states, in constitutional order from healthy to failed; frozen. */
export const HEALTH_STATES: readonly HealthState[] = Object.freeze([
  'healthy',
  'degraded',
  'failed',
]);

/** What each health state is (ai/operations/health-management.md, "Specification"). */
export const HEALTH_STATE_DESCRIPTIONS: Readonly<Record<HealthState, string>> = Object.freeze({
  healthy:
    'The first of the defined health states, ordered from healthy to degraded to failed: the operational condition in which the layer, or a part of it, is running well. A health state describes operational condition only; it is not a safety state, which is owned by ai/safety/.',
  degraded:
    'The health state between healthy and failed in the order from healthy to degraded to failed. A health state describes operational condition only; it is not a safety state, which is owned by ai/safety/.',
  failed:
    'The last of the defined health states, ordered from healthy to degraded to failed. A health state describes operational condition only; it is not a safety state, which is owned by ai/safety/.',
});

/**
 * A health-management invariant: a guarantee the health model always upholds
 * (ai/operations/health-management.md, "Invariants").
 */
export type HealthManagementInvariant =
  | 'health-is-an-operational-state-never-the-behavior-of-the-layer'
  | 'one-defined-health-state-at-a-time-from-healthy-to-failed'
  | 'assessed-deterministically-same-monitored-state-same-health-state'
  | 'reports-and-raises-an-incident-never-protects-degrades-or-decides'
  | 'assessing-health-is-inert';

/** The health-management invariants, in constitutional order; frozen. */
export const HEALTH_MANAGEMENT_INVARIANTS: readonly HealthManagementInvariant[] = Object.freeze([
  'health-is-an-operational-state-never-the-behavior-of-the-layer',
  'one-defined-health-state-at-a-time-from-healthy-to-failed',
  'assessed-deterministically-same-monitored-state-same-health-state',
  'reports-and-raises-an-incident-never-protects-degrades-or-decides',
  'assessing-health-is-inert',
]);

/** What each health-management invariant guarantees (ai/operations/health-management.md, "Invariants"). */
export const HEALTH_MANAGEMENT_INVARIANT_DESCRIPTIONS: Readonly<
  Record<HealthManagementInvariant, string>
> = Object.freeze({
  'health-is-an-operational-state-never-the-behavior-of-the-layer':
    'Health is an operational state describing how well the layer runs, never the behavior of the layer.',
  'one-defined-health-state-at-a-time-from-healthy-to-failed':
    'The layer holds one defined health state at a time, from healthy to failed.',
  'assessed-deterministically-same-monitored-state-same-health-state':
    'Health is assessed deterministically from monitored deviations; the same monitored state yields the same health state.',
  'reports-and-raises-an-incident-never-protects-degrades-or-decides':
    'Health management reports and raises an incident, and never itself protects, degrades, or decides.',
  'assessing-health-is-inert':
    'Assessing health never reasons, executes, changes behavior, or changes ownership, authority, governance, or business truth.',
});

/**
 * The private rank of each health state in the constitutional order (healthy = 0). Internal to the ordering
 * predicate; never exported.
 */
const HEALTH_STATE_RANK: Readonly<Record<HealthState, number>> = Object.freeze({
  healthy: 0,
  degraded: 1,
  failed: 2,
});

/**
 * Whether health state `a` is at or after health state `b` in the constitutional health order, from healthy
 * first to failed last (ai/operations/health-management.md, "Specification", "ordered from healthy to degraded
 * to failed"). Pure and total: it reads only the fixed order the document declares and expresses that order
 * verbatim. It states no policy of its own.
 */
export function healthStateAtOrAfter(a: HealthState, b: HealthState): boolean {
  return HEALTH_STATE_RANK[a] >= HEALTH_STATE_RANK[b];
}
