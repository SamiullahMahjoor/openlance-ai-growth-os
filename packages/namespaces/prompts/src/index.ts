/**
 * @packageDocumentation
 * `@openlance/aios-prompts`
 *
 * The immutable, technology-neutral domain model of the AI layer's prompt abstraction (Specification
 * authority, ai/prompts/). It states how a prompt is layered, composed, assembled, structured, validated,
 * inherited, versioned, and consumed, so that reasoning can be expressed as a governed, transient
 * instruction, as strongly-typed classifications, immutable definitions and invariants, and four pure
 * ordering predicates: the layer, lifecycle-phase, assembly-stage, and validation-check orderings, which
 * express the prompt specification verbatim.
 *
 * It performs no execution and no IO: a prompt is composed and validated up to expression, and the runtime
 * carries it and the Providers namespace executes it; the namespace defines no template language, syntax,
 * format, provider, model, framework, or code, and contains no prompt text (ADR-0020; the namespace is
 * ADR-0024 category 1, Pure Domain Model, declared per §42, realized here as an immutable stateless domain
 * model with no IO). A prompt points to knowledge and never embeds or restates it; the models owned by
 * ai/governance/, ai/reasoning/, ai/retrieval/, ai/memory/, the Agents namespace, and the knowledge
 * repository are referenced in prose and never restated as prompt classifications.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules
 * are prohibited and fail CI. Constitution: OL-AI-PROMPTS-README.
 */

export type { PromptInvariant, PromptConcern } from './namespace.js';
export {
  PROMPT_INVARIANTS,
  PROMPT_INVARIANT_DESCRIPTIONS,
  PROMPT_CONCERNS,
  PROMPT_CONCERN_DESCRIPTIONS,
} from './namespace.js';

export type {
  PromptArchitecturePrinciple,
  PromptLayer,
  PromptArchitectureInvariant,
} from './prompt-architecture.js';
export {
  PROMPT_ARCHITECTURE_PRINCIPLES,
  PROMPT_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS,
  PROMPT_LAYERS,
  PROMPT_LAYER_DESCRIPTIONS,
  promptLayerAtOrAfter,
  PROMPT_ARCHITECTURE_INVARIANTS,
  PROMPT_ARCHITECTURE_INVARIANT_DESCRIPTIONS,
} from './prompt-architecture.js';

export type {
  PromptLifecyclePrinciple,
  PromptLifecyclePhase,
  PromptLifecycleInvariant,
} from './prompt-lifecycle.js';
export {
  PROMPT_LIFECYCLE_PRINCIPLES,
  PROMPT_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  PROMPT_LIFECYCLE_PHASES,
  PROMPT_LIFECYCLE_PHASE_DESCRIPTIONS,
  promptPhaseAtOrAfter,
  PROMPT_LIFECYCLE_INVARIANTS,
  PROMPT_LIFECYCLE_INVARIANT_DESCRIPTIONS,
} from './prompt-lifecycle.js';

export type {
  PromptCompositionPrinciple,
  PromptCompositionInvariant,
} from './prompt-composition.js';
export {
  PROMPT_COMPOSITION_PRINCIPLES,
  PROMPT_COMPOSITION_PRINCIPLE_DESCRIPTIONS,
  PROMPT_COMPOSITION_INVARIANTS,
  PROMPT_COMPOSITION_INVARIANT_DESCRIPTIONS,
} from './prompt-composition.js';

export type {
  PromptAssemblyPrinciple,
  PromptAssemblyStage,
  PromptAssemblyInvariant,
} from './prompt-assembly.js';
export {
  PROMPT_ASSEMBLY_PRINCIPLES,
  PROMPT_ASSEMBLY_PRINCIPLE_DESCRIPTIONS,
  PROMPT_ASSEMBLY_STAGES,
  PROMPT_ASSEMBLY_STAGE_DESCRIPTIONS,
  assemblyStageAtOrAfter,
  PROMPT_ASSEMBLY_INVARIANTS,
  PROMPT_ASSEMBLY_INVARIANT_DESCRIPTIONS,
} from './prompt-assembly.js';

export type { PromptTemplatePrinciple, PromptTemplateInvariant } from './prompt-templates.js';
export {
  PROMPT_TEMPLATE_PRINCIPLES,
  PROMPT_TEMPLATE_PRINCIPLE_DESCRIPTIONS,
  PROMPT_TEMPLATE_INVARIANTS,
  PROMPT_TEMPLATE_INVARIANT_DESCRIPTIONS,
} from './prompt-templates.js';

export type { PromptContextPrinciple, PromptContextInvariant } from './prompt-context.js';
export {
  PROMPT_CONTEXT_PRINCIPLES,
  PROMPT_CONTEXT_PRINCIPLE_DESCRIPTIONS,
  PROMPT_CONTEXT_INVARIANTS,
  PROMPT_CONTEXT_INVARIANT_DESCRIPTIONS,
} from './prompt-context.js';

export type {
  PromptValidationPrinciple,
  PromptValidationCheck,
  PromptValidationInvariant,
} from './prompt-validation.js';
export {
  PROMPT_VALIDATION_PRINCIPLES,
  PROMPT_VALIDATION_PRINCIPLE_DESCRIPTIONS,
  PROMPT_VALIDATION_CHECKS,
  PROMPT_VALIDATION_CHECK_DESCRIPTIONS,
  validationCheckAtOrAfter,
  PROMPT_VALIDATION_INVARIANTS,
  PROMPT_VALIDATION_INVARIANT_DESCRIPTIONS,
} from './prompt-validation.js';

export type {
  PromptInheritancePrinciple,
  PromptInheritanceInvariant,
} from './prompt-inheritance.js';
export {
  PROMPT_INHERITANCE_PRINCIPLES,
  PROMPT_INHERITANCE_PRINCIPLE_DESCRIPTIONS,
  PROMPT_INHERITANCE_INVARIANTS,
  PROMPT_INHERITANCE_INVARIANT_DESCRIPTIONS,
} from './prompt-inheritance.js';

export type {
  PromptBoundaryPrinciple,
  PromptBoundary,
  PromptBoundaryInvariant,
} from './prompt-boundaries.js';
export {
  PROMPT_BOUNDARY_PRINCIPLES,
  PROMPT_BOUNDARY_PRINCIPLE_DESCRIPTIONS,
  PROMPT_BOUNDARIES,
  PROMPT_BOUNDARY_DESCRIPTIONS,
  PROMPT_BOUNDARY_INVARIANTS,
  PROMPT_BOUNDARY_INVARIANT_DESCRIPTIONS,
} from './prompt-boundaries.js';

export type {
  PromptVersioningPrinciple,
  PromptVersioningInvariant,
} from './prompt-versioning.js';
export {
  PROMPT_VERSIONING_PRINCIPLES,
  PROMPT_VERSIONING_PRINCIPLE_DESCRIPTIONS,
  PROMPT_VERSIONING_INVARIANTS,
  PROMPT_VERSIONING_INVARIANT_DESCRIPTIONS,
} from './prompt-versioning.js';
