import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import { TOOL_VALIDATION_CHECKS, toolValidationCheckAtOrAfter } from '@openlance/aios-tools';
import type { ToolValidationCheck } from '@openlance/aios-tools';

import { ToolError } from './errors.js';
import type { ToolDefinition, ToolRequest } from './types.js';

/**
 * The `TOOL.*` codes produced by the validation checks, so callers can distinguish a validation failure from another
 * tool failure. Frozen.
 */
export const VALIDATION_ERROR_CODES: ReadonlySet<string> = new Set([
  'TOOL.NOT_PERMITTED',
  'TOOL.UNDECLARED_CAPABILITY',
  'TOOL.CLEARANCE_REQUIRED',
  'TOOL.MISSING_PARAMETER',
]);

/**
 * Tool validation: it runs the frozen `TOOL_VALIDATION_CHECKS` in order (permission, safety, constitutional,
 * compatibility), conjunctive and fail-closed: a tool that fails any check is refused, never prepared. Each check is a
 * structural check that applies, never restates, the permission owned by ai/agents/, the hazard limits owned by
 * ai/safety/, the constitutional rule owned by ai/governance/, and the compatibility owned by ai/tools/.
 */
export class ToolValidator {
  /** The frozen, ordered validation checks. */
  checks(): readonly ToolValidationCheck[] {
    return TOOL_VALIDATION_CHECKS;
  }

  /** Whether the frozen checks are in constitutional order (permission and safety first). Proof, over the predicate. */
  checksInConstitutionalOrder(): boolean {
    return TOOL_VALIDATION_CHECKS.every((check, index) => {
      const previous = TOOL_VALIDATION_CHECKS[index - 1];
      return previous === undefined || toolValidationCheckAtOrAfter(check, previous);
    });
  }

  /** Validate a tool against a request through the frozen checks, in order, failing closed. */
  validate(tool: ToolDefinition, request: ToolRequest): Result<void, ToolError> {
    // permission-validation: the acting agent is permitted to use the tool (when a permission set is given).
    if (request.permitted !== undefined && !request.permitted.includes(tool.id)) {
      return err(
        new ToolError(
          'TOOL.NOT_PERMITTED',
          `The agent is not permitted to use tool '${tool.id}'.`,
          {
            id: tool.id,
          },
        ),
      );
    }
    // safety-validation: the invocation stays within the tool's declared, bounded capabilities.
    const capability = tool.capabilities.find((declared) => declared.name === request.capability);
    if (capability === undefined) {
      return err(
        new ToolError(
          'TOOL.UNDECLARED_CAPABILITY',
          `Tool '${tool.id}' does not declare capability '${request.capability}'.`,
          { id: tool.id, capability: request.capability },
        ),
      );
    }
    // constitutional-validation: governance precedes execution; a significant action carries a granted clearance.
    if (tool.requiresClearance && request.cleared !== true) {
      return err(
        new ToolError(
          'TOOL.CLEARANCE_REQUIRED',
          `Tool '${tool.id}' requires a governance clearance that was not granted.`,
          { id: tool.id },
        ),
      );
    }
    // compatibility-validation: every required parameter of the capability is supplied.
    const args = request.arguments ?? {};
    for (const parameter of capability.parameters) {
      if (parameter.required && !Object.hasOwn(args, parameter.name)) {
        return err(
          new ToolError(
            'TOOL.MISSING_PARAMETER',
            `Tool '${tool.id}' capability '${capability.name}' is missing required parameter '${parameter.name}'.`,
            { id: tool.id, capability: capability.name, parameter: parameter.name },
          ),
        );
      }
    }
    return ok(undefined);
  }
}
