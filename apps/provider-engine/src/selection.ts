import type { ProviderRouter } from './routing.js';
import type { Provider, ProviderNeed } from './types.js';

/**
 * Deterministic provider selection: the primary provider for a need, defined as the first of the
 * router's eligible fallback order (or `undefined` if none is eligible). The same need, the same
 * registered providers, and the same health yield the same selection, with no randomness
 * (ai/providers/provider-selection.md; ADR-0020).
 */
export class ProviderSelector {
  readonly #router: ProviderRouter;

  constructor(router: ProviderRouter) {
    this.#router = router;
  }

  /** The selected provider for a need, or `undefined` if none is eligible. */
  select(need: ProviderNeed, providers: readonly Provider[]): Provider | undefined {
    const ordered = this.#router.route(need, providers);
    return ordered.length > 0 ? ordered[0] : undefined;
  }
}
