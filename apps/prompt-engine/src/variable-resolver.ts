import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { PromptError } from './errors.js';
import type { PromptPart, VariableName } from './types.js';

/** The neutral variable placeholder convention. Resolution only; it defines no template language. */
const PLACEHOLDER = /\{\{(\w+)\}\}/g;

/** Substitute provided variables into content, leaving an unprovided placeholder untouched. */
const substitute = (content: string, variables: Readonly<Record<string, string>>): string =>
  content.replace(PLACEHOLDER, (match, name: string) => {
    const value = Object.hasOwn(variables, name) ? variables[name] : undefined;
    return value === undefined ? match : value;
  });

/**
 * Prompt variable resolution: it substitutes provided variable values into each part's content. In
 * strict mode it fails closed on a missing required variable (`PROMPT.MISSING_VARIABLE`); in non-strict
 * mode a missing required variable is left as a placeholder, to be caught by boundary validation. An
 * unprovided placeholder for an undeclared variable is left untouched (validation rejects a residual
 * placeholder). It resolves values only; it invents nothing and executes nothing.
 */
export class PromptVariableResolver {
  /** Resolve the parts' variables, failing closed on a missing required variable in strict mode. */
  resolve(
    parts: readonly PromptPart[],
    requiredVariables: readonly VariableName[],
    variables: Readonly<Record<VariableName, string>>,
    strict: boolean,
  ): Result<readonly PromptPart[], PromptError> {
    if (strict) {
      for (const name of requiredVariables) {
        if (!Object.hasOwn(variables, name)) {
          return err(
            new PromptError(
              'PROMPT.MISSING_VARIABLE',
              `The composition does not supply the required variable '${name}'.`,
              { variable: name },
            ),
          );
        }
      }
    }
    const resolved: readonly PromptPart[] = Object.freeze(
      parts.map((part) => Object.freeze({ ...part, content: substitute(part.content, variables) })),
    );
    return ok(resolved);
  }
}
