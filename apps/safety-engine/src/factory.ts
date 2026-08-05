import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { SafetyError } from './errors.js';
import { SafetyNormalizer } from './normalizer.js';
import type { SafetyRule, SafetyRuleInput } from './types.js';

/**
 * The safety rule factory: it validates a `SafetyRuleInput` and builds an immutable, normalized `SafetyRule`. It fails
 * closed on a blank rule name, a blank denylist entry, or an empty or blank tool combination. Every list defaults to
 * empty (a rule that adds nothing is valid but inert). It builds a rule record only; it evaluates and enforces nothing.
 */
export class SafetyFactory {
  readonly #normalizer = new SafetyNormalizer();

  /** Validate an input and build a frozen `SafetyRule`, failing closed on an invalid input. */
  create(input: SafetyRuleInput): Result<SafetyRule, SafetyError> {
    const name = this.#normalizer.normalize(input.name);
    if (name === '') {
      return err(new SafetyError('SAFETY.BLANK_RULE_NAME', 'A safety rule has a blank name.', {}));
    }
    const restrictedToolCapabilities = this.#list(
      name,
      'restrictedToolCapabilities',
      input.restrictedToolCapabilities,
    );
    if (isErr(restrictedToolCapabilities)) {
      return err(restrictedToolCapabilities.error);
    }
    const sandboxedToolCapabilities = this.#list(
      name,
      'sandboxedToolCapabilities',
      input.sandboxedToolCapabilities,
    );
    if (isErr(sandboxedToolCapabilities)) {
      return err(sandboxedToolCapabilities.error);
    }
    const restrictedPromptTokens = this.#list(
      name,
      'restrictedPromptTokens',
      input.restrictedPromptTokens,
    );
    if (isErr(restrictedPromptTokens)) {
      return err(restrictedPromptTokens.error);
    }
    const restrictedMemoryScopes = this.#list(
      name,
      'restrictedMemoryScopes',
      input.restrictedMemoryScopes,
    );
    if (isErr(restrictedMemoryScopes)) {
      return err(restrictedMemoryScopes.error);
    }
    const restrictedRetrievalScopes = this.#list(
      name,
      'restrictedRetrievalScopes',
      input.restrictedRetrievalScopes,
    );
    if (isErr(restrictedRetrievalScopes)) {
      return err(restrictedRetrievalScopes.error);
    }
    const dangerousToolCombinations = this.#combinations(
      name,
      input.dangerousToolCombinations ?? [],
    );
    if (isErr(dangerousToolCombinations)) {
      return err(dangerousToolCombinations.error);
    }
    const rule: SafetyRule = {
      name,
      restrictedToolCapabilities: restrictedToolCapabilities.value,
      sandboxedToolCapabilities: sandboxedToolCapabilities.value,
      dangerousToolCombinations: dangerousToolCombinations.value,
      restrictedPromptTokens: restrictedPromptTokens.value,
      restrictedMemoryScopes: restrictedMemoryScopes.value,
      restrictedRetrievalScopes: restrictedRetrievalScopes.value,
    };
    return ok(Object.freeze(rule));
  }

  /** Normalize one denylist, failing closed on a blank entry. */
  #list(
    name: string,
    field: string,
    values: readonly string[] | undefined,
  ): Result<readonly string[], SafetyError> {
    const normalized: string[] = [];
    for (const value of values ?? []) {
      const entry = this.#normalizer.normalize(value);
      if (entry === '') {
        return err(
          new SafetyError(
            'SAFETY.BLANK_RULE_ENTRY',
            `Safety rule '${name}' has a blank entry in '${field}'.`,
            { rule: name, field },
          ),
        );
      }
      normalized.push(entry);
    }
    return ok(Object.freeze(normalized));
  }

  /** Normalize the dangerous tool combinations, failing closed on an empty combination or a blank entry. */
  #combinations(
    name: string,
    combinations: readonly (readonly string[])[],
  ): Result<readonly (readonly string[])[], SafetyError> {
    const out: (readonly string[])[] = [];
    for (const combination of combinations) {
      const normalized: string[] = [];
      for (const value of combination) {
        const entry = this.#normalizer.normalize(value);
        if (entry === '') {
          return err(
            new SafetyError(
              'SAFETY.BLANK_RULE_ENTRY',
              `Safety rule '${name}' has a blank entry in a dangerous tool combination.`,
              { rule: name },
            ),
          );
        }
        normalized.push(entry);
      }
      if (normalized.length === 0) {
        return err(
          new SafetyError(
            'SAFETY.EMPTY_COMBINATION',
            `Safety rule '${name}' has an empty dangerous tool combination.`,
            { rule: name },
          ),
        );
      }
      out.push(Object.freeze(normalized));
    }
    return ok(Object.freeze(out));
  }
}
