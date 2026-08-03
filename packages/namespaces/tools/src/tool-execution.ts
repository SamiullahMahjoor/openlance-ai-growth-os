/**
 * Tool execution: how a single tool interaction is structured, its ordering, and its boundaries
 * (ai/tools/tool-execution.md, OL-AI-TOOLS-TOOL-EXECUTION).
 *
 * The Specification narrates the execution model as heterogeneous facets (the execution model, execution
 * ordering, execution boundaries, validated and governed). The concern owns "execution ordering", but the
 * document states the steps within a tool execution "follow a defined, acyclic order" WITHOUT enumerating
 * the steps; there is no named ordered set to model, so - as with Safety's ordered-but-unnamed risk levels -
 * no step classification and no ordering predicate are created, and the acyclicity is stated as prose in the
 * principles and invariants. This concern is therefore definitions only, consistent with the modeling rule
 * recorded in docs/implementation/13-retrieval.md section 4. The scheduling and orchestration are owned by
 * ai/runtime/ and the chaining of tools by ai/tools/tool-composition.md, referenced not restated (ADR-0020).
 */

/**
 * A tool-execution principle: a permanent rule the execution model upholds, each instantiating a tool
 * invariant (ai/tools/tool-execution.md, "Principles").
 */
export type ToolExecutionPrinciple =
  | 'execution-is-a-model-not-a-schedule'
  | 'validation-precedes-execution'
  | 'execution-is-bounded'
  | 'execution-ordering-is-acyclic';

/** The tool-execution principles, in constitutional order; frozen. */
export const TOOL_EXECUTION_PRINCIPLES: readonly ToolExecutionPrinciple[] = Object.freeze([
  'execution-is-a-model-not-a-schedule',
  'validation-precedes-execution',
  'execution-is-bounded',
  'execution-ordering-is-acyclic',
]);

/** What each tool-execution principle requires (ai/tools/tool-execution.md, "Principles"). */
export const TOOL_EXECUTION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ToolExecutionPrinciple, string>
> = Object.freeze({
  'execution-is-a-model-not-a-schedule':
    'This document defines what a tool execution is and how it is ordered; the scheduling, orchestration, and carrying out are owned by ai/runtime/.',
  'validation-precedes-execution':
    'A tool is validated under ai/tools/tool-validation.md before it executes, and it never executes when validation fails.',
  'execution-is-bounded':
    'A tool execution stays within its declared capabilities and the limits owned by ai/safety/, and never exceeds them.',
  'execution-ordering-is-acyclic':
    'The steps within a tool execution follow a defined, acyclic order, so no execution cycle is possible.',
});

/**
 * A tool-execution invariant: a guarantee the execution model always upholds (ai/tools/tool-execution.md,
 * "Invariants").
 */
export type ToolExecutionInvariant =
  | 'validated-before-executes-never-executes-when-validation-fails'
  | 'execution-stays-within-capabilities-and-safety-runtime-limits'
  | 'steps-follow-defined-acyclic-order-no-execution-cycle'
  | 'execution-crossing-a-boundary-refused-or-degraded-never-forced'
  | 'modelling-an-execution-is-inert';

/** The tool-execution invariants, in constitutional order; frozen. */
export const TOOL_EXECUTION_INVARIANTS: readonly ToolExecutionInvariant[] = Object.freeze([
  'validated-before-executes-never-executes-when-validation-fails',
  'execution-stays-within-capabilities-and-safety-runtime-limits',
  'steps-follow-defined-acyclic-order-no-execution-cycle',
  'execution-crossing-a-boundary-refused-or-degraded-never-forced',
  'modelling-an-execution-is-inert',
]);

/** What each tool-execution invariant guarantees (ai/tools/tool-execution.md, "Invariants"). */
export const TOOL_EXECUTION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ToolExecutionInvariant, string>
> = Object.freeze({
  'validated-before-executes-never-executes-when-validation-fails':
    'A tool is validated before it executes and never executes when validation fails.',
  'execution-stays-within-capabilities-and-safety-runtime-limits':
    "A tool execution stays within the tool's declared capabilities and the limits owned by ai/safety/ and ai/runtime/.",
  'steps-follow-defined-acyclic-order-no-execution-cycle':
    'The steps within a tool execution follow a defined, acyclic order, so no execution cycle is possible.',
  'execution-crossing-a-boundary-refused-or-degraded-never-forced':
    'An execution that would cross a boundary is refused or degraded, never forced.',
  'modelling-an-execution-is-inert':
    'Modelling an execution never schedules, orchestrates, reasons, decides, expresses, retrieves, persists, or changes ownership, authority, governance, or business truth.',
});
