import { BaseError } from '@openlance/aios-errors';

/**
 * A safety-engine operational failure, distinguished by its stable `SAFETY.*` code (a duplicate rule name, a blank rule
 * name, or a blank rule entry). It is an infrastructure error and owns no new error framework; it is a `BaseError`
 * subtype (ADR-0006) that carries the `Result` channel's failure, and is never thrown out of the public API. An unsafe
 * plan is not an error; it is a governed `SafetyDecision` (`UNSAFE`, `REFUSE`, `ESCALATE`, `DEGRADE`, `RESTRICT`, or
 * `SANITIZE`).
 */
export class SafetyError extends BaseError {
  readonly category = 'infrastructure';
}
