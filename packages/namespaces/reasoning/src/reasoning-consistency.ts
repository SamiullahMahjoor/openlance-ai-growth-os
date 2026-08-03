/**
 * Reasoning consistency: the internal consistency of reasoning, contradiction detection and the absence
 * of conflicting conclusions (ai/reasoning/reasoning-consistency.md,
 * OL-AI-REASONING-REASONING-CONSISTENCY).
 *
 * The Specification narrates the process facets by which a reasoning is kept coherent (contradiction
 * detection, resolution or non-conclusion, no conflicting conclusions, coherence with the basis); these
 * are heterogeneous facets of a runtime process, not a closed taxonomy the model refers to by identity,
 * so this concern is definitions only (principles and invariants), consistent with the modeling rule
 * recorded in docs/implementation/13-retrieval.md section 4. It owns internal consistency only; it never
 * owns the grounding and sufficiency of reasoning (ai/reasoning/reasoning-validation.md) or the
 * governance of decisions (ai/governance/decision-making.md). The mechanism that detects a contradiction
 * is the runtime's (ADR-0020).
 */

/**
 * A reasoning-consistency principle: a permanent rule reasoning consistency upholds
 * (ai/reasoning/reasoning-consistency.md, "Principles").
 */
export type ReasoningConsistencyPrinciple =
  | 'reasoning-contains-no-contradiction'
  | 'the-same-inputs-yield-one-conclusion'
  | 'contradiction-is-surfaced-not-buried'
  | 'consistency-is-preserved-across-the-reasoning';

/** The reasoning-consistency principles, in constitutional order; frozen. */
export const REASONING_CONSISTENCY_PRINCIPLES: readonly ReasoningConsistencyPrinciple[] =
  Object.freeze([
    'reasoning-contains-no-contradiction',
    'the-same-inputs-yield-one-conclusion',
    'contradiction-is-surfaced-not-buried',
    'consistency-is-preserved-across-the-reasoning',
  ]);

/** What each reasoning-consistency principle requires (ai/reasoning/reasoning-consistency.md, "Principles"). */
export const REASONING_CONSISTENCY_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ReasoningConsistencyPrinciple, string>
> = Object.freeze({
  'reasoning-contains-no-contradiction':
    'A reasoning does not hold two steps or findings that contradict each other.',
  'the-same-inputs-yield-one-conclusion':
    'From the same task, retrieved knowledge, and governing rules, a reasoning produces one conclusion, never conflicting ones.',
  'contradiction-is-surfaced-not-buried':
    'A contradiction encountered in reasoning is detected and made explicit, so it is resolved or the reasoning does not conclude.',
  'consistency-is-preserved-across-the-reasoning':
    'Every part of a reasoning is coherent with every other part and with the retrieved knowledge it rests on.',
});

/**
 * A reasoning-consistency invariant: a guarantee reasoning consistency always upholds
 * (ai/reasoning/reasoning-consistency.md, "Invariants").
 */
export type ReasoningConsistencyInvariant =
  | 'no-contradiction-among-steps-findings-and-basis'
  | 'exactly-one-conclusion-per-inputs'
  | 'a-contradiction-is-resolved-or-no-conclusion'
  | 'maintaining-consistency-is-inert';

/** The reasoning-consistency invariants, in constitutional order; frozen. */
export const REASONING_CONSISTENCY_INVARIANTS: readonly ReasoningConsistencyInvariant[] =
  Object.freeze([
    'no-contradiction-among-steps-findings-and-basis',
    'exactly-one-conclusion-per-inputs',
    'a-contradiction-is-resolved-or-no-conclusion',
    'maintaining-consistency-is-inert',
  ]);

/** What each reasoning-consistency invariant guarantees (ai/reasoning/reasoning-consistency.md, "Invariants"). */
export const REASONING_CONSISTENCY_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ReasoningConsistencyInvariant, string>
> = Object.freeze({
  'no-contradiction-among-steps-findings-and-basis':
    'A reasoning holds no contradiction among its steps, findings, and basis.',
  'exactly-one-conclusion-per-inputs':
    'A reasoning yields exactly one conclusion for a given set of inputs, never conflicting ones.',
  'a-contradiction-is-resolved-or-no-conclusion':
    'A detected contradiction is resolved or the reasoning does not conclude.',
  'maintaining-consistency-is-inert':
    'Maintaining consistency never executes, loads, retrieves, expresses, or changes ownership, authority, governance, or business truth.',
});
