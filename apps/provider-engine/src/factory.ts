import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { ProviderError } from './errors.js';
import type { HealthStatus, Provider, ProviderDescriptor } from './types.js';

/** The default health probe for a provider that declares none: it reports `unknown`. */
const defaultProbe = (): Promise<HealthStatus> => Promise.resolve('unknown');

/**
 * The provider factory: it validates a `ProviderDescriptor` and produces an immutable `Provider`. It
 * fills a default lifecycle phase (operation) and a default probe (unknown) when the descriptor omits
 * them. It constructs a neutral `Provider` over the abstraction only; it holds no vendor knowledge and
 * constructs no vendor client.
 */
export class ProviderFactory {
  /** Validate a descriptor and build a frozen `Provider`, failing closed on an invalid descriptor. */
  create(descriptor: ProviderDescriptor): Result<Provider, ProviderError> {
    if (descriptor.id.trim() === '') {
      return err(
        new ProviderError('PROVIDER.BLANK_ID', 'A provider descriptor has a blank id.', {}),
      );
    }
    if (descriptor.capabilities.length === 0) {
      return err(
        new ProviderError(
          'PROVIDER.NO_CAPABILITIES',
          `Provider '${descriptor.id}' declares no capabilities.`,
          { id: descriptor.id },
        ),
      );
    }
    const provider: Provider = {
      id: descriptor.id,
      capabilities: Object.freeze([...descriptor.capabilities]),
      phase: descriptor.phase ?? 'operation',
      invoke: descriptor.invoke,
      probe: descriptor.probe ?? defaultProbe,
    };
    return ok(Object.freeze(provider));
  }
}
