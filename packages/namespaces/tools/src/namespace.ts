/**
 * The Tools namespace, namespace-wide truth (ai/tools/README.md, OL-AI-TOOLS-README; ai/tools/tools.md,
 * OL-AI-TOOLS-TOOLS).
 *
 * The tool invariants every tool concern upholds, and the canonical inventory of the tool concerns, as
 * immutable definitions (ADR-0020). The namespace is the external-interaction model of the AI layer: it
 * defines what a tool is as an architectural capability through which an agent interacts with something
 * outside its own reasoning, and how a tool is identified, declared, selected, executed, validated,
 * composed, and evolved. It performs no reasoning, makes no decision, holds no permission, owns no
 * intelligence, and never orchestrates, schedules, or executes itself, and it defines no provider, model,
 * framework, protocol, interface, network, or code (ai/tools/README.md). The tool model is deterministic
 * and scalable: the same need, registered tools, declared capabilities, and governing rules produce the
 * same selection, composition, and execution ordering, and the model holds for one tool or many thousands
 * (ai/tools/tools.md).
 *
 * ADR-0024 classifies Tools as category 4 (Infrastructure Adapter; its "Tool adapters" example): the AI
 * layer's boundary to external interaction. Its executable surface is two pure ordering predicates over
 * tool-owned classifications - the lifecycle-phase and validation-check orderings - realized per ADR-0020
 * as an immutable stateless domain model with no IO; the tool interaction over a real outside system is
 * the runtime's.
 */

/**
 * A tool invariant: a permanent guarantee every tool document upholds and no tool may violate
 * (ai/tools/README.md, "Tool Invariants"). Every tool concern's principles instantiate these.
 */
export type ToolInvariant =
  | 'capability-never-actor-reasoner-or-implementation'
  | 'uniquely-identified-and-declares-capabilities'
  | 'performs-no-reasoning-makes-no-decision'
  | 'holds-no-permission-no-policy'
  | 'validated-before-execution'
  | 'selection-composition-execution-deterministic-and-bounded'
  | 'executed-by-runtime-owns-no-intelligence'
  | 'single-owned-technology-neutral-scalable';

/** The eight tool invariants, in constitutional order; frozen. */
export const TOOL_INVARIANTS: readonly ToolInvariant[] = Object.freeze([
  'capability-never-actor-reasoner-or-implementation',
  'uniquely-identified-and-declares-capabilities',
  'performs-no-reasoning-makes-no-decision',
  'holds-no-permission-no-policy',
  'validated-before-execution',
  'selection-composition-execution-deterministic-and-bounded',
  'executed-by-runtime-owns-no-intelligence',
  'single-owned-technology-neutral-scalable',
]);

/** The guarantee each tool invariant states (ai/tools/README.md, "Tool Invariants"). */
export const TOOL_INVARIANT_DESCRIPTIONS: Readonly<Record<ToolInvariant, string>> = Object.freeze({
  'capability-never-actor-reasoner-or-implementation':
    'A tool is an architectural capability for external interaction, never an actor, a reasoner, or an implementation.',
  'uniquely-identified-and-declares-capabilities':
    'A tool is uniquely identified and declares its capabilities, so it can be selected, composed, and validated deterministically.',
  'performs-no-reasoning-makes-no-decision':
    'A tool performs no reasoning and makes no decision; it interacts with something outside reasoning.',
  'holds-no-permission-no-policy':
    'A tool holds no permission and no policy; it is used only where an agent is permitted under ai/governance/ and within the limits owned by ai/safety/.',
  'validated-before-execution':
    'A tool is validated before execution, and it never executes when validation fails.',
  'selection-composition-execution-deterministic-and-bounded':
    'Tool selection, composition, and execution ordering are deterministic and bounded; no unbounded composition and no execution cycle are possible.',
  'executed-by-runtime-owns-no-intelligence':
    'A tool is executed by the runtime; it never orchestrates, schedules, or executes itself, and it owns no intelligence.',
  'single-owned-technology-neutral-scalable':
    'A tool is single-owned, technology-neutral, and scalable; each tool concern has exactly one owning document, and the model holds for one tool or many thousands.',
});

/**
 * A tool concern: one aspect of the tool model, each owned by exactly one document (ai/tools/tools.md,
 * "The Tool Concerns"). This is the namespace inventory identity; the model of each concern is owned by its
 * named document and this package's corresponding module.
 */
export type ToolConcern =
  | 'tool-architecture'
  | 'tool-lifecycle'
  | 'tool-capabilities'
  | 'tool-selection'
  | 'tool-execution'
  | 'tool-validation'
  | 'tool-composition'
  | 'tool-compatibility'
  | 'tool-boundaries'
  | 'tool-versioning';

/** The ten tool concerns, in inventory order; frozen. */
export const TOOL_CONCERNS: readonly ToolConcern[] = Object.freeze([
  'tool-architecture',
  'tool-lifecycle',
  'tool-capabilities',
  'tool-selection',
  'tool-execution',
  'tool-validation',
  'tool-composition',
  'tool-compatibility',
  'tool-boundaries',
  'tool-versioning',
]);

/** What each tool concern owns (ai/tools/tools.md, "The Tool Concerns"). */
export const TOOL_CONCERN_DESCRIPTIONS: Readonly<Record<ToolConcern, string>> = Object.freeze({
  'tool-architecture':
    'The architectural definition of a tool: its identity and the parts it is composed of.',
  'tool-lifecycle':
    'The phases of a tool, including registration, discovery, activation, the execution lifecycle, and retirement.',
  'tool-capabilities': 'The capability model: capability declaration and capability inheritance.',
  'tool-selection': 'The selection model: how a tool is chosen for a need, deterministically.',
  'tool-execution':
    'The execution model: how a tool interaction is structured, execution ordering within a tool interaction, and execution boundaries.',
  'tool-validation': 'Pre-execution validation of a tool, and validation ordering.',
  'tool-composition': 'The composition model: chaining of tools and reusable compositions.',
  'tool-compatibility':
    'The compatibility model: whether a tool is compatible with a need, and whether a tool version is compatible with a consumer.',
  'tool-boundaries': 'What tools never own, and where a tool stops.',
  'tool-versioning': 'Tool versioning, evolution, migration, and deprecation.',
});
