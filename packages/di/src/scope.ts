import type { Disposable } from '@openlance/aios-kernel';

import type { Resolver } from './provider.js';

/**
 * A resolution scope. Scoped services resolve to one instance per scope; disposing a
 * scope disposes the scoped instances it created, in reverse construction order.
 */
export interface Scope extends Resolver, Disposable {}
