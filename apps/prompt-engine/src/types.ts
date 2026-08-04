import type { PromptLayer, PromptLifecyclePhase } from '@openlance/aios-prompts';
import type { Capability, ProviderRequest } from '@openlance/aios-provider-engine';

/** A prompt definition's stable identity within the engine. */
export type PromptId = string;

/** The name of a variable a prompt definition declares and a composition supplies. */
export type VariableName = string;

/**
 * One layered part of a prompt definition (durable architecture). `content` may contain `{{name}}`
 * variable slots. A `context`-layer part is a reference (`reference: true`): it points to knowledge and
 * never embeds it.
 */
export interface PromptPart {
  readonly layer: PromptLayer;
  readonly content: string;
  readonly reference?: boolean;
}

/**
 * A durable prompt definition: the reusable structure a prompt is composed from ("a durable definition
 * persists as architecture, not as a prompt"). It targets a provider `Capability`, holds ordered layered
 * parts, declares its required variables, carries a lifecycle phase, and may derive from a base
 * definition.
 */
export interface PromptDefinition {
  readonly id: PromptId;
  readonly capability: Capability;
  readonly parts: readonly PromptPart[];
  readonly requiredVariables: readonly VariableName[];
  readonly phase: PromptLifecyclePhase;
  readonly inheritsFrom?: PromptId;
}

/** A prompt definition's registration input; the factory validates it and fills defaults. */
export interface PromptDefinitionInput {
  readonly id: PromptId;
  readonly capability: Capability;
  readonly parts: readonly PromptPart[];
  readonly requiredVariables?: readonly VariableName[];
  readonly phase?: PromptLifecyclePhase;
  readonly inheritsFrom?: PromptId;
}

/** The variables and context references supplied for one composition. */
export interface CompositionInput {
  readonly variables: Readonly<Record<VariableName, string>>;
  readonly contextReferences?: readonly string[];
}

/**
 * The execution-ready compiled prompt (composed, normalized, and validated up to expression). Its
 * `request` is the frozen Provider-Engine `ProviderRequest` the Provider Engine executes; the Prompt
 * Engine never executes it.
 */
export interface CompiledPrompt {
  readonly promptId: PromptId;
  readonly capability: Capability;
  readonly content: string;
  readonly request: ProviderRequest;
  readonly compiled: true;
}

/** A read-only snapshot of the engine's operational counters. */
export interface PromptStatistics {
  readonly registrations: number;
  readonly compilations: number;
  readonly successes: number;
  readonly failures: number;
  readonly validationFailures: number;
}

/** A read-only operational view of the engine. */
export interface PromptDiagnostics {
  readonly definitionCount: number;
  readonly statistics: PromptStatistics;
}
