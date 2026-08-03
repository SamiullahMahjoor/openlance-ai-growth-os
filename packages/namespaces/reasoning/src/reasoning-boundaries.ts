/**
 * Reasoning boundaries: what reasoning never owns, and where a reasoning stops
 * (ai/reasoning/reasoning-boundaries.md, OL-AI-REASONING-REASONING-BOUNDARIES).
 *
 * The Specification enumerates a closed set of the named architectural boundaries a reasoning operates
 * within. This module owns the boundaries; the rules that set them are owned by ai/governance/, and the
 * concerns beyond them by their namespaces. A reasoning that would cross any boundary does not proceed; it
 * is refused or escalated (ai/governance/escalation.md). The boundaries carry no ordering and no
 * predicate; how a boundary is enforced is the runtime's, and this module is their immutable definition
 * (ADR-0020).
 */

/**
 * A reasoning-boundaries principle: a permanent rule the boundaries uphold
 * (ai/reasoning/reasoning-boundaries.md, "Principles").
 */
export type ReasoningBoundaryPrinciple =
  | 'reasoning-transforms-it-does-not-execute-load-or-express'
  | 'reasoning-consumes-it-never-owns'
  | 'reasoning-is-explicit-it-is-never-hidden'
  | 'reasoning-stays-within-governance';

/** The reasoning-boundaries principles, in constitutional order; frozen. */
export const REASONING_BOUNDARY_PRINCIPLES: readonly ReasoningBoundaryPrinciple[] = Object.freeze([
  'reasoning-transforms-it-does-not-execute-load-or-express',
  'reasoning-consumes-it-never-owns',
  'reasoning-is-explicit-it-is-never-hidden',
  'reasoning-stays-within-governance',
]);

/** What each reasoning-boundaries principle requires (ai/reasoning/reasoning-boundaries.md, "Principles"). */
export const REASONING_BOUNDARY_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ReasoningBoundaryPrinciple, string>
> = Object.freeze({
  'reasoning-transforms-it-does-not-execute-load-or-express':
    'A reasoning produces a governed conclusion and stops; execution, loading, retrieval, and expression belong to other namespaces.',
  'reasoning-consumes-it-never-owns':
    'A reasoning consumes retrieved knowledge and governing rules and owns neither truth nor rules.',
  'reasoning-is-explicit-it-is-never-hidden':
    'A reasoning holds no hidden step, and it never becomes an algorithm or a chain of thought.',
  'reasoning-stays-within-governance':
    'A reasoning concludes only within the governing rules and escalates rather than exceed them.',
});

/**
 * A reasoning boundary: one architectural boundary a reasoning operates within, in constitutional listing
 * order (ai/reasoning/reasoning-boundaries.md, "Specification"). The set is unordered.
 */
export type ReasoningBoundary =
  'transformation' | 'knowledge' | 'governance' | 'expression' | 'implementation';

/** The reasoning boundaries, in constitutional listing order; frozen. */
export const REASONING_BOUNDARIES: readonly ReasoningBoundary[] = Object.freeze([
  'transformation',
  'knowledge',
  'governance',
  'expression',
  'implementation',
]);

/** What each reasoning boundary is (ai/reasoning/reasoning-boundaries.md, "Specification"). */
export const REASONING_BOUNDARY_DESCRIPTIONS: Readonly<Record<ReasoningBoundary, string>> =
  Object.freeze({
    transformation:
      'A reasoning frames, transforms, concludes, and validates, and stops at a validated governed conclusion or a governed absence of one; it never executes, orchestrates, or schedules, which are owned by ai/runtime/.',
    knowledge:
      'A reasoning reasons over retrieved knowledge and never discovers, selects, loads, or owns it (ai/retrieval/ and the knowledge repository); it never restates, caches as truth, invents, or amends business truth.',
    governance:
      'A reasoning applies the governing rules and never defines them (decision governance, escalation, risk, and permission are owned by ai/governance/); it escalates rather than conclude outside the rules.',
    expression:
      'A reasoning is expressed as prompts and executed by providers, and applied by agents, owned by their namespaces; it never constructs a prompt, selects a model, or acts.',
    implementation:
      'A reasoning is a model of cognition, never an algorithm, a chain of thought, a hidden reasoning process, a method, a provider, a model, a protocol, or code.',
  });

/**
 * A reasoning-boundaries invariant: a guarantee the boundaries always uphold
 * (ai/reasoning/reasoning-boundaries.md, "Invariants").
 */
export type ReasoningBoundaryInvariant =
  | 'produces-a-conclusion-never-executes-loads-retrieves-or-expresses'
  | 'never-owns-restates-invents-or-amends-truth-or-a-rule'
  | 'holds-no-hidden-step-and-is-never-an-algorithm'
  | 'concludes-only-within-the-rules-and-escalates'
  | 'enforcing-a-boundary-is-inert';

/** The reasoning-boundaries invariants, in constitutional order; frozen. */
export const REASONING_BOUNDARY_INVARIANTS: readonly ReasoningBoundaryInvariant[] = Object.freeze([
  'produces-a-conclusion-never-executes-loads-retrieves-or-expresses',
  'never-owns-restates-invents-or-amends-truth-or-a-rule',
  'holds-no-hidden-step-and-is-never-an-algorithm',
  'concludes-only-within-the-rules-and-escalates',
  'enforcing-a-boundary-is-inert',
]);

/** What each reasoning-boundaries invariant guarantees (ai/reasoning/reasoning-boundaries.md, "Invariants"). */
export const REASONING_BOUNDARY_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ReasoningBoundaryInvariant, string>
> = Object.freeze({
  'produces-a-conclusion-never-executes-loads-retrieves-or-expresses':
    'A reasoning produces a governed conclusion and never executes, loads, retrieves, or expresses.',
  'never-owns-restates-invents-or-amends-truth-or-a-rule':
    'A reasoning never owns, restates, invents, or amends business truth, and never owns a governance rule.',
  'holds-no-hidden-step-and-is-never-an-algorithm':
    'A reasoning holds no hidden step and never becomes an algorithm or a chain of thought.',
  'concludes-only-within-the-rules-and-escalates':
    'A reasoning concludes only within the governing rules and escalates rather than exceed them.',
  'enforcing-a-boundary-is-inert':
    'Enforcing a boundary never changes ownership, authority, governance, or business truth.',
});
