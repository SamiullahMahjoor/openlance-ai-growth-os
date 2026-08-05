import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import type { PluginManifest } from '@openlance/aios-plugins';

import { GovernanceError } from './errors.js';
import { GovernanceFactory } from './factory.js';
import type { GovernanceRegistry } from './registry.js';
import type { GovernanceGrant, GovernanceGrantInput, GovernanceId } from './types.js';

/**
 * A grant shipped as a plugin: the frozen `PluginManifest` identity plus the grant it contributes. The bridge adopts
 * such plugins into the engine registry. It consumes the frozen `PluginManifest` type and does not drive the plugin host
 * lifecycle (discovery, loading, start, and stop remain the plugin-loading / runtime concern).
 */
export interface GovernancePlugin {
  readonly manifest: PluginManifest;
  readonly grant: GovernanceGrantInput;
}

/**
 * The governance plugin bridge: it adopts grant-carrying plugins into the engine registry, so a grant may ship as a
 * plugin. Each grant is validated and frozen through the same {@link GovernanceFactory} as direct registration, and
 * adoption is atomic: every grant is validated and checked for a conflicting subject (against the registry and within
 * the batch) before any is registered, so a mid-batch failure leaves the registry unchanged. It recreates no plugin
 * host, loader, lifecycle, or compatibility validator.
 */
export class GovernancePluginBridge {
  readonly #registry: GovernanceRegistry;
  readonly #factory: GovernanceFactory;

  constructor(registry: GovernanceRegistry) {
    this.#registry = registry;
    this.#factory = new GovernanceFactory();
  }

  /** Adopt the plugin grants into the registry, atomically; returns the adopted subjects, fail closed. */
  adopt(plugins: readonly GovernancePlugin[]): Result<readonly GovernanceId[], GovernanceError> {
    const prepared: GovernanceGrant[] = [];
    const seen = new Set<GovernanceId>();
    for (const plugin of plugins) {
      const built = this.#factory.create(plugin.grant);
      if (isErr(built)) {
        return err(built.error);
      }
      const subject = built.value.subject;
      if (this.#registry.has(subject) || seen.has(subject)) {
        return err(
          new GovernanceError(
            'GOVERNANCE.DUPLICATE_SUBJECT',
            `A grant for subject '${subject}' is already registered.`,
            { subject },
          ),
        );
      }
      seen.add(subject);
      prepared.push(built.value);
    }
    const adopted: GovernanceId[] = [];
    for (const grant of prepared) {
      this.#registry.register(grant);
      adopted.push(grant.subject);
    }
    return ok(Object.freeze(adopted));
  }
}
