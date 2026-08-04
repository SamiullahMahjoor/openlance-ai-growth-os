/**
 * @packageDocumentation
 * `@openlance/aios-prompt-engine`
 *
 * The Runtime's operational Prompt Engine (Phase 4, Stage 2; ADR-0036), the operational realization of
 * the frozen Prompts namespace. It carries out operational prompt preparation up to expression
 * (definition registration, template and inheritance resolution, variable resolution, assembly in the
 * frozen layer order, normalization, validation) and produces an execution-ready payload (a frozen
 * Provider-Engine `ProviderRequest`), by consuming the frozen `@openlance/aios-prompts` model and the
 * `@openlance/aios-provider-engine` request contract. It re-owns neither prompt semantics nor execution.
 *
 * It executes nothing (it never invokes a provider, reasons, retrieves, assembles the execution context,
 * persists, or expresses a prompt), it caches nothing (a composed prompt is transient), and it contains
 * no vendor knowledge (no vendor client library, request or response model, API URL, or authentication). The
 * compiled `ProviderRequest` is inert until executed through the Provider Engine's governance-cleared
 * executor; the engine introduces no second governance model. The dependency direction is one-way:
 * prompt to provider.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules
 * are prohibited and fail CI. Constitution: OL-AI-PROMPTS-README.
 */

export type {
  CompiledPrompt,
  CompositionInput,
  PromptDefinition,
  PromptDefinitionInput,
  PromptDiagnostics,
  PromptId,
  PromptPart,
  PromptStatistics,
  VariableName,
} from './types.js';

export { PromptError } from './errors.js';
export { PromptRegistry } from './registry.js';
export { PromptFactory } from './factory.js';
export { PromptLifecycle } from './lifecycle.js';
export { PromptTemplateResolver } from './template-resolver.js';
export { PromptVariableResolver } from './variable-resolver.js';
export { PromptAssembler } from './assembler.js';
export { PromptNormalizer } from './normalizer.js';
export { PromptValidator, VALIDATION_ERROR_CODES } from './validator.js';
export { PromptCompiler } from './compiler.js';
export { PromptMetrics } from './metrics.js';
export { PromptEvents, PROMPT_EVENT_TYPES } from './events.js';
export { PromptConfiguration, DEFAULT_SETTINGS } from './configuration.js';
export type { PromptEngineSettings } from './configuration.js';
export { PromptPluginBridge } from './plugin-bridge.js';
export type { PromptPlugin } from './plugin-bridge.js';
export { PromptManager } from './manager.js';
export type { PromptManagerOptions } from './manager.js';
export { promptEngineModule, PROMPT_MANAGER } from './module.js';
