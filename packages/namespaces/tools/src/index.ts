/**
 * @packageDocumentation
 * `@openlance/aios-tools`
 *
 * The immutable, technology-neutral domain model of the AI layer's tool abstraction (Specification
 * authority, ai/tools/). It states what a tool is as an architectural capability through which an agent
 * interacts with something outside its own reasoning, and how a tool is identified, declared, selected,
 * executed, validated, composed, and evolved, as strongly-typed classifications, immutable definitions and
 * invariants, and two pure ordering predicates: the lifecycle-phase and validation-check orderings, which
 * express the tool specification verbatim.
 *
 * It performs no reasoning, makes no decision, holds no permission, and performs no IO: a tool is selected,
 * validated, and composed as a model, and the runtime carries out the interaction; the namespace defines no
 * provider, model, framework, protocol, interface, network, or code, and it names no outside system
 * (ADR-0020; the namespace is ADR-0024 category 4, Infrastructure Adapter - its "Tool adapters" example -
 * realized here as an immutable stateless domain model with no IO). It references the models owned by
 * ai/governance/, ai/safety/, ai/reasoning/, ai/runtime/, ai/providers/, ai/agents/, the Authority
 * Hierarchy (ai/README.md), and the knowledge repository in prose and never restates them as tool
 * classifications.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules are
 * prohibited and fail CI. Constitution: OL-AI-TOOLS-README.
 */

export type { ToolInvariant, ToolConcern } from './namespace.js';
export {
  TOOL_INVARIANTS,
  TOOL_INVARIANT_DESCRIPTIONS,
  TOOL_CONCERNS,
  TOOL_CONCERN_DESCRIPTIONS,
} from './namespace.js';

export type {
  ToolArchitecturePrinciple,
  ToolPart,
  ToolArchitectureInvariant,
} from './tool-architecture.js';
export {
  TOOL_ARCHITECTURE_PRINCIPLES,
  TOOL_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS,
  TOOL_PARTS,
  TOOL_PART_DESCRIPTIONS,
  TOOL_ARCHITECTURE_INVARIANTS,
  TOOL_ARCHITECTURE_INVARIANT_DESCRIPTIONS,
} from './tool-architecture.js';

export type {
  ToolLifecyclePrinciple,
  ToolLifecyclePhase,
  ToolLifecycleInvariant,
} from './tool-lifecycle.js';
export {
  TOOL_LIFECYCLE_PRINCIPLES,
  TOOL_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  TOOL_LIFECYCLE_PHASES,
  TOOL_LIFECYCLE_PHASE_DESCRIPTIONS,
  toolPhaseAtOrAfter,
  TOOL_LIFECYCLE_INVARIANTS,
  TOOL_LIFECYCLE_INVARIANT_DESCRIPTIONS,
} from './tool-lifecycle.js';

export type { ToolCapabilitiesPrinciple, ToolCapabilitiesInvariant } from './tool-capabilities.js';
export {
  TOOL_CAPABILITIES_PRINCIPLES,
  TOOL_CAPABILITIES_PRINCIPLE_DESCRIPTIONS,
  TOOL_CAPABILITIES_INVARIANTS,
  TOOL_CAPABILITIES_INVARIANT_DESCRIPTIONS,
} from './tool-capabilities.js';

export type { ToolSelectionPrinciple, ToolSelectionInvariant } from './tool-selection.js';
export {
  TOOL_SELECTION_PRINCIPLES,
  TOOL_SELECTION_PRINCIPLE_DESCRIPTIONS,
  TOOL_SELECTION_INVARIANTS,
  TOOL_SELECTION_INVARIANT_DESCRIPTIONS,
} from './tool-selection.js';

export type { ToolExecutionPrinciple, ToolExecutionInvariant } from './tool-execution.js';
export {
  TOOL_EXECUTION_PRINCIPLES,
  TOOL_EXECUTION_PRINCIPLE_DESCRIPTIONS,
  TOOL_EXECUTION_INVARIANTS,
  TOOL_EXECUTION_INVARIANT_DESCRIPTIONS,
} from './tool-execution.js';

export type {
  ToolValidationPrinciple,
  ToolValidationCheck,
  ToolValidationInvariant,
} from './tool-validation.js';
export {
  TOOL_VALIDATION_PRINCIPLES,
  TOOL_VALIDATION_PRINCIPLE_DESCRIPTIONS,
  TOOL_VALIDATION_CHECKS,
  TOOL_VALIDATION_CHECK_DESCRIPTIONS,
  toolValidationCheckAtOrAfter,
  TOOL_VALIDATION_INVARIANTS,
  TOOL_VALIDATION_INVARIANT_DESCRIPTIONS,
} from './tool-validation.js';

export type { ToolCompositionPrinciple, ToolCompositionInvariant } from './tool-composition.js';
export {
  TOOL_COMPOSITION_PRINCIPLES,
  TOOL_COMPOSITION_PRINCIPLE_DESCRIPTIONS,
  TOOL_COMPOSITION_INVARIANTS,
  TOOL_COMPOSITION_INVARIANT_DESCRIPTIONS,
} from './tool-composition.js';

export type {
  ToolCompatibilityPrinciple,
  ToolCompatibilityKind,
  ToolCompatibilityInvariant,
} from './tool-compatibility.js';
export {
  TOOL_COMPATIBILITY_PRINCIPLES,
  TOOL_COMPATIBILITY_PRINCIPLE_DESCRIPTIONS,
  TOOL_COMPATIBILITY_KINDS,
  TOOL_COMPATIBILITY_KIND_DESCRIPTIONS,
  TOOL_COMPATIBILITY_INVARIANTS,
  TOOL_COMPATIBILITY_INVARIANT_DESCRIPTIONS,
} from './tool-compatibility.js';

export type {
  ToolBoundaryPrinciple,
  ToolBoundary,
  ToolBoundaryInvariant,
} from './tool-boundaries.js';
export {
  TOOL_BOUNDARY_PRINCIPLES,
  TOOL_BOUNDARY_PRINCIPLE_DESCRIPTIONS,
  TOOL_BOUNDARIES,
  TOOL_BOUNDARY_DESCRIPTIONS,
  TOOL_BOUNDARY_INVARIANTS,
  TOOL_BOUNDARY_INVARIANT_DESCRIPTIONS,
} from './tool-boundaries.js';

export type {
  ToolVersioningPrinciple,
  ToolVersioningAspect,
  ToolVersioningInvariant,
} from './tool-versioning.js';
export {
  TOOL_VERSIONING_PRINCIPLES,
  TOOL_VERSIONING_PRINCIPLE_DESCRIPTIONS,
  TOOL_VERSIONING_ASPECTS,
  TOOL_VERSIONING_ASPECT_DESCRIPTIONS,
  TOOL_VERSIONING_INVARIANTS,
  TOOL_VERSIONING_INVARIANT_DESCRIPTIONS,
} from './tool-versioning.js';
