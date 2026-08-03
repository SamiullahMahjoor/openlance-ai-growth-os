/**
 * Session lifecycle: the lifecycle of a session, the container within which executions run, from
 * establishment to closure (ai/runtime/session-lifecycle.md, OL-AI-RUNTIME-SESSION-LIFECYCLE).
 *
 * A session passes through defined lifecycle phases, from establishment through active to closure. This
 * module defines the ordered phases, their principles, and their invariants, plus the pure ordering predicate
 * over them. The lifecycle of a single execution within a session is owned by
 * ai/runtime/execution-lifecycle.md and persistence beyond a session by the Memory namespace, referenced not
 * restated (ADR-0020).
 */

/**
 * A session-lifecycle principle: a permanent rule the session lifecycle upholds, each instantiating a runtime
 * invariant (ai/runtime/session-lifecycle.md, "Principles").
 */
export type SessionLifecyclePrinciple =
  | 'a-session-is-a-bounded-container'
  | 'executions-run-within-a-session'
  | 'sessions-terminate-cleanly'
  | 'the-session-owns-no-persistence';

/** The session-lifecycle principles, in constitutional order; frozen. */
export const SESSION_LIFECYCLE_PRINCIPLES: readonly SessionLifecyclePrinciple[] = Object.freeze([
  'a-session-is-a-bounded-container',
  'executions-run-within-a-session',
  'sessions-terminate-cleanly',
  'the-session-owns-no-persistence',
]);

/** What each session-lifecycle principle requires (ai/runtime/session-lifecycle.md, "Principles"). */
export const SESSION_LIFECYCLE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<SessionLifecyclePrinciple, string>
> = Object.freeze({
  'a-session-is-a-bounded-container':
    'A session is established, holds executions, and is closed; it never persists unbounded.',
  'executions-run-within-a-session':
    'Every execution belongs to exactly one session and inherits its scope and grant.',
  'sessions-terminate-cleanly':
    'A session always reaches closure and releases what it held, including its executions.',
  'the-session-owns-no-persistence':
    'Any state that outlives a session is owned by the Memory namespace, not by the session itself.',
});

/**
 * A session-lifecycle phase, in constitutional order from earliest to latest
 * (ai/runtime/session-lifecycle.md, "Specification"). The order is the document's ("from establishment to
 * closure"); it is total and is exposed by {@link sessionPhaseAtOrAfter}.
 */
export type SessionLifecyclePhase = 'establishment' | 'active' | 'closure';

/** The session-lifecycle phases, earliest to latest; frozen. */
export const SESSION_LIFECYCLE_PHASES: readonly SessionLifecyclePhase[] = Object.freeze([
  'establishment',
  'active',
  'closure',
]);

/** What each session-lifecycle phase is (ai/runtime/session-lifecycle.md, "Specification"). */
export const SESSION_LIFECYCLE_PHASE_DESCRIPTIONS: Readonly<Record<SessionLifecyclePhase, string>> =
  Object.freeze({
    establishment:
      'A session is created and its scope, grant, and governing context are established, under the governance owned by ai/governance/.',
    active:
      'The session holds one or more executions over time; each execution runs its own lifecycle within the session, and the session sustains the shared scope they run within.',
    closure:
      'The session is closed: its open executions are brought to a terminal state, its resources are released, and any state meant to outlive it is handed to the Memory namespace before closure completes.',
  });

/**
 * A session-lifecycle invariant: a guarantee the session lifecycle always upholds
 * (ai/runtime/session-lifecycle.md, "Invariants").
 */
export type SessionLifecycleInvariant =
  | 'one-lifecycle-per-session'
  | 'every-execution-belongs-to-exactly-one-session'
  | 'closing-brings-executions-terminal-releases-resources'
  | 'session-never-persists-state-on-its-own'
  | 'session-lifecycle-is-inert';

/** The session-lifecycle invariants, in constitutional order; frozen. */
export const SESSION_LIFECYCLE_INVARIANTS: readonly SessionLifecycleInvariant[] = Object.freeze([
  'one-lifecycle-per-session',
  'every-execution-belongs-to-exactly-one-session',
  'closing-brings-executions-terminal-releases-resources',
  'session-never-persists-state-on-its-own',
  'session-lifecycle-is-inert',
]);

/** What each session-lifecycle invariant guarantees (ai/runtime/session-lifecycle.md, "Invariants"). */
export const SESSION_LIFECYCLE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<SessionLifecycleInvariant, string>
> = Object.freeze({
  'one-lifecycle-per-session':
    'A session holds exactly one lifecycle, from one establishment to one closure.',
  'every-execution-belongs-to-exactly-one-session':
    'Every execution belongs to exactly one session.',
  'closing-brings-executions-terminal-releases-resources':
    'Closing a session brings all its executions to a terminal state and releases its resources.',
  'session-never-persists-state-on-its-own':
    'A session never persists state on its own; persistence beyond a session is owned by the Memory namespace.',
  'session-lifecycle-is-inert':
    'The session lifecycle never changes ownership, authority, governance, or business truth.',
});

/**
 * The private rank of each session phase in the constitutional order (earliest = 0). Internal to the ordering
 * predicate; never exported.
 */
const SESSION_LIFECYCLE_PHASE_RANK: Readonly<Record<SessionLifecyclePhase, number>> = Object.freeze(
  {
    establishment: 0,
    active: 1,
    closure: 2,
  },
);

/**
 * Whether session phase `a` is at or after session phase `b` in the constitutional phase order
 * (ai/runtime/session-lifecycle.md, "Specification"). Pure and total: it reads only the fixed order the
 * document defines and expresses that order verbatim. It states no policy of its own.
 */
export function sessionPhaseAtOrAfter(a: SessionLifecyclePhase, b: SessionLifecyclePhase): boolean {
  return SESSION_LIFECYCLE_PHASE_RANK[a] >= SESSION_LIFECYCLE_PHASE_RANK[b];
}
