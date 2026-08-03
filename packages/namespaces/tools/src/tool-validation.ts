/**
 * Tool validation: pre-execution validation of a tool, and validation ordering
 * (ai/tools/tool-validation.md, OL-AI-TOOLS-TOOL-VALIDATION).
 *
 * A chosen tool is validated through a fixed order of checks, from permission and safety first to
 * compatibility last; a tool that fails any check does not execute. The checks are conjunctive (all must
 * hold) and ordered, and this concern explicitly owns the ordering ("validation ordering"). This module
 * defines the ordered checks, their principles, and their invariants, plus the pure ordering predicate the
 * document's ordering states. The governance rules the checks apply and the hazards they check for are
 * owned by ai/governance/ and ai/safety/, applied not restated (ADR-0020).
 */

/**
 * A tool-validation principle: a permanent rule tool validation upholds, each instantiating a tool
 * invariant (ai/tools/tool-validation.md, "Principles").
 */
export type ToolValidationPrinciple =
  | 'validation-precedes-execution'
  | 'validation-is-ordered'
  | 'permission-and-safety-are-checked-first'
  | 'failure-is-safe';

/** The tool-validation principles, in constitutional order; frozen. */
export const TOOL_VALIDATION_PRINCIPLES: readonly ToolValidationPrinciple[] = Object.freeze([
  'validation-precedes-execution',
  'validation-is-ordered',
  'permission-and-safety-are-checked-first',
  'failure-is-safe',
]);

/** What each tool-validation principle requires (ai/tools/tool-validation.md, "Principles"). */
export const TOOL_VALIDATION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ToolValidationPrinciple, string>
> = Object.freeze({
  'validation-precedes-execution':
    'A tool is validated before it executes, and a tool that fails validation never executes.',
  'validation-is-ordered':
    'The checks are applied in a fixed order, so the same tool is validated the same way.',
  'permission-and-safety-are-checked-first':
    'A tool is checked for permission and safety before narrower checks, so an impermissible or unsafe tool is rejected early.',
  'failure-is-safe':
    'A tool that fails validation is not executed; it is refused or an alternate is chosen, and no unvalidated tool ever acts.',
});

/**
 * A tool-validation check, in constitutional order from first-applied to last-applied
 * (ai/tools/tool-validation.md, "Specification"). The checks are conjunctive (a tool that fails any does
 * not execute) and their order is the document's, total, and exposed by
 * {@link toolValidationCheckAtOrAfter}.
 */
export type ToolValidationCheck =
  | 'permission-validation'
  | 'safety-validation'
  | 'constitutional-validation'
  | 'compatibility-validation';

/** The tool-validation checks, first-applied to last-applied; frozen. */
export const TOOL_VALIDATION_CHECKS: readonly ToolValidationCheck[] = Object.freeze([
  'permission-validation',
  'safety-validation',
  'constitutional-validation',
  'compatibility-validation',
]);

/** What each tool-validation check validates (ai/tools/tool-validation.md, "Specification"). */
export const TOOL_VALIDATION_CHECK_DESCRIPTIONS: Readonly<Record<ToolValidationCheck, string>> =
  Object.freeze({
    'permission-validation':
      'The tool is validated to be one the acting agent is permitted to use, under the permissions owned by ai/agents/agent-permissions.md and the rules owned by ai/governance/; this check is first, so an impermissible tool does not proceed.',
    'safety-validation':
      'The tool is validated to be safe to execute for the case at hand: the hazards it could introduce are identified under ai/safety/hazard-identification.md and its risk classified under ai/safety/risk-classification.md, and a tool whose use would exceed the limits owned by ai/safety/ fails validation; this document owns that the check occurs and its order, and the hazards and limits are owned by ai/safety/.',
    'constitutional-validation':
      'The tool conforms to the constitutional validation owned by ai/governance/constitutional-validation.md, which this validation applies and never restates.',
    'compatibility-validation':
      'The tool is validated to be compatible with the need under ai/tools/tool-compatibility.md, so a tool that cannot satisfy the need does not execute.',
  });

/**
 * A tool-validation invariant: a guarantee tool validation always upholds (ai/tools/tool-validation.md,
 * "Invariants").
 */
export type ToolValidationInvariant =
  | 'validated-before-executes-fails-never-executes'
  | 'checks-applied-in-fixed-order-permission-and-safety-first'
  | 'validation-defines-what-and-order-never-the-rule-or-hazard'
  | 'failed-validation-refused-or-replaced-no-unvalidated-tool-acts'
  | 'validating-a-tool-is-inert';

/** The tool-validation invariants, in constitutional order; frozen. */
export const TOOL_VALIDATION_INVARIANTS: readonly ToolValidationInvariant[] = Object.freeze([
  'validated-before-executes-fails-never-executes',
  'checks-applied-in-fixed-order-permission-and-safety-first',
  'validation-defines-what-and-order-never-the-rule-or-hazard',
  'failed-validation-refused-or-replaced-no-unvalidated-tool-acts',
  'validating-a-tool-is-inert',
]);

/** What each tool-validation invariant guarantees (ai/tools/tool-validation.md, "Invariants"). */
export const TOOL_VALIDATION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ToolValidationInvariant, string>
> = Object.freeze({
  'validated-before-executes-fails-never-executes':
    'A tool is validated before it executes, and a tool that fails validation never executes.',
  'checks-applied-in-fixed-order-permission-and-safety-first':
    'The checks are applied in a fixed order, permission and safety first.',
  'validation-defines-what-and-order-never-the-rule-or-hazard':
    'Validation defines what is checked and in what order, never the governance rule or the hazard, which are owned by ai/governance/ and ai/safety/.',
  'failed-validation-refused-or-replaced-no-unvalidated-tool-acts':
    'A tool that fails validation is refused or replaced, and no unvalidated tool ever acts.',
  'validating-a-tool-is-inert':
    'Validating a tool never reasons, decides, executes, expresses, retrieves, persists, or changes ownership, authority, governance, or business truth.',
});

/**
 * The private rank of each validation check in the constitutional order (first-applied = 0). Internal to
 * the ordering predicate; never exported.
 */
const TOOL_VALIDATION_CHECK_RANK: Readonly<Record<ToolValidationCheck, number>> = Object.freeze({
  'permission-validation': 0,
  'safety-validation': 1,
  'constitutional-validation': 2,
  'compatibility-validation': 3,
});

/**
 * Whether validation check `a` is at or after validation check `b` in the constitutional check order, from
 * permission and safety first to compatibility last (ai/tools/tool-validation.md, "Specification"). Pure
 * and total: it reads only the fixed order the document defines and expresses that order verbatim. It
 * states no policy of its own.
 */
export function toolValidationCheckAtOrAfter(
  a: ToolValidationCheck,
  b: ToolValidationCheck,
): boolean {
  return TOOL_VALIDATION_CHECK_RANK[a] >= TOOL_VALIDATION_CHECK_RANK[b];
}
