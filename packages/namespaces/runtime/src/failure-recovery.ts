/**
 * Failure and recovery: how the runtime handles failure, including retries, timeouts, cancellation, recovery,
 * checkpoints, and termination (ai/runtime/failure-recovery.md, OL-AI-RUNTIME-FAILURE-RECOVERY).
 *
 * The Specification narrates the failure model as heterogeneous facets (retry policy, timeout behavior,
 * cancellation, checkpoint policy, recovery workflow, rollback, termination), not a closed taxonomy the model
 * refers to by identity, so this concern is definitions only (principles and invariants), consistent with the
 * modeling rule recorded in docs/implementation/13-retrieval.md section 4. The runtime owns the mechanics of
 * failure; whether an execution may continue, escalate, or refuse is owned by ai/governance/escalation.md and
 * ai/governance/autonomy-boundaries.md, referenced not restated. The state transitions the recovery workflow
 * describes (Recovering continues to Executing or terminates to Failed) are owned as the state model by
 * ai/runtime/execution-states.md, which this concern's Recovery workflow and Termination facets inform
 * (ADR-0020).
 */

/**
 * A failure-recovery principle: a permanent rule the failure model upholds, each instantiating a runtime
 * invariant (ai/runtime/failure-recovery.md, "Principles").
 */
export type FailureRecoveryPrinciple =
  | 'failure-is-always-handled'
  | 'the-runtime-handles-governance-decides'
  | 'recovery-is-bounded'
  | 'failure-is-safe'
  | 'termination-is-clean';

/** The failure-recovery principles, in constitutional order; frozen. */
export const FAILURE_RECOVERY_PRINCIPLES: readonly FailureRecoveryPrinciple[] = Object.freeze([
  'failure-is-always-handled',
  'the-runtime-handles-governance-decides',
  'recovery-is-bounded',
  'failure-is-safe',
  'termination-is-clean',
]);

/** What each failure-recovery principle requires (ai/runtime/failure-recovery.md, "Principles"). */
export const FAILURE_RECOVERY_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<FailureRecoveryPrinciple, string>
> = Object.freeze({
  'failure-is-always-handled':
    'Every failure resolves to a defined outcome; no execution is left in an undefined condition.',
  'the-runtime-handles-governance-decides':
    'The runtime performs retry, recovery, and termination; whether execution may continue, escalate, or refuse is owned by ai/governance/.',
  'recovery-is-bounded':
    'Retries and recovery are bounded, so a failing execution does not loop or run without end.',
  'failure-is-safe':
    'A failure that cannot be recovered ends in a defined terminal state, never in invention or an unbounded state.',
  'termination-is-clean':
    'A terminated execution reaches a terminal state and releases its resources.',
});

/**
 * A failure-recovery invariant: a guarantee the failure model always upholds (ai/runtime/failure-recovery.md,
 * "Invariants").
 */
export type FailureRecoveryInvariant =
  | 'every-failure-resolves-to-retry-recovery-or-termination'
  | 'retries-and-recovery-are-bounded-never-run-without-end'
  | 'terminated-or-cancelled-reaches-terminal-state-releases-resources'
  | 'never-continues-against-a-governance-decision-to-stop-escalate-or-refuse'
  | 'handling-a-failure-is-inert';

/** The failure-recovery invariants, in constitutional order; frozen. */
export const FAILURE_RECOVERY_INVARIANTS: readonly FailureRecoveryInvariant[] = Object.freeze([
  'every-failure-resolves-to-retry-recovery-or-termination',
  'retries-and-recovery-are-bounded-never-run-without-end',
  'terminated-or-cancelled-reaches-terminal-state-releases-resources',
  'never-continues-against-a-governance-decision-to-stop-escalate-or-refuse',
  'handling-a-failure-is-inert',
]);

/** What each failure-recovery invariant guarantees (ai/runtime/failure-recovery.md, "Invariants"). */
export const FAILURE_RECOVERY_INVARIANT_DESCRIPTIONS: Readonly<
  Record<FailureRecoveryInvariant, string>
> = Object.freeze({
  'every-failure-resolves-to-retry-recovery-or-termination':
    'Every failure resolves to retry, recovery, or termination; none is left undefined.',
  'retries-and-recovery-are-bounded-never-run-without-end':
    'Retries and recovery are bounded and never run without end.',
  'terminated-or-cancelled-reaches-terminal-state-releases-resources':
    'A terminated or cancelled execution reaches a terminal state and releases its resources.',
  'never-continues-against-a-governance-decision-to-stop-escalate-or-refuse':
    'The runtime never continues an execution against a governance decision to stop, escalate, or refuse.',
  'handling-a-failure-is-inert':
    'Handling a failure never changes ownership, authority, governance, or business truth.',
});
