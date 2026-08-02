import type { Lifetime, Provider } from './provider.js';
import type { Token } from './token.js';

/**
 * The write side of a container, given to a module so it can register its services.
 * Registration is explicit; there is no ambient or implicit registration.
 */
export interface Registry {
  register<T>(token: Token<T>, provider: Provider<T>, opts?: { lifetime?: Lifetime }): void;
}
