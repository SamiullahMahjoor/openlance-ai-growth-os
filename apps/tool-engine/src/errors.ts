import { BaseError } from '@openlance/aios-errors';

/**
 * A tool-engine operational failure, distinguished by its stable `TOOL.*` code (a duplicate id, a blank id, no
 * capabilities, a blank or duplicate capability, a blank parameter, an unknown tool, an unknown base, an inheritance
 * cycle, a missing required permission set, a not-permitted tool, an undeclared capability, a missing clearance, or a
 * missing required parameter). It is an infrastructure error and owns no new error framework; it is a `BaseError`
 * subtype (ADR-0006) that carries the `Result` channel's failure, and is never thrown out of the public API.
 */
export class ToolError extends BaseError {
  readonly category = 'infrastructure';
}
