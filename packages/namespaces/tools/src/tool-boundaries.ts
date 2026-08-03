/**
 * Tool boundaries: what tools never own, and where a tool stops (ai/tools/tool-boundaries.md,
 * OL-AI-TOOLS-TOOL-BOUNDARIES).
 *
 * The Specification enumerates a closed set of the named architectural boundaries a tool operates within.
 * This module owns the boundaries; the rules that set them are owned by ai/governance/ and ai/safety/, and
 * the concerns beyond them by their namespaces. A use that would cross any boundary does not proceed; it is
 * refused (ai/safety/refusal-model.md) or escalated (ai/governance/escalation.md). The boundaries carry no
 * ordering and no predicate; how a boundary is enforced is the runtime's, and this module is their
 * immutable definition (ADR-0020).
 */

/**
 * A tool-boundaries principle: a permanent rule the boundaries uphold, each instantiating a tool invariant
 * (ai/tools/tool-boundaries.md, "Principles").
 */
export type ToolBoundaryPrinciple =
  | 'a-tool-interacts-it-does-not-reason-decide-or-execute-itself'
  | 'a-tool-holds-no-authority-of-its-own'
  | 'a-tool-carries-no-truth-and-no-intelligence'
  | 'a-tool-stays-within-governance-and-safety';

/** The tool-boundaries principles, in constitutional order; frozen. */
export const TOOL_BOUNDARY_PRINCIPLES: readonly ToolBoundaryPrinciple[] = Object.freeze([
  'a-tool-interacts-it-does-not-reason-decide-or-execute-itself',
  'a-tool-holds-no-authority-of-its-own',
  'a-tool-carries-no-truth-and-no-intelligence',
  'a-tool-stays-within-governance-and-safety',
]);

/** What each tool-boundaries principle requires (ai/tools/tool-boundaries.md, "Principles"). */
export const TOOL_BOUNDARY_PRINCIPLE_DESCRIPTIONS: Readonly<Record<ToolBoundaryPrinciple, string>> =
  Object.freeze({
    'a-tool-interacts-it-does-not-reason-decide-or-execute-itself':
      "A tool reaches outside the agent's reasoning and stops there; reasoning, decision, and execution belong to other namespaces.",
    'a-tool-holds-no-authority-of-its-own':
      'A tool owns no permission and no policy; it is used only where an agent is permitted, under governance and within safety.',
    'a-tool-carries-no-truth-and-no-intelligence':
      "A tool carries no business truth and produces no intelligence of its own; the outside effect is the outside system's own.",
    'a-tool-stays-within-governance-and-safety':
      'A tool is selected, validated, executed, and composed only within the rules governance sets and the limits safety allows.',
  });

/**
 * A tool boundary: one architectural boundary a tool operates within, in constitutional listing order
 * (ai/tools/tool-boundaries.md, "Specification"). The set is unordered.
 */
export type ToolBoundary =
  | 'reasoning-and-decision'
  | 'authority'
  | 'execution'
  | 'provider-and-intelligence'
  | 'truth'
  | 'implementation';

/** The tool boundaries, in constitutional listing order; frozen. */
export const TOOL_BOUNDARIES: readonly ToolBoundary[] = Object.freeze([
  'reasoning-and-decision',
  'authority',
  'execution',
  'provider-and-intelligence',
  'truth',
  'implementation',
]);

/** What each tool boundary is (ai/tools/tool-boundaries.md, "Specification"). */
export const TOOL_BOUNDARY_DESCRIPTIONS: Readonly<Record<ToolBoundary, string>> = Object.freeze({
  'reasoning-and-decision':
    'A tool performs no reasoning and makes no decision; reasoning is owned by ai/reasoning/, and the decision to use a tool and the reasoning behind it are formed outside the tool. A tool is invoked; it never chooses to act.',
  authority:
    'A tool holds no permission and no policy; whether a tool may be used is owned by the permissions at ai/agents/agent-permissions.md and the rules at ai/governance/, and a tool never grants, holds, or escalates authority.',
  execution:
    'A tool is executed by ai/runtime/, bounded by ai/safety/ and ai/runtime/execution-boundaries.md; a tool never orchestrates, schedules, or executes itself, and it never networks or defines a protocol or interface, which are implementation.',
  'provider-and-intelligence':
    'A tool is not a provider and produces no intelligence; the abstraction over a source of intelligence is owned by ai/providers/, a tool abstracts an external interaction, and an agent composes both. The intelligence and the outside effect are outside this namespace.',
  truth:
    "A tool carries no business truth and never owns, restates, amends, or becomes it (owned by the knowledge repository); the outside system a tool interacts with is that system's own, and its output is judged by the Evaluation namespace, not owned here.",
  implementation:
    'A tool is an architectural capability, never a provider, a model, a framework, a protocol, an interface, a network, or code, and this namespace names none.',
});

/**
 * A tool-boundaries invariant: a guarantee the boundaries always uphold (ai/tools/tool-boundaries.md,
 * "Invariants").
 */
export type ToolBoundaryInvariant =
  | 'performs-no-reasoning-makes-no-decision'
  | 'holds-no-permission-no-policy-never-grants-or-escalates-authority'
  | 'never-orchestrates-schedules-executes-itself-carries-no-truth-or-intelligence'
  | 'used-only-within-governance-rules-and-safety-limits'
  | 'enforcing-a-boundary-is-inert';

/** The tool-boundaries invariants, in constitutional order; frozen. */
export const TOOL_BOUNDARY_INVARIANTS: readonly ToolBoundaryInvariant[] = Object.freeze([
  'performs-no-reasoning-makes-no-decision',
  'holds-no-permission-no-policy-never-grants-or-escalates-authority',
  'never-orchestrates-schedules-executes-itself-carries-no-truth-or-intelligence',
  'used-only-within-governance-rules-and-safety-limits',
  'enforcing-a-boundary-is-inert',
]);

/** What each tool-boundaries invariant guarantees (ai/tools/tool-boundaries.md, "Invariants"). */
export const TOOL_BOUNDARY_INVARIANT_DESCRIPTIONS: Readonly<Record<ToolBoundaryInvariant, string>> =
  Object.freeze({
    'performs-no-reasoning-makes-no-decision':
      'A tool performs no reasoning and makes no decision.',
    'holds-no-permission-no-policy-never-grants-or-escalates-authority':
      'A tool holds no permission and no policy, and never grants or escalates authority.',
    'never-orchestrates-schedules-executes-itself-carries-no-truth-or-intelligence':
      'A tool never orchestrates, schedules, or executes itself, and carries no truth and no intelligence.',
    'used-only-within-governance-rules-and-safety-limits':
      'A tool is used only within the rules governance sets and the limits safety allows.',
    'enforcing-a-boundary-is-inert':
      'Enforcing a boundary never changes ownership, authority, governance, or business truth.',
  });
