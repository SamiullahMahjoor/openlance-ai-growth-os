import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { PromptError } from './errors.js';
import type { PromptRegistry } from './registry.js';
import type { PromptDefinition, PromptPart } from './types.js';

/**
 * Prompt template and inheritance resolution: it resolves a definition and its `inheritsFrom` chain into
 * a single ordered part set (the `resolve-inheritance` and `gather-layers-and-template` assembly stages).
 * Base parts precede derived parts, so composition acts on settled parts. The walk is bounded and
 * acyclic: it fails closed on an unknown base (`PROMPT.UNKNOWN_BASE`) or an inheritance cycle
 * (`PROMPT.INHERITANCE_CYCLE`). It resolves structure only; it composes and executes nothing.
 */
export class PromptTemplateResolver {
  /** Resolve the inheritance chain into base-first ordered parts, failing closed. */
  resolve(
    definition: PromptDefinition,
    registry: PromptRegistry,
  ): Result<readonly PromptPart[], PromptError> {
    const chain: PromptDefinition[] = [];
    const seen = new Set<string>();
    let current: PromptDefinition | undefined = definition;
    while (current !== undefined) {
      if (seen.has(current.id)) {
        return err(
          new PromptError(
            'PROMPT.INHERITANCE_CYCLE',
            `Prompt definition '${current.id}' is part of an inheritance cycle.`,
            { id: current.id },
          ),
        );
      }
      seen.add(current.id);
      chain.push(current);
      const base: PromptDefinition | undefined =
        current.inheritsFrom === undefined ? undefined : registry.get(current.inheritsFrom);
      if (current.inheritsFrom !== undefined && base === undefined) {
        return err(
          new PromptError(
            'PROMPT.UNKNOWN_BASE',
            `Prompt definition '${current.id}' inherits from unknown definition '${current.inheritsFrom}'.`,
            { id: current.id, base: current.inheritsFrom },
          ),
        );
      }
      current = base;
    }
    const parts: PromptPart[] = [];
    for (const definitionInChain of [...chain].reverse()) {
      parts.push(...definitionInChain.parts);
    }
    return ok(Object.freeze(parts));
  }
}
