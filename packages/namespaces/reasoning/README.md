# @openlance/aios-reasoning

The immutable, technology-neutral **domain model** of the AI layer's reasoning abstraction.

- **Constitution:** `ai/reasoning/` (id `OL-AI-REASONING-README`), the **Specification** authority layer.
- **Category:** Pure Algorithms (ADR-0024, category 2) - it owns the cognitive model of the AI layer, whose
  executable core is three pure deterministic algorithms; realized at this layer per ADR-0020 as an
  **immutable, stateless domain model** (no IO). **Design:**
  [docs/implementation/15-reasoning.md](../../../docs/implementation/15-reasoning.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

It states reasoning truth as strongly-typed classifications, immutable definitions and invariants, and
pure deterministic algorithms that express the reasoning specification verbatim. Reasoning is the
cognitive layer: this package defines how retrieved knowledge is transformed, under governing rules, into
governed conclusions, through a lifecycle, an ordered workflow, a state model, architectural categories,
validation, consistency, uncertainty classification, conclusion formation, quality, and boundaries. It
**never executes reasoning, never determines the knowledge it reasons over, never expresses itself as a
prompt, and never defines an algorithm, a chain of thought, a hidden reasoning process, a method, a
provider, a model, a protocol, or code** (`ai/reasoning/README.md`, ADR-0020): the mechanism that carries
a concrete reasoning along its stages is the runtime's. It consumes retrieved knowledge and governing
rules and owns neither the truth nor the rules. It owns no runtime, no mutable state, no lifecycle, no
events, no IO, and no services.

### Why a Pure Domain Model for a "Pure Algorithms" namespace

ADR-0024 classifies Reasoning as **category 2 (Pure Algorithms)**: a namespace whose truth includes
deterministic algorithms, not only classifications. ADR-0020 - foundational to and cited by ADR-0024 -
fixes how *every* technology-neutral constitutional namespace is realized in code: "a set of types, frozen
data, and pure predicates... no IO," while "the category a namespace belongs to is fixed by ADR-0024." The
two coexist: Reasoning's algorithms are the constitution's own **relations and orderings** over
reasoning-owned classifications - the stage-transition relation and the lifecycle-phase and workflow-step
orderings - each expressed verbatim as a pure, total, deterministic predicate. The constitution
independently forbids this namespace from becoming an algorithm, a chain of thought, or code; so Reasoning
owns the cognitive model **as an immutable specification model**, and the reasoning execution over a
concrete task is the runtime's.

## Public API (single barrel, Engineering Rule 1)

All ten reasoning concerns from `ai/reasoning/`, plus the namespace-wide truth, are implemented as an
immutable model. Each concern exposes its **Principles** and **Invariants** (the two normative sections of
the Reasoning Document Standard), and, where the **Specification** enumerates a genuine closed domain set,
that classification too.

- **Namespace** (`README.md`, `reasoning.md`): `ReasoningInvariant` + `REASONING_INVARIANTS` (the eight
  reasoning invariants every concern instantiates); `ReasoningConcern` + `REASONING_CONCERNS` (the ten
  concerns). Reasoning is deterministic, repeatable, and scalable.
- **Reasoning lifecycle** (`reasoning-lifecycle.md`): principles, invariants, and `ReasoningLifecyclePhase`
  + `REASONING_LIFECYCLE_PHASES` (the four ordered phases: framing, transformation, conclusion,
  validation), with the pure predicate `reasoningPhaseAtOrAfter`.
- **Reasoning workflow** (`reasoning-workflow.md`): principles, invariants, and `ReasoningWorkflowStep` +
  `REASONING_WORKFLOW_STEPS` (the nine ordered steps: receive-request, frame, decompose, analyze,
  synthesize, handle-uncertainty, form-conclusion, validate, produce-outcome), with the pure predicate
  `reasoningStepAtOrAfter`.
- **Reasoning stages** (`reasoning-stages.md`): principles, invariants, and `ReasoningStage` +
  `REASONING_STAGES` (the ten states), the state model's directed graph `REASONING_STAGE_TRANSITIONS`, and
  the pure predicate `transitionAllowed` - the namespace's genuine deterministic algorithm. The order that
  drives transitions is owned by `reasoning-workflow.md`, referenced not restated.
- **Reasoning strategies** (`reasoning-strategies.md`): principles, invariants, and `ReasoningStrategy` +
  `REASONING_STRATEGIES` (the four architectural categories: decomposition, synthesis, comparison,
  trade-off-analysis). How any category is performed is owned outside the namespace.
- **Reasoning validation** (`reasoning-validation.md`): principles, invariants, and
  `ReasoningValidationDimension` + `REASONING_VALIDATION_DIMENSIONS` (the four conjunctive dimensions a
  reasoning is validated against: assumption-identification, grounding, evidence-sufficiency,
  governed-validation); the governance rule is applied not restated.
- **Reasoning consistency** and **conclusion formation** (`reasoning-consistency.md`,
  `conclusion-formation.md`): principles and invariants; their Specification sections narrate process
  facets and a single formation procedure, not a closed taxonomy the model refers to by identity, so they
  are definitions only (the modeling rule recorded in
  [docs/implementation/13-retrieval.md](../../../docs/implementation/13-retrieval.md) section 4).
- **Uncertainty handling** (`uncertainty-handling.md`): principles, invariants, and `UncertaintyKind` +
  `UNCERTAINTY_KINDS` (the five architectural kinds: knowledge, interpretation, conflict, applicability,
  authority). No probability, statistic, or confidence value is defined.
- **Reasoning quality** (`reasoning-quality.md`): principles, invariants, and `ReasoningQualityProperty` +
  `REASONING_QUALITY_PROPERTIES` (the two structural properties: completeness, traceability). No numeric
  quality or grade is defined.
- **Reasoning boundaries** (`reasoning-boundaries.md`): principles, invariants, and `ReasoningBoundary` +
  `REASONING_BOUNDARIES` (the five architectural boundaries: transformation, knowledge, governance,
  expression, implementation).

Every exported symbol traces directly to a frozen `ai/reasoning/` document. No reasoning engine, chain of
thought, prompt builder, or runtime evaluator (`reason(task)`, `conclude(evidence)`) is exported; that
boundary is absolute (ADR-0020).

## Dependency direction

Per the frozen `ai/architecture/dependency-map.md`, Reasoning depends on the constitution, the Governance
namespace, and the Retrieval namespace (dependency-cruiser `NAMESPACE_DEPS.reasoning = ['governance',
'retrieval']`). As a pure domain model it uses no governance-owned or retrieval-owned type and imports no
package - it references those models and the knowledge repository in prose and never restates or imports
them (ADR-0021, import only what you use; referenced-model non-restatement) - so it imports nothing and
its dependency edges are `[]`.

## Non-responsibilities

It owns no retrieval, loading, execution, execution-context assembly, memory, prompt, provider, tool,
agent, evaluation, safety, or operations behavior, no business truth, and no governance rule. It transforms
retrieved knowledge into a governed conclusion and stops; forming a concrete conclusion over a concrete
task, and expressing or acting on it, are performed by the runtime and the surrounding namespaces, which
consume this model.
