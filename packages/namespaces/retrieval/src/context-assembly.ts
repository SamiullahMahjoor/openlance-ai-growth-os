/**
 * Context assembly (ai/retrieval/context-assembly.md, OL-AI-RETRIEVAL-CONTEXT-ASSEMBLY).
 *
 * How the prioritized knowledge set is assembled into the single, coherent retrieval result the runtime
 * loads, as immutable definitions (ADR-0020). This concern owns the assembly of the retrieval result
 * only; it never assembles the execution context (which combines loaded knowledge, memory, and the task
 * and is owned by ai/runtime/context-loading.md). Composing a concrete result is a runtime evaluation
 * this concern does not own; it is deferred to the runtime. This concern states what the retrieval
 * result is and the invariants it always satisfies. Retrieval assembles the knowledge to load; the
 * runtime loads it and assembles the execution context.
 */

/**
 * A context-assembly principle (ai/retrieval/context-assembly.md, "Principles"). Each instantiates a
 * retrieval invariant owned by ai/retrieval/README.md.
 */
export type ContextAssemblyPrinciple =
  | 'produces-determination-not-truth'
  | 'preserves-authority-and-order'
  | 'preserves-completeness'
  | 'by-canonical-reference';

/** The four context-assembly principles, in constitutional order; frozen. */
export const CONTEXT_ASSEMBLY_PRINCIPLES: readonly ContextAssemblyPrinciple[] = Object.freeze([
  'produces-determination-not-truth',
  'preserves-authority-and-order',
  'preserves-completeness',
  'by-canonical-reference',
]);

/** The statement each context-assembly principle makes (ai/retrieval/context-assembly.md). */
export const CONTEXT_ASSEMBLY_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ContextAssemblyPrinciple, string>
> = Object.freeze({
  'produces-determination-not-truth':
    'The retrieval result names the knowledge to load and its order; it never contains, restates, or alters the truth itself.',
  'preserves-authority-and-order':
    'The result carries the priority order established by prioritization, so the runtime loads foundational and governing knowledge first.',
  'preserves-completeness':
    'The result contains the whole dependency-complete, minimum sufficient set, and nothing beyond it.',
  'by-canonical-reference':
    'The result names each piece by its single canonical owner, never by a copy.',
});

/**
 * A context-assembly invariant (ai/retrieval/context-assembly.md, "Invariants"): a guarantee that always
 * holds for the assembly of the retrieval result.
 */
export type ContextAssemblyInvariant =
  | 'result-is-prioritized-complete-minimal'
  | 'each-piece-named-by-owner'
  | 'names-not-truth-or-context'
  | 'assembling-is-inert';

/** The four context-assembly invariants, in constitutional order; frozen. */
export const CONTEXT_ASSEMBLY_INVARIANTS: readonly ContextAssemblyInvariant[] = Object.freeze([
  'result-is-prioritized-complete-minimal',
  'each-piece-named-by-owner',
  'names-not-truth-or-context',
  'assembling-is-inert',
]);

/** The guarantee each context-assembly invariant states (ai/retrieval/context-assembly.md). */
export const CONTEXT_ASSEMBLY_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ContextAssemblyInvariant, string>
> = Object.freeze({
  'result-is-prioritized-complete-minimal':
    'The retrieval result contains exactly the prioritized, dependency-complete, minimum sufficient set, in priority order.',
  'each-piece-named-by-owner':
    'Each piece in the result is named by its single canonical owner, never restated.',
  'names-not-truth-or-context':
    'The result names the knowledge to load; it never contains the truth or the execution context.',
  'assembling-is-inert':
    'Assembling the result never loads knowledge, never assembles the execution context, and never changes ownership, authority, governance, or business truth.',
});
