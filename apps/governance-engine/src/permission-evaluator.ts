import type { AgentExecutionPlan } from '@openlance/aios-agent-engine';

import type { GovernanceGrant } from './types.js';

/** The partition of a plan's capabilities against a grant: those granted, and those not granted. */
export interface PermissionResult {
  readonly permitted: readonly string[];
  readonly ungranted: readonly string[];
}

/**
 * Permission evaluation: it applies the frozen permission mandate `explicit-grant` (ai/governance/permission-governance),
 * "absence of a grant is a denial, not a default permission." For each capability the plan's steps use, it checks the
 * subject's granted permissions and partitions the distinct capabilities into those granted and those not granted. It
 * states the result only; the decision (a denial) is the evaluator's. It never widens or mints a grant.
 */
export class PermissionEvaluator {
  /** Partition the plan's distinct step capabilities into those the grant permits and those it does not. */
  evaluate(grant: GovernanceGrant, plan: AgentExecutionPlan): PermissionResult {
    const permitted: string[] = [];
    const ungranted: string[] = [];
    for (const step of plan.steps) {
      const capability = step.capability;
      if (grant.permissions.includes(capability)) {
        if (!permitted.includes(capability)) {
          permitted.push(capability);
        }
      } else if (!ungranted.includes(capability)) {
        ungranted.push(capability);
      }
    }
    return { permitted: Object.freeze(permitted), ungranted: Object.freeze(ungranted) };
  }
}
