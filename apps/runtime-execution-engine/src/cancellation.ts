import type { ExecutionContext } from './types.js';

/**
 * The cancellation manager: it reads the execution context's read-only cancellation signal at the governed cancellation
 * gate. Per the frozen execution state model, a cancelled execution is reached only from the validating gate, so a
 * requested cancellation is honored there, before the task runs. The manager only reads the signal and never sets or
 * clears it; the decision to cancel is a governed or human one, owned upstream.
 */
export class CancellationManager {
  /** Whether cancellation has been requested for the execution. */
  requested(context: ExecutionContext): boolean {
    return context.cancellation.isCancelled();
  }
}
