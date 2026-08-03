/**
 * Conclusion formation: how a reasoning forms a governed conclusion, and when a conclusion is
 * sufficiently supported to be formed (ai/reasoning/conclusion-formation.md,
 * OL-AI-REASONING-CONCLUSION-FORMATION).
 *
 * The Specification narrates a single procedure of forming a conclusion ("in the following way"): confirm
 * conclusion sufficiency, form within the rules, rest on the reasoning, yield the conclusion or its
 * governed absence. That is a procedure, not a closed taxonomy the model refers to by identity, so this
 * concern is definitions only (principles and invariants), consistent with the modeling rule recorded in
 * docs/implementation/13-retrieval.md section 4. It owns conclusion formation only; it never owns the
 * governance of a decision (ai/governance/decision-making.md) or the expression of a conclusion (the
 * Prompts namespace). The mechanism that forms a conclusion is the runtime's (ADR-0020).
 */

/**
 * A conclusion-formation principle: a permanent rule conclusion formation upholds
 * (ai/reasoning/conclusion-formation.md, "Principles").
 */
export type ConclusionFormationPrinciple =
  | 'formed-only-when-sufficiently-supported'
  | 'a-conclusion-is-governed'
  | 'a-conclusion-follows-from-the-reasoning'
  | 'no-conclusion-is-preferable-to-an-unsound-one';

/** The conclusion-formation principles, in constitutional order; frozen. */
export const CONCLUSION_FORMATION_PRINCIPLES: readonly ConclusionFormationPrinciple[] =
  Object.freeze([
    'formed-only-when-sufficiently-supported',
    'a-conclusion-is-governed',
    'a-conclusion-follows-from-the-reasoning',
    'no-conclusion-is-preferable-to-an-unsound-one',
  ]);

/** What each conclusion-formation principle requires (ai/reasoning/conclusion-formation.md, "Principles"). */
export const CONCLUSION_FORMATION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ConclusionFormationPrinciple, string>
> = Object.freeze({
  'formed-only-when-sufficiently-supported':
    'A reasoning forms a conclusion only when the reasoning sufficiently supports it, and the conclusion is then validated before it is accepted.',
  'a-conclusion-is-governed':
    'A conclusion is formed within the governing rules, and a conclusion that would violate them is not formed; the reasoning escalates instead.',
  'a-conclusion-follows-from-the-reasoning':
    'A conclusion rests on the validated, consistent reasoning that precedes it, never on a step outside it or an invented fact.',
  'no-conclusion-is-preferable-to-an-unsound-one':
    'Where a sufficient, governed conclusion cannot be formed, the reasoning yields no conclusion rather than an unsupported one.',
});

/**
 * A conclusion-formation invariant: a guarantee conclusion formation always upholds
 * (ai/reasoning/conclusion-formation.md, "Invariants").
 */
export type ConclusionFormationInvariant =
  | 'formed-only-when-sufficient-and-permitted-then-validated'
  | 'a-rule-violating-conclusion-is-not-formed'
  | 'a-conclusion-is-traceable-to-its-basis'
  | 'no-sufficient-governed-conclusion-yields-none'
  | 'forming-a-conclusion-is-inert';

/** The conclusion-formation invariants, in constitutional order; frozen. */
export const CONCLUSION_FORMATION_INVARIANTS: readonly ConclusionFormationInvariant[] =
  Object.freeze([
    'formed-only-when-sufficient-and-permitted-then-validated',
    'a-rule-violating-conclusion-is-not-formed',
    'a-conclusion-is-traceable-to-its-basis',
    'no-sufficient-governed-conclusion-yields-none',
    'forming-a-conclusion-is-inert',
  ]);

/** What each conclusion-formation invariant guarantees (ai/reasoning/conclusion-formation.md, "Invariants"). */
export const CONCLUSION_FORMATION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ConclusionFormationInvariant, string>
> = Object.freeze({
  'formed-only-when-sufficient-and-permitted-then-validated':
    'A conclusion is formed only when it is sufficiently supported by the reasoning and governance-permitted, and it is validated before it is accepted.',
  'a-rule-violating-conclusion-is-not-formed':
    'A conclusion that would violate the governing rules is not formed; the reasoning escalates.',
  'a-conclusion-is-traceable-to-its-basis':
    'A conclusion is traceable to the reasoning and the retrieved knowledge and assumptions it rests on.',
  'no-sufficient-governed-conclusion-yields-none':
    'Where no sufficient, governed conclusion can be formed, the reasoning yields none rather than an unsupported one.',
  'forming-a-conclusion-is-inert':
    'Forming a conclusion never executes, loads, retrieves, expresses, or changes ownership, authority, governance, or business truth.',
});
