import type { AgentExecutionPlan } from '@openlance/aios-agent-engine';
import { VALIDATION_DIMENSIONS } from '@openlance/aios-governance';
import type { ValidationDimension } from '@openlance/aios-governance';

/**
 * Constitutional validation: it applies the frozen constitutional-validation mandate
 * (ai/governance/constitutional-validation), "validation completes before the action is taken; an action that has not
 * been validated is not a permitted action" (`ordered-before-execution`), against the frozen `VALIDATION_DIMENSIONS`. A
 * governance request may authorize only a validated agent plan; a plan that is not validated is refused. It consumes the
 * frozen dimensions and applies the mandate; it restates no rule and defines no validation of its own.
 */
export class ConstitutionalValidator {
  /** The six frozen canonical validation dimensions an action is validated against. */
  dimensions(): readonly ValidationDimension[] {
    return VALIDATION_DIMENSIONS;
  }

  /** Whether the plan is a validated agent plan (validation precedes authorization). */
  isValidated(plan: AgentExecutionPlan): boolean {
    return plan.validated === true;
  }
}
