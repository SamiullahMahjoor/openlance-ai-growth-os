import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import type { PluginManifest } from '@openlance/aios-plugins';

import { SafetyError } from './errors.js';
import { SafetyFactory } from './factory.js';
import type { SafetyRuleRegistry } from './registry.js';
import type { SafetyRule, SafetyRuleInput } from './types.js';

/**
 * A safety rule shipped as a plugin: the frozen `PluginManifest` identity plus the rule it contributes. The bridge
 * adopts such plugins into the engine rule registry. It consumes the frozen `PluginManifest` type and does not drive the
 * plugin host lifecycle (discovery, loading, start, and stop remain the plugin-loading / runtime concern).
 */
export interface SafetyPlugin {
  readonly manifest: PluginManifest;
  readonly rule: SafetyRuleInput;
}

/**
 * The safety plugin bridge: it adopts rule-carrying plugins into the engine rule registry, so a safety rule may ship as
 * a plugin. Each rule is validated and frozen through the same {@link SafetyFactory} as direct registration, and
 * adoption is atomic: every rule is validated and checked for a conflicting name (against the registry and within the
 * batch) before any is registered, so a mid-batch failure leaves the registry unchanged. It recreates no plugin host,
 * loader, lifecycle, or compatibility validator.
 */
export class SafetyPluginBridge {
  readonly #registry: SafetyRuleRegistry;
  readonly #factory: SafetyFactory;

  constructor(registry: SafetyRuleRegistry) {
    this.#registry = registry;
    this.#factory = new SafetyFactory();
  }

  /** Adopt the plugin rules into the registry, atomically; returns the adopted rule names, fail closed. */
  adopt(plugins: readonly SafetyPlugin[]): Result<readonly string[], SafetyError> {
    const prepared: SafetyRule[] = [];
    const seen = new Set<string>();
    for (const plugin of plugins) {
      const built = this.#factory.create(plugin.rule);
      if (isErr(built)) {
        return err(built.error);
      }
      const name = built.value.name;
      if (this.#registry.has(name) || seen.has(name)) {
        return err(
          new SafetyError(
            'SAFETY.DUPLICATE_RULE',
            `A safety rule named '${name}' is already registered.`,
            { rule: name },
          ),
        );
      }
      seen.add(name);
      prepared.push(built.value);
    }
    const adopted: string[] = [];
    for (const rule of prepared) {
      this.#registry.register(rule);
      adopted.push(rule.name);
    }
    return ok(Object.freeze(adopted));
  }
}
