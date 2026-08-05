import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import type { PluginManifest } from '@openlance/aios-plugins';

import { OperationsError } from './errors.js';
import { OperationsPolicyFactory } from './factory.js';
import type { OperationsPolicyRegistry } from './registry.js';
import type { OperationsPolicy, OperationsPolicyInput } from './types.js';

/**
 * An operations policy shipped as a plugin: the frozen `PluginManifest` identity plus the policy it contributes. The
 * bridge adopts such plugins into the engine policy registry. It consumes the frozen `PluginManifest` type and does not
 * drive the plugin host lifecycle (discovery, loading, start, and stop remain the plugin-loading / runtime concern).
 */
export interface OperationsPlugin {
  readonly manifest: PluginManifest;
  readonly policy: OperationsPolicyInput;
}

/**
 * The operations plugin bridge: it adopts policy-carrying plugins into the engine policy registry, so an operations
 * policy may ship as a plugin. Each policy is validated and frozen through the same {@link OperationsPolicyFactory} as
 * direct registration, and adoption is atomic: every policy is validated and checked for a conflicting name before any is
 * registered, so a mid-batch failure leaves the registry unchanged. It recreates no plugin host, loader, or lifecycle.
 */
export class OperationsPluginBridge {
  readonly #registry: OperationsPolicyRegistry;
  readonly #factory: OperationsPolicyFactory;

  constructor(registry: OperationsPolicyRegistry) {
    this.#registry = registry;
    this.#factory = new OperationsPolicyFactory();
  }

  /** Adopt the plugin policies into the registry, atomically; returns the adopted policy names, fail closed. */
  adopt(plugins: readonly OperationsPlugin[]): Result<readonly string[], OperationsError> {
    const prepared: OperationsPolicy[] = [];
    const seen = new Set<string>();
    for (const plugin of plugins) {
      const built = this.#factory.create(plugin.policy);
      if (isErr(built)) {
        return err(built.error);
      }
      const name = built.value.name;
      if (this.#registry.has(name) || seen.has(name)) {
        return err(
          new OperationsError(
            'OPERATIONS.DUPLICATE_POLICY',
            `An operations policy named '${name}' is already registered.`,
            { policy: name },
          ),
        );
      }
      seen.add(name);
      prepared.push(built.value);
    }
    const adopted: string[] = [];
    for (const policy of prepared) {
      this.#registry.register(policy);
      adopted.push(policy.name);
    }
    return ok(Object.freeze(adopted));
  }
}
