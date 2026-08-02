import { BaseError } from '@openlance/aios-errors';
import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import type { Logger } from '@openlance/aios-logging';

import type { EventHandler, FrameworkEvent } from './event.js';

/**
 * A failure aggregated from event dispatch: one or more handlers threw. The failing
 * handlers are isolated (they do not abort siblings or the publisher); the outcome
 * is summarized here and returned on the `Result` channel, never thrown.
 */
export class EventError extends BaseError {
  readonly category = 'domain';
}

/**
 * Internal: invokes handlers in registration order, awaiting each. A throwing
 * handler is caught and isolated so the remaining handlers still run; its failure
 * is logged (if a logger is present, off the hot path) and counted. If any handler
 * failed, the aggregated `EventError` is returned; otherwise `ok`.
 */
export const dispatch = async (
  event: FrameworkEvent,
  handlers: readonly EventHandler<FrameworkEvent>[],
  logger?: Logger,
): Promise<Result<void, EventError>> => {
  const failures: unknown[] = [];
  for (const handler of handlers) {
    try {
      await handler(event);
    } catch (error) {
      failures.push(error);
      logger?.error('event handler failed', { type: event.type, error: String(error) });
    }
  }
  if (failures.length === 0) {
    return ok(undefined);
  }
  return err(
    new EventError(
      'EVENT.HANDLER_FAILED',
      `${failures.length} handler(s) failed for '${event.type}'.`,
      { type: event.type, failureCount: failures.length },
    ),
  );
};
