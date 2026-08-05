import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { SafetyError } from './errors.js';
import type { SafetyRule } from './types.js';

/**
 * The safety rule registry: registration and deterministic lookup of named policy rules. It preserves registration order
 * (Map insertion order), so the resolved effective policy is deterministic. It holds policy extensions (denylist
 * overlays); it holds no plan, no decision, and no governance truth.
 */
export class SafetyRuleRegistry {
  readonly #byName = new Map<string, SafetyRule>();

  /** Register a rule. Fails closed on a duplicate name (`SAFETY.DUPLICATE_RULE`). */
  register(rule: SafetyRule): Result<void, SafetyError> {
    if (this.#byName.has(rule.name)) {
      return err(
        new SafetyError(
          'SAFETY.DUPLICATE_RULE',
          `A safety rule named '${rule.name}' is already registered.`,
          { rule: rule.name },
        ),
      );
    }
    this.#byName.set(rule.name, rule);
    return ok(undefined);
  }

  /** Whether a rule with the given name is registered. */
  has(name: string): boolean {
    return this.#byName.has(name);
  }

  /** All registered rules, in registration order. */
  list(): readonly SafetyRule[] {
    return [...this.#byName.values()];
  }

  /** Remove a rule by name; returns whether one was removed. */
  unregister(name: string): boolean {
    return this.#byName.delete(name);
  }
}
