import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import { PROMPT_ASSEMBLY_STAGES, assemblyStageAtOrAfter } from '@openlance/aios-prompts';
import type { PromptAssemblyStage } from '@openlance/aios-prompts';
import type { ProviderRequest } from '@openlance/aios-provider-engine';

import type { PromptAssembler } from './assembler.js';
import type { PromptError } from './errors.js';
import type { PromptNormalizer } from './normalizer.js';
import type { PromptRegistry } from './registry.js';
import type { PromptTemplateResolver } from './template-resolver.js';
import type { CompiledPrompt, CompositionInput, PromptDefinition } from './types.js';
import type { PromptValidator } from './validator.js';
import type { PromptVariableResolver } from './variable-resolver.js';

/**
 * The prompt compiler: it orchestrates the frozen `PROMPT_ASSEMBLY_STAGES` in order (consuming
 * `assemblyStageAtOrAfter`): resolve inheritance and gather layers, resolve variables, compose (assemble
 * in layer order), normalize, finalize, and validate; then build the execution-ready
 * {@link ProviderRequest}. It composes, normalizes, and validates only, up to expression; it executes
 * nothing and invokes no provider. Failures ride the `Result` channel.
 */
export class PromptCompiler {
  readonly #templates: PromptTemplateResolver;
  readonly #variables: PromptVariableResolver;
  readonly #assembler: PromptAssembler;
  readonly #normalizer: PromptNormalizer;
  readonly #validator: PromptValidator;

  constructor(
    templates: PromptTemplateResolver,
    variables: PromptVariableResolver,
    assembler: PromptAssembler,
    normalizer: PromptNormalizer,
    validator: PromptValidator,
  ) {
    this.#templates = templates;
    this.#variables = variables;
    this.#assembler = assembler;
    this.#normalizer = normalizer;
    this.#validator = validator;
  }

  /** The frozen, ordered assembly stages. */
  stages(): readonly PromptAssemblyStage[] {
    return PROMPT_ASSEMBLY_STAGES;
  }

  /** Whether the frozen assembly stages are in constitutional order (consumes `assemblyStageAtOrAfter`). */
  stagesInConstitutionalOrder(): boolean {
    return PROMPT_ASSEMBLY_STAGES.every((stage, index) => {
      const previous = PROMPT_ASSEMBLY_STAGES[index - 1];
      return previous === undefined || assemblyStageAtOrAfter(stage, previous);
    });
  }

  /** Compile a definition into an execution-ready {@link CompiledPrompt}, failing closed. */
  compile(
    definition: PromptDefinition,
    input: CompositionInput,
    registry: PromptRegistry,
    strict: boolean,
  ): Result<CompiledPrompt, PromptError> {
    const resolved = this.#templates.resolve(definition, registry);
    if (isErr(resolved)) {
      return err(resolved.error);
    }
    const substituted = this.#variables.resolve(
      resolved.value,
      definition.requiredVariables,
      input.variables,
      strict,
    );
    if (isErr(substituted)) {
      return err(substituted.error);
    }
    const composed = this.#assembler.assemble(substituted.value);
    const normalized = this.#normalizer.normalize(composed);
    const validation = this.#validator.validate(substituted.value, normalized);
    if (isErr(validation)) {
      return err(validation.error);
    }
    const request: ProviderRequest = Object.freeze({
      capability: definition.capability,
      payload: Object.freeze({ prompt: normalized }),
    });
    const compiled: CompiledPrompt = Object.freeze({
      promptId: definition.id,
      capability: definition.capability,
      content: normalized,
      request,
      compiled: true,
    });
    return ok(compiled);
  }
}
