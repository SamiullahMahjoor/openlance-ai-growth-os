/**
 * Context loading: how the runtime assembles the execution context by combining loaded knowledge, memory, and
 * the task into the working context an execution runs with (ai/runtime/context-loading.md,
 * OL-AI-RUNTIME-CONTEXT-LOADING).
 *
 * The Specification enumerates a closed set of the four kinds of input the runtime combines into the single
 * execution context. This module owns the combination only; each input is provided by its canonical owner
 * (loaded knowledge via ai/runtime/knowledge-resolution.md and the Retrieval namespace; memory by the Memory
 * namespace; the task admitted during the workflow; the governing context by ai/governance/) and is referenced
 * not recreated. The inputs carry no ordering and no predicate; this module is their immutable definition
 * (ADR-0020).
 */

/**
 * A context-loading principle: a permanent rule context assembly upholds, each instantiating a runtime
 * invariant (ai/runtime/context-loading.md, "Principles").
 */
export type ContextLoadingPrinciple =
  | 'the-runtime-assembles-it-does-not-source'
  | 'context-is-composed-from-canonical-sources'
  | 'higher-authority-frames-the-context'
  | 'context-is-assembled-after-loading-and-before-execution'
  | 'assembly-is-technology-neutral';

/** The context-loading principles, in constitutional order; frozen. */
export const CONTEXT_LOADING_PRINCIPLES: readonly ContextLoadingPrinciple[] = Object.freeze([
  'the-runtime-assembles-it-does-not-source',
  'context-is-composed-from-canonical-sources',
  'higher-authority-frames-the-context',
  'context-is-assembled-after-loading-and-before-execution',
  'assembly-is-technology-neutral',
]);

/** What each context-loading principle requires (ai/runtime/context-loading.md, "Principles"). */
export const CONTEXT_LOADING_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ContextLoadingPrinciple, string>
> = Object.freeze({
  'the-runtime-assembles-it-does-not-source':
    'The runtime combines what others provide, and never finds, stores, or authors the pieces.',
  'context-is-composed-from-canonical-sources':
    'Every piece of knowledge in the context is loaded from its canonical owner, never restated or invented.',
  'higher-authority-frames-the-context':
    'Foundational and higher-authority knowledge is assembled together with the knowledge it governs, so an execution never acts on a lower source without the higher one that governs it.',
  'context-is-assembled-after-loading-and-before-execution':
    'The context is complete before the task runs.',
  'assembly-is-technology-neutral':
    'It describes how the context is composed, never a store, format, or mechanism.',
});

/**
 * A context input: one of the four kinds of input the runtime combines into the execution context, in
 * constitutional listing order (ai/runtime/context-loading.md, "Specification"). The set is unordered; each
 * input is provided by its canonical owner.
 */
export type ContextInput = 'loaded-knowledge' | 'memory' | 'task' | 'governing-context';

/** The four kinds of input the runtime combines into the execution context, in listing order; frozen. */
export const CONTEXT_INPUTS: readonly ContextInput[] = Object.freeze([
  'loaded-knowledge',
  'memory',
  'task',
  'governing-context',
]);

/** What each context input is (ai/runtime/context-loading.md, "Specification"). */
export const CONTEXT_INPUT_DESCRIPTIONS: Readonly<Record<ContextInput, string>> = Object.freeze({
  'loaded-knowledge':
    'The required and contextual knowledge already loaded under ai/runtime/knowledge-resolution.md, sourced from the knowledge repository through the Retrieval namespace.',
  memory: 'The relevant memory provided by the Memory namespace for the session and execution.',
  task: 'The resolved task and its inputs, admitted during the execution workflow.',
  'governing-context':
    'The governance and higher-authority documents that bind the execution, so the context carries the rules and foundations the task is governed by.',
});

/**
 * A context-loading invariant: a guarantee context assembly always upholds (ai/runtime/context-loading.md,
 * "Invariants").
 */
export type ContextLoadingInvariant =
  | 'every-piece-loaded-from-canonical-owner-never-restated'
  | 'context-complete-before-the-execution-phase'
  | 'lower-authority-never-assembled-without-higher'
  | 'assembling-context-is-inert';

/** The context-loading invariants, in constitutional order; frozen. */
export const CONTEXT_LOADING_INVARIANTS: readonly ContextLoadingInvariant[] = Object.freeze([
  'every-piece-loaded-from-canonical-owner-never-restated',
  'context-complete-before-the-execution-phase',
  'lower-authority-never-assembled-without-higher',
  'assembling-context-is-inert',
]);

/** What each context-loading invariant guarantees (ai/runtime/context-loading.md, "Invariants"). */
export const CONTEXT_LOADING_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ContextLoadingInvariant, string>
> = Object.freeze({
  'every-piece-loaded-from-canonical-owner-never-restated':
    'Every piece of knowledge in the context is loaded from its canonical owner, never restated.',
  'context-complete-before-the-execution-phase':
    'The context is complete before the Execution phase begins.',
  'lower-authority-never-assembled-without-higher':
    'A lower-authority source is never assembled without the higher-authority source that governs it.',
  'assembling-context-is-inert':
    'Assembling context never changes ownership, authority, governance, or business truth.',
});
