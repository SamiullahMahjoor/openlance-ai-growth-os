# @openlance/aios-prompts

The immutable, technology-neutral **domain model** of the AI layer's prompt abstraction.

- **Constitution:** `ai/prompts/` (id `OL-AI-PROMPTS-README`), the **Specification** authority layer.
- **Category:** Pure Domain Model (ADR-0024, category 1) - it owns the expression model of the AI layer;
  realized at this layer per ADR-0020 as an **immutable, stateless domain model** (no IO). ADR-0024 does
  not enumerate Prompts among its examples; its category is declared here per ADR-0024 §42 (no new ADR).
  **Design:** [docs/implementation/16-prompts.md](../../../docs/implementation/16-prompts.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

It states prompt truth as strongly-typed classifications, immutable definitions and invariants, and pure
ordering predicates that express the prompt specification verbatim. Prompts are the expression layer: this
package defines how a prompt is layered, composed, assembled, structured, validated, inherited, versioned,
and consumed, so that reasoning can be expressed as a governed, transient instruction. It **never writes a
prompt, never determines the knowledge a prompt points to, never reasons, never executes, and never defines
a template language, a syntax, a format, a provider, a model, a framework, or code, and it contains no
prompt text** (`ai/prompts/README.md`, ADR-0020): a prompt is composed and validated up to expression, and
the runtime carries it and the Providers namespace executes it. A prompt points to knowledge and never
embeds, restates, stores, or becomes it. It owns no runtime, no mutable state, no lifecycle, no events, no
IO, and no services.

### Why a Pure Domain Model with predicates

ADR-0024 category 1 (Pure Domain Model) "contains domain models, classifications, immutable definitions,
and **pure predicates**" - the same shape as Governance, which also exposes ordering predicates. Prompts'
four predicates are the constitution's own **orderings** over prompt-owned classifications (the layer,
lifecycle-phase, assembly-stage, and validation-check orderings), each expressed verbatim as a pure, total,
deterministic predicate. The namespace owns the expression **model** (truth about how a prompt is
structured), not computation; the composition of a concrete prompt is the runtime's.

## Public API (single barrel, Engineering Rule 1)

All ten prompt concerns from `ai/prompts/`, plus the namespace-wide truth, are implemented as an immutable
model. Each concern exposes its **Principles** and **Invariants** (the two normative sections of the Prompt
Document Standard), and, where the **Specification** enumerates a genuine closed domain set, that
classification too.

- **Namespace** (`README.md`, `prompts.md`): `PromptInvariant` + `PROMPT_INVARIANTS` (the eight prompt
  invariants every concern instantiates); `PromptConcern` + `PROMPT_CONCERNS` (the ten concerns). Prompt
  composition is deterministic, repeatable, and scalable.
- **Prompt architecture** (`prompt-architecture.md`): principles, invariants, and `PromptLayer` +
  `PROMPT_LAYERS` (the five ordered layers: governing, role, intent, context, task), with the pure predicate
  `promptLayerAtOrAfter`.
- **Prompt lifecycle** (`prompt-lifecycle.md`): principles, invariants, and `PromptLifecyclePhase` +
  `PROMPT_LIFECYCLE_PHASES` (the five ordered phases: definition, composition, validation, expression,
  retirement), with the pure predicate `promptPhaseAtOrAfter`.
- **Prompt assembly** (`prompt-assembly.md`): principles, invariants, and `PromptAssemblyStage` +
  `PROMPT_ASSEMBLY_STAGES` (the six ordered stages: resolve-inheritance, gather-layers-and-template,
  reference-context, compose, normalize, finalize-for-validation), with the pure predicate
  `assemblyStageAtOrAfter`.
- **Prompt validation** (`prompt-validation.md`): principles, invariants, and `PromptValidationCheck` +
  `PROMPT_VALIDATION_CHECKS` (the four ordered checks: governance-conformance, boundary-conformance,
  structural-completeness, grounding-and-separation), with the pure predicate `validationCheckAtOrAfter`;
  the concern explicitly owns "prompt validation ordering", so the order is a grounded predicate, and the
  governance rules the first check applies are applied not restated.
- **Prompt boundaries** (`prompt-boundaries.md`): principles, invariants, and `PromptBoundary` +
  `PROMPT_BOUNDARIES` (the six architectural boundaries: truth, reasoning, retrieval-and-memory, execution,
  governance, implementation).
- **Prompt composition, templates, context, inheritance, versioning** (`prompt-composition.md`,
  `prompt-templates.md`, `prompt-context.md`, `prompt-inheritance.md`, `prompt-versioning.md`): principles
  and invariants; their Specification sections narrate heterogeneous process facets (composition), model
  and reuse/consistency properties (templates), separation facets (context), a hierarchy and dependency
  model (inheritance), and versioning facets (versioning), not closed taxonomies the model refers to by
  identity, so they are definitions only (the modeling rule recorded in
  [docs/implementation/13-retrieval.md](../../../docs/implementation/13-retrieval.md) section 4). In
  particular, inheritance conflict resolution applies the Authority Hierarchy (`ai/README.md`) and the
  ownership map (`ai/architecture/`) and is stated as prose, never recreated as an executable precedence
  (referenced-model non-restatement; ADR-0025).

Every exported symbol traces directly to a frozen `ai/prompts/` document. No prompt engine, template
renderer, or runtime evaluator (`compose(intent)`, `render(prompt)`) is exported, and no prompt text; that
boundary is absolute (ADR-0020).

## Dependency direction

Per the frozen `ai/architecture/dependency-map.md`, Prompts depends on the constitution, the Governance
namespace, and the Retrieval namespace (dependency-cruiser `NAMESPACE_DEPS.prompts = ['governance',
'retrieval']`). As a pure domain model it uses no governance-owned or retrieval-owned type and imports no
package - it references those models, the reasoning and memory and runtime models, the Agents namespace,
and the knowledge repository in prose and never restates or imports them (ADR-0021, import only what you
use; referenced-model non-restatement) - so it imports nothing and its dependency edges are `[]`.

## Non-responsibilities

It owns no execution, orchestration, reasoning, retrieval, memory, provider, model, tool, agent,
evaluation, or operations behavior, no business truth, no governance rule, and no prompt content. It defines
how a prompt is built up to expression and stops; composing a concrete prompt, carrying it, and executing
it are performed by the runtime and the Providers namespace, which consume this model.
