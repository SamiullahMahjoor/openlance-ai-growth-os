/**
 * Autonomy boundaries governance (ai/governance/autonomy-boundaries.md,
 * OL-AI-GOVERNANCE-AUTONOMY-BOUNDARIES).
 *
 * The governance autonomy levels and the four bounds of autonomous action, expressed as immutable
 * truth and pure predicates (ADR-0020). This module states the classifications; it never enforces a
 * bound or decides an action, which is operational and owned by the operational namespaces and the
 * runtime.
 */

/**
 * A governance autonomy level: a classification of an agent's operational independence
 * (ai/governance/autonomy-boundaries.md, "Governance Autonomy Levels"), ordered by increasing
 * independence. An agent's level is granted through permission governance and changed only through
 * change governance; no agent raises its own.
 */
export type AutonomyLevel = 'assisted' | 'supervised' | 'bounded' | 'governed';

/** The autonomy levels in constitutional order, from least to most independent; frozen. */
export const AUTONOMY_LEVELS = Object.freeze([
  'assisted',
  'supervised',
  'bounded',
  'governed',
] as const) satisfies readonly AutonomyLevel[];

const AUTONOMY_RANK: Readonly<Record<AutonomyLevel, number>> = {
  assisted: 0,
  supervised: 1,
  bounded: 2,
  governed: 3,
};

/**
 * Whether autonomy level `a` grants at least as much independence as level `b`, by the
 * constitutional ordering of increasing operational independence.
 */
export const autonomyAtLeast = (a: AutonomyLevel, b: AutonomyLevel): boolean =>
  AUTONOMY_RANK[a] >= AUTONOMY_RANK[b];

/** The more independent of two autonomy levels. */
export const higherAutonomy = (a: AutonomyLevel, b: AutonomyLevel): AutonomyLevel =>
  AUTONOMY_RANK[a] >= AUTONOMY_RANK[b] ? a : b;

/**
 * A bound of autonomous action: the four categories the autonomy mandates define for every action
 * (ai/governance/autonomy-boundaries.md, "Mandates" - "the four bounds of autonomous action"): what
 * an agent may do, must not do, must escalate, and must refuse.
 */
export type AutonomyBound = 'may-do' | 'must-not-do' | 'must-escalate' | 'must-refuse';

/** The four bounds of autonomous action, in the order the constitution states them; frozen. */
export const AUTONOMY_BOUNDS = Object.freeze([
  'may-do',
  'must-not-do',
  'must-escalate',
  'must-refuse',
] as const) satisfies readonly AutonomyBound[];
