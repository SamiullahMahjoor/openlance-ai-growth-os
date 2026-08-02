import type { Clock } from '@openlance/aios-kernel';

/**
 * A framework-internal event. It carries a stable, namespaced `type`, an injected
 * `occurredAt` timestamp, an optional correlation id, and a typed payload. This is a
 * generic in-process event for framework facts (a package started, a config
 * reloaded, a plugin registered); it is not the runtime AI event-lifecycle, which
 * is owned by the Runtime namespace and built later.
 */
export interface FrameworkEvent<TPayload = unknown> {
  readonly type: string;
  readonly occurredAt: number;
  readonly correlationId?: string;
  readonly payload: TPayload;
}

/** A handler for events of a given type. It may be synchronous or asynchronous. */
export type EventHandler<E extends FrameworkEvent> = (event: E) => void | Promise<void>;

/**
 * Creates an immutable framework event, stamping `occurredAt` from the injected
 * `Clock` so identical inputs under a fixed clock produce identical envelopes.
 */
export const createEvent = <TPayload>(
  clock: Clock,
  type: string,
  payload: TPayload,
  correlationId?: string,
): FrameworkEvent<TPayload> => {
  const event: { -readonly [K in keyof FrameworkEvent<TPayload>]: FrameworkEvent<TPayload>[K] } = {
    type,
    occurredAt: clock.now(),
    payload,
  };
  if (correlationId !== undefined) {
    event.correlationId = correlationId;
  }
  return Object.freeze(event);
};
