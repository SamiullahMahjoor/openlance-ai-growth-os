import type { AgentExecutionPlan } from '@openlance/aios-agent-engine';
import type { GovernanceDecision } from '@openlance/aios-governance-engine';
import type { OversightRequirement, TrustLevel } from '@openlance/aios-governance';
import type { HazardCategory, ImpactDimension, RefusalCategory } from '@openlance/aios-safety';

/** A safety subject's stable identity within the engine (the acting agent's id, normalized). */
export type SafetyId = string;

/**
 * A safety outcome: the only legal safety decisions, ordered by required protection from least to strongest. `SAFE`,
 * `SANITIZE`, `RESTRICT`, and `DEGRADE` still execute (unprotected, with an unsafe element neutralized, contained within
 * a narrowed boundary, or in a reduced safe mode); `ESCALATE`, `REFUSE`, and `UNSAFE` do not execute. `ESCALATE` ascends
 * to an accountable human, `REFUSE` is a protective or constitutional refusal, and `UNSAFE` is the fail-closed terminal
 * verdict carrying an emergency-stop recommendation. The governance-owned `AUTHORIZE` / `DENY` / `REQUIRE_APPROVAL` are
 * not safety outcomes; safety never authorizes.
 */
export type SafetyOutcome =
  'SAFE' | 'SANITIZE' | 'RESTRICT' | 'DEGRADE' | 'ESCALATE' | 'REFUSE' | 'UNSAFE';

/** The protective response a single hazard demands: every safety outcome except `SAFE` (a hazard is never safe). */
export type ProtectiveResponse = Exclude<SafetyOutcome, 'SAFE'>;

/** The kind of protection a directive describes, which Operations is to carry out (safety describes; it never performs). */
export type DirectiveKind = 'sanitize' | 'restrict' | 'isolate' | 'degrade';

/**
 * An identified runtime hazard: its frozen `category` (one of `@openlance/aios-safety` `HazardCategory`), the plan
 * element it arises from (`source`), a stable `SAFETY.*` `code`, the base protective `response` it demands, and an
 * explaining `detail`. Identifying a hazard is inert.
 */
export interface Hazard {
  readonly category: HazardCategory;
  readonly source: string;
  readonly code: string;
  readonly response: ProtectiveResponse;
  readonly detail: string;
}

/**
 * A protective directive: a description of the protection Operations is to apply to a plan element (`target`) before or
 * during execution, with an explaining `detail`. Safety produces the directive; it never sanitizes, restricts, isolates,
 * or degrades anything itself.
 */
export interface SafetyDirective {
  readonly kind: DirectiveKind;
  readonly target: string;
  readonly detail: string;
}

/**
 * A safety request: the immutable, governance-authorized `AgentExecutionPlan` to evaluate, and the immutable
 * `GovernanceDecision` that authorized it (carrying the governed trust and oversight). Safety evaluates the plan for
 * runtime safety; it never modifies the plan or the governance decision.
 */
export interface SafetyRequest {
  readonly plan: AgentExecutionPlan;
  readonly governance: GovernanceDecision;
}

/**
 * An immutable safety decision: the protection determination the runtime carries alongside the plan and the governance
 * decision. It names the `subject`, the `outcome`, the explaining `reason`, the identified `hazards`, the protective
 * `directives` Operations is to apply, the frozen `refusalCategory` when it refuses or escalates (else `null`), whether a
 * human `escalated` decision is required, whether an `emergencyStop` is recommended, the implicated `impact` dimensions,
 * the governed `oversight` and `trust` it applied (from governance, never redefined), the `governance` decision id it
 * consumed, whether it `evaluated` the plan (false when governance did not authorize), and a deterministic content-hash
 * `id`. `validated: true` marks that it was produced by the frozen evaluation. It may only be consumed, archived, or
 * superseded by a new evaluation, never modified.
 */
export interface SafetyDecision {
  readonly subject: SafetyId;
  readonly outcome: SafetyOutcome;
  readonly reason: string;
  readonly hazards: readonly Hazard[];
  readonly directives: readonly SafetyDirective[];
  readonly refusalCategory: RefusalCategory | null;
  readonly escalated: boolean;
  readonly emergencyStop: boolean;
  readonly impact: readonly ImpactDimension[];
  readonly oversight: OversightRequirement;
  readonly trust: TrustLevel;
  readonly governance: string;
  readonly evaluated: boolean;
  readonly id: string;
  readonly validated: true;
}

/**
 * A named safety rule: an operator- or plugin-contributed extension to the base safety policy. It adds restricted tool
 * capabilities, sandbox-required capabilities, dangerous tool combinations, restricted prompt tokens, and restricted
 * memory and retrieval scopes. Rules only ever add protection (they extend denylists); they never widen what is allowed.
 */
export interface SafetyRule {
  readonly name: string;
  readonly restrictedToolCapabilities: readonly string[];
  readonly sandboxedToolCapabilities: readonly string[];
  readonly dangerousToolCombinations: readonly (readonly string[])[];
  readonly restrictedPromptTokens: readonly string[];
  readonly restrictedMemoryScopes: readonly string[];
  readonly restrictedRetrievalScopes: readonly string[];
}

/** A safety rule's registration input; the factory validates it, normalizes its names, and freezes it. */
export interface SafetyRuleInput {
  readonly name: string;
  readonly restrictedToolCapabilities?: readonly string[];
  readonly sandboxedToolCapabilities?: readonly string[];
  readonly dangerousToolCombinations?: readonly (readonly string[])[];
  readonly restrictedPromptTokens?: readonly string[];
  readonly restrictedMemoryScopes?: readonly string[];
  readonly restrictedRetrievalScopes?: readonly string[];
}

/** A read-only snapshot of the engine's operational counters. */
export interface SafetyStatistics {
  readonly evaluations: number;
  readonly safe: number;
  readonly sanitized: number;
  readonly restricted: number;
  readonly degraded: number;
  readonly escalated: number;
  readonly refused: number;
  readonly unsafe: number;
}

/** A read-only operational view of the engine. */
export interface SafetyDiagnostics {
  readonly ruleCount: number;
  readonly statistics: SafetyStatistics;
}
