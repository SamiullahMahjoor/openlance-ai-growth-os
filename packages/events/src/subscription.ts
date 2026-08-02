import type { Disposable } from '@openlance/aios-kernel';

/**
 * A live subscription: a `Disposable` whose `dispose()` unsubscribes the handler.
 * Disposing more than once is safe.
 */
export type Subscription = Disposable;
