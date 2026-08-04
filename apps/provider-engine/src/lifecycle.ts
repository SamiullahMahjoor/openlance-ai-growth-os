import {
  PROVIDER_LIFECYCLE_PHASES,
  phaseAtOrAfter,
  usableInPhase,
} from '@openlance/aios-providers';
import type { ProviderLifecyclePhase } from '@openlance/aios-providers';

import type { Provider } from './types.js';

/**
 * Provider lifecycle evaluation over the frozen provider-lifecycle model. It consumes the frozen
 * ordered `PROVIDER_LIFECYCLE_PHASES` and the pure predicates `usableInPhase` and `phaseAtOrAfter`; it
 * defines no phase and re-owns no ordering (ai/providers/provider-lifecycle.md, ADR-0020). A provider
 * is usable only in Activation and Operation.
 */
export class ProviderLifecycle {
  /** The frozen, ordered provider lifecycle phases. */
  phases(): readonly ProviderLifecyclePhase[] {
    return PROVIDER_LIFECYCLE_PHASES;
  }

  /** Whether a provider is in a phase in which it may be selected and invoked. */
  isUsable(provider: Provider): boolean {
    return usableInPhase(provider.phase);
  }

  /** Whether a provider's phase is at or after the given phase, by the constitutional ordering. */
  atOrAfter(provider: Provider, phase: ProviderLifecyclePhase): boolean {
    return phaseAtOrAfter(provider.phase, phase);
  }
}
