/**
 * Tool lifecycle: the phases of a tool, from registration to retirement (ai/tools/tool-lifecycle.md,
 * OL-AI-TOOLS-TOOL-LIFECYCLE).
 *
 * A tool passes through a fixed order of phases; each phase precedes the next, and a tool is never used
 * outside activation and operation. This module defines the ordered phases, their principles, and their
 * invariants, plus the pure ordering predicate the document's ordering states. The execution model within
 * the operation phase is owned by ai/tools/tool-execution.md and the versioning of a tool definition by
 * ai/tools/tool-versioning.md, referenced not restated (ADR-0020).
 */

/**
 * A tool-lifecycle principle: a permanent rule the lifecycle upholds, each instantiating a tool invariant
 * (ai/tools/tool-lifecycle.md, "Principles").
 */
export type ToolLifecyclePrinciple =
  | 'a-tool-has-a-defined-beginning-and-end'
  | 'registration-precedes-availability'
  | 'every-execution-is-bounded'
  | 'retirement-is-clean';

/** The tool-lifecycle principles, in constitutional order; frozen. */
export const TOOL_LIFECYCLE_PRINCIPLES: readonly ToolLifecyclePrinciple[] = Object.freeze([
  'a-tool-has-a-defined-beginning-and-end',
  'registration-precedes-availability',
  'every-execution-is-bounded',
  'retirement-is-clean',
]);

/** What each tool-lifecycle principle requires (ai/tools/tool-lifecycle.md, "Principles"). */
export const TOOL_LIFECYCLE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ToolLifecyclePrinciple, string>
> = Object.freeze({
  'a-tool-has-a-defined-beginning-and-end':
    'A tool begins when it is registered and ends when it is retired; a tool is never used before activation or after retirement.',
  'registration-precedes-availability':
    'A tool exists and is discoverable before it is available to be selected and executed.',
  'every-execution-is-bounded':
    'A single tool execution has a defined beginning and end within the operation phase, so no tool execution runs unbounded.',
  'retirement-is-clean':
    'A retired tool is no longer selected or executed, and its retirement never disrupts a tool that remains.',
});

/**
 * A tool-lifecycle phase, in constitutional order from earliest to latest (ai/tools/tool-lifecycle.md,
 * "Specification"). The order is the document's; it is total and is exposed by {@link toolPhaseAtOrAfter}.
 */
export type ToolLifecyclePhase =
  'registration' | 'discovery' | 'activation' | 'execution-lifecycle' | 'retirement';

/** The tool-lifecycle phases, earliest to latest; frozen. */
export const TOOL_LIFECYCLE_PHASES: readonly ToolLifecyclePhase[] = Object.freeze([
  'registration',
  'discovery',
  'activation',
  'execution-lifecycle',
  'retirement',
]);

/** What each tool-lifecycle phase is (ai/tools/tool-lifecycle.md, "Specification"). */
export const TOOL_LIFECYCLE_PHASE_DESCRIPTIONS: Readonly<Record<ToolLifecyclePhase, string>> =
  Object.freeze({
    registration:
      'A tool is registered with its distinct identity under ai/tools/tool-architecture.md and its declared capabilities under ai/tools/tool-capabilities.md, so that it exists as a capability and is discoverable; registration records that the tool exists, and never activates or executes it.',
    discovery:
      'A registered tool is discoverable by its identity and declared capabilities, so that selection can find it; discovery finds a registered tool and never chooses one, which is owned by ai/tools/tool-selection.md.',
    activation:
      'A registered tool is activated, becoming available to be selected and executed; a tool is used only while active, and activation never widens its declared capabilities.',
    'execution-lifecycle':
      'While a tool is in operation, each use of it is a single tool execution with a defined beginning and end: it is validated under ai/tools/tool-validation.md, then executed under ai/tools/tool-execution.md and carried out by ai/runtime/, then completed; how the execution is modelled is owned by ai/tools/tool-execution.md.',
    retirement:
      'A tool is retired: it is deactivated, is no longer selected or executed, and is superseded or removed; retirement is orderly and never disrupts a tool that remains, and a composition that would have used a retired tool is corrected under ai/tools/tool-composition.md.',
  });

/**
 * A tool-lifecycle invariant: a guarantee the lifecycle always upholds (ai/tools/tool-lifecycle.md,
 * "Invariants").
 */
export type ToolLifecycleInvariant =
  | 'registered-before-discoverable-discoverable-before-activated'
  | 'used-only-while-active-activation-never-widens-capabilities'
  | 'each-execution-bounded-within-operation-phase'
  | 'retired-tool-not-selected-or-executed-retirement-non-disruptive'
  | 'a-lifecycle-transition-is-inert';

/** The tool-lifecycle invariants, in constitutional order; frozen. */
export const TOOL_LIFECYCLE_INVARIANTS: readonly ToolLifecycleInvariant[] = Object.freeze([
  'registered-before-discoverable-discoverable-before-activated',
  'used-only-while-active-activation-never-widens-capabilities',
  'each-execution-bounded-within-operation-phase',
  'retired-tool-not-selected-or-executed-retirement-non-disruptive',
  'a-lifecycle-transition-is-inert',
]);

/** What each tool-lifecycle invariant guarantees (ai/tools/tool-lifecycle.md, "Invariants"). */
export const TOOL_LIFECYCLE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ToolLifecycleInvariant, string>
> = Object.freeze({
  'registered-before-discoverable-discoverable-before-activated':
    'A tool is registered before it is discoverable, and discoverable before it is activated.',
  'used-only-while-active-activation-never-widens-capabilities':
    'A tool is used only while active, and activation never widens its declared capabilities.',
  'each-execution-bounded-within-operation-phase':
    'Each tool execution has a defined beginning and end within the operation phase.',
  'retired-tool-not-selected-or-executed-retirement-non-disruptive':
    'A retired tool is no longer selected or executed, and its retirement never disrupts a tool that remains.',
  'a-lifecycle-transition-is-inert':
    'A lifecycle transition never reasons, decides, executes, expresses, retrieves, persists, or changes ownership, authority, governance, or business truth.',
});

/**
 * The private rank of each lifecycle phase in the constitutional order (earliest = 0). Internal to the
 * ordering predicate; never exported.
 */
const TOOL_LIFECYCLE_PHASE_RANK: Readonly<Record<ToolLifecyclePhase, number>> = Object.freeze({
  registration: 0,
  discovery: 1,
  activation: 2,
  'execution-lifecycle': 3,
  retirement: 4,
});

/**
 * Whether lifecycle phase `a` is at or after lifecycle phase `b` in the constitutional phase order
 * (ai/tools/tool-lifecycle.md, "Specification"). Pure and total: it reads only the fixed order the document
 * defines and expresses that order verbatim. It states no policy of its own.
 */
export function toolPhaseAtOrAfter(a: ToolLifecyclePhase, b: ToolLifecyclePhase): boolean {
  return TOOL_LIFECYCLE_PHASE_RANK[a] >= TOOL_LIFECYCLE_PHASE_RANK[b];
}
