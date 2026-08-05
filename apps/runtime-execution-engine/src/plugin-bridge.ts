import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import type { PluginManifest } from '@openlance/aios-plugins';

import { ExecutionError } from './errors.js';
import { ExecutionPolicyFactory } from './factory.js';
import type { ExecutionPolicyRegistry } from './registry.js';
import type { ExecutionPolicy, ExecutionPolicyInput } from './types.js';

/**
 * An execution policy shipped as a plugin: the frozen `PluginManifest` identity plus the policy it contributes. The
 * bridge adopts such plugins into the engine policy registry. It consumes the frozen `PluginManifest` type and does not
 * drive the plugin host lifecycle (discovery, loading, start, and stop remain the plugin-loading / runtime concern).
 */
export interface ExecutionPlugin {
  readonly manifest: PluginManifest;
  readonly policy: ExecutionPolicyInput;
}

/**
 * The execution plugin bridge: it adopts policy-carrying plugins into the engine policy registry, so an execution policy
 * may ship as a plugin. Each policy is validated and frozen through the same {@link ExecutionPolicyFactory} as direct
 * registration, and adoption is atomic: every policy is validated and checked for a conflicting name (against the
 * registry and within the batch) before any is registered, so a mid-batch failure leaves the registry unchanged. It
 * recreates no plugin host, loader, lifecycle, or compatibility validator.
 */
export class ExecutionPluginBridge {
  readonly #registry: ExecutionPolicyRegistry;
  readonly #factory: ExecutionPolicyFactory;

  constructor(registry: ExecutionPolicyRegistry) {
    this.#registry = registry;
    this.#factory = new ExecutionPolicyFactory();
  }

  /** Adopt the plugin policies into the registry, atomically; returns the adopted policy names, fail closed. */
  adopt(plugins: readonly ExecutionPlugin[]): Result<readonly string[], ExecutionError> {
    const prepared: ExecutionPolicy[] = [];
    const seen = new Set<string>();
    for (const plugin of plugins) {
      const built = this.#factory.create(plugin.policy);
      if (isErr(built)) {
        return err(built.error);
      }
      const name = built.value.name;
      if (this.#registry.has(name) || seen.has(name)) {
        return err(
          new ExecutionError(
            'EXECUTION.DUPLICATE_POLICY',
            `An execution policy named '${name}' is already registered.`,
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
