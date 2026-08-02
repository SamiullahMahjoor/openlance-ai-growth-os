import { AsyncLocalStorage } from 'node:async_hooks';

interface CorrelationIds {
  readonly correlationId?: string;
  readonly traceId?: string;
  readonly spanId?: string;
}

/**
 * The ambient correlation seam. `run` establishes correlation ids for the duration
 * of a callback (including its async continuations); `current` reads the ids in
 * effect, or an empty set outside any `run`. A logger reads `current()` to attach
 * ids to each record.
 */
export interface CorrelationContext {
  run<T>(ids: { correlationId: string; traceId?: string; spanId?: string }, fn: () => T): T;
  current(): { correlationId?: string; traceId?: string; spanId?: string };
}

class AsyncCorrelationContext implements CorrelationContext {
  readonly #storage = new AsyncLocalStorage<CorrelationIds>();

  run<T>(ids: { correlationId: string; traceId?: string; spanId?: string }, fn: () => T): T {
    return this.#storage.run(ids, fn);
  }

  current(): { correlationId?: string; traceId?: string; spanId?: string } {
    return this.#storage.getStore() ?? {};
  }
}

/** Creates a correlation context backed by async-local storage. */
export const createCorrelationContext = (): CorrelationContext => new AsyncCorrelationContext();
