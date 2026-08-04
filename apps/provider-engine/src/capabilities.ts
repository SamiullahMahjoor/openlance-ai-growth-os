import type { Provider, ProviderNeed } from './types.js';

/** Whether a provider declares the capability a need requires. Pure. */
export const providerSatisfies = (provider: Provider, need: ProviderNeed): boolean =>
  provider.capabilities.includes(need.capability);

/**
 * Capability evaluation: which registered providers can satisfy a need. It reads declared capabilities
 * only; it selects, routes, and invokes nothing.
 */
export class ProviderCapabilities {
  /** The providers whose declared capabilities satisfy the need, in registration order. */
  matching(providers: readonly Provider[], need: ProviderNeed): readonly Provider[] {
    return providers.filter((provider) => providerSatisfies(provider, need));
  }
}
