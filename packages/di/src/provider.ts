import type { Option } from '@openlance/aios-kernel';

import type { Token } from './token.js';

/** How long a resolved instance lives. */
export type Lifetime = 'singleton' | 'scoped' | 'transient';

/** The read side of a container or scope: resolve a token to its instance. */
export interface Resolver {
  /** Resolves a token, throwing a `DependencyError` if it is not registered. */
  resolve<T>(token: Token<T>): T;
  /** Resolves a token if it is registered, returning `none` otherwise. */
  tryResolve<T>(token: Token<T>): Option<T>;
}

/**
 * A provider describes how to produce an instance for a token. `inject` names the
 * tokens a class or factory depends on; for `useClass` they are resolved and passed
 * to the constructor, and for both `useClass` and `useFactory` they are the declared
 * edges the validator checks.
 */
export type Provider<T> =
  | { useValue: T }
  | { useClass: new (...deps: never[]) => T; inject?: Token<unknown>[] }
  | { useFactory: (resolve: Resolver) => T; inject?: Token<unknown>[] };
