/**
 * Reasoning strategies: the architectural categories of reasoning
 * (ai/reasoning/reasoning-strategies.md, OL-AI-REASONING-REASONING-STRATEGIES).
 *
 * The categories are a closed taxonomy of the kinds of reasoning transformation. This document owns that
 * each category exists and what it is, never how any is performed: an algorithm, method, prompt, or chain
 * of thought that performs a category is implementation or expression owned outside the namespace. The
 * categories are unordered (a single reasoning may apply several, in the order owned by the workflow), so
 * this module carries no predicate; it is the immutable definition of the taxonomy (ADR-0020). The set is
 * extensible additively under the owning document.
 */

/**
 * A reasoning-strategies principle: a permanent rule the categories uphold
 * (ai/reasoning/reasoning-strategies.md, "Principles").
 */
export type ReasoningStrategyPrinciple =
  | 'categories-are-architectural-not-methods'
  | 'categories-are-explicit'
  | 'categories-are-governed-and-grounded'
  | 'categories-are-extensible';

/** The reasoning-strategies principles, in constitutional order; frozen. */
export const REASONING_STRATEGY_PRINCIPLES: readonly ReasoningStrategyPrinciple[] = Object.freeze([
  'categories-are-architectural-not-methods',
  'categories-are-explicit',
  'categories-are-governed-and-grounded',
  'categories-are-extensible',
]);

/** What each reasoning-strategies principle requires (ai/reasoning/reasoning-strategies.md, "Principles"). */
export const REASONING_STRATEGY_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ReasoningStrategyPrinciple, string>
> = Object.freeze({
  'categories-are-architectural-not-methods':
    'A category names a kind of reasoning transformation; it is never an algorithm, a technique, a prompt, or a chain of thought.',
  'categories-are-explicit':
    'Which category a reasoning applies is defined and traceable, never hidden.',
  'categories-are-governed-and-grounded':
    'Every category operates only on retrieved knowledge and stated assumptions, within the governing rules, and never invents facts.',
  'categories-are-extensible':
    'New architectural categories may be added over time, additively, without changing the ones defined here.',
});

/**
 * A reasoning strategy: one architectural category of reasoning transformation, in constitutional listing
 * order (ai/reasoning/reasoning-strategies.md, "Specification"). The categories are unordered as a set;
 * this listing order is the document's.
 */
export type ReasoningStrategy = 'decomposition' | 'synthesis' | 'comparison' | 'trade-off-analysis';

/** The reasoning strategies, in constitutional listing order; frozen. */
export const REASONING_STRATEGIES: readonly ReasoningStrategy[] = Object.freeze([
  'decomposition',
  'synthesis',
  'comparison',
  'trade-off-analysis',
]);

/** What each reasoning strategy is (ai/reasoning/reasoning-strategies.md, "Specification"). */
export const REASONING_STRATEGY_DESCRIPTIONS: Readonly<Record<ReasoningStrategy, string>> =
  Object.freeze({
    decomposition:
      'The category of reasoning that breaks a problem, question, or body of knowledge into its constituent parts, so each part can be reasoned about on its own.',
    synthesis:
      'The category of reasoning that integrates parts, findings, or sources into a coherent whole, so a conclusion can rest on the combined basis.',
    comparison:
      'The category of reasoning that examines two or more options, sources, or interpretations against defined considerations, so their similarities and differences are established.',
    'trade-off-analysis':
      'The category of reasoning that weighs the competing considerations among options, so the reasoning can account for what is gained and given up by each; it owns never a score, weight, or formula.',
  });

/**
 * A reasoning-strategies invariant: a guarantee the categories always uphold
 * (ai/reasoning/reasoning-strategies.md, "Invariants").
 */
export type ReasoningStrategyInvariant =
  | 'a-category-is-a-kind-not-a-method'
  | 'which-category-is-explicit'
  | 'a-category-is-grounded-and-governed'
  | 'applying-a-category-is-inert';

/** The reasoning-strategies invariants, in constitutional order; frozen. */
export const REASONING_STRATEGY_INVARIANTS: readonly ReasoningStrategyInvariant[] = Object.freeze([
  'a-category-is-a-kind-not-a-method',
  'which-category-is-explicit',
  'a-category-is-grounded-and-governed',
  'applying-a-category-is-inert',
]);

/** What each reasoning-strategies invariant guarantees (ai/reasoning/reasoning-strategies.md, "Invariants"). */
export const REASONING_STRATEGY_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ReasoningStrategyInvariant, string>
> = Object.freeze({
  'a-category-is-a-kind-not-a-method':
    'A category names a kind of reasoning transformation, never an algorithm, method, prompt, or chain of thought.',
  'which-category-is-explicit':
    'Which category a reasoning applies is explicit and traceable, never hidden.',
  'a-category-is-grounded-and-governed':
    'A category operates only on retrieved knowledge and stated assumptions, within the governing rules, and never invents facts.',
  'applying-a-category-is-inert':
    'Applying a category never executes, loads, retrieves, expresses, or changes ownership, authority, governance, or business truth.',
});
