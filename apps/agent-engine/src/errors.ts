import { BaseError } from '@openlance/aios-errors';

/**
 * An agent-engine operational failure, distinguished by its stable `AGENT.*` code (a duplicate id, a blank id, no
 * capabilities, an invalid capability, a permission that exceeds the capabilities, a blank specialization, an unknown
 * agent, a blank task, an empty plan, a plan too large, an uncapable step, a not-permitted step, a coordination topology
 * too large, self-coordination, or a coordination cycle). It is an infrastructure error and owns no new error framework;
 * it is a `BaseError` subtype
 * (ADR-0006) that carries the `Result` channel's failure, and is never thrown out of the public API.
 */
export class AgentError extends BaseError {
  readonly category = 'infrastructure';
}
