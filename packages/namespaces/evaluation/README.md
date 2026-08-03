# @openlance/aios-evaluation

The immutable, technology-neutral **domain model** of the AI layer's assessment abstraction.

- **Constitution:** `ai/evaluation/` (id `OL-AI-EVALUATION-README`), the **Specification** authority layer.
- **Category:** Pure Domain Model (ADR-0024 category 1, declared per ADR-0024 §42, the same shape as Governance
  and Safety), realized per ADR-0020 as an **immutable, stateless domain model** (no IO).
  **Design:** [docs/implementation/20-evaluation.md](../../../docs/implementation/20-evaluation.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

It states evaluation truth as strongly-typed classifications, immutable definitions and invariants, and two
pure deterministic algorithms that express the evaluation specification verbatim. Evaluation is the assessment
layer: this package defines how the output of the AI layer is measured, scored, validated, benchmarked, and
compared, so that behavior can be judged, deterministically and neutrally. It **measures behavior; it never
performs it**: it never reasons, executes, decides, or changes the behavior it assesses, and it **defines no
metric mechanism, test harness, provider, model, framework, language, runtime, protocol, interface, or code**
(`ai/evaluation/README.md`, ADR-0020). It owns no mutable state, no lifecycle, no events, no IO, and no
services.

### Why a Pure Domain Model, declared per ADR-0024 §42

ADR-0024 does not enumerate Evaluation among its five worked examples. ADR-0024 §42 provides for exactly this:
when a namespace is not enumerated, its purity category is declared in the design document, with no new ADR.
Evaluation is declared **category 1 (Pure Domain Model)** because it owns a model of *truth about how output is
judged*, not an integration, an orchestration or runtime service, or a composition root. The frozen
`ai/evaluation/` documents are technology-neutral specifications that "define the evaluation model, never how an
evaluation is implemented or executed" (`ai/evaluation/README.md`). So the package that conforms to that spec
owns the evaluation model **as an immutable specification model**; the assessment of a concrete output is the
operational runtime's, built later, outside this constitutional-conformance package. Category 1 and ADR-0020
coincide: a Pure Domain Model realized exactly as ADR-0020 prescribes.

## Public API (single barrel, Engineering Rule 1)

All ten evaluation concerns from `ai/evaluation/`, plus the namespace-wide truth, are implemented as an
immutable model. Each concern exposes its **Principles** and **Invariants** (the two normative sections of the
Evaluation Document Standard), and, where the **Specification** enumerates a genuine closed domain set, that
classification too.

- **Namespace** (`README.md`, `evaluation.md`): `EvaluationInvariant` + `EVALUATION_INVARIANTS` (7);
  `EvaluationConcern` + `EVALUATION_CONCERNS` (10).
- **Architecture** (`evaluation-architecture.md`): `EvaluationPart` + `EVALUATION_PARTS` (4: identity,
  subject-output, metrics, benchmark) - the parts an evaluation is composed of.
- **Lifecycle** (`evaluation-lifecycle.md`): `EvaluationLifecyclePhase` + `EVALUATION_LIFECYCLE_PHASES`
  (5 ordered: framing, measurement, scoring, validation, result), with `evaluationPhaseAtOrAfter`.
- **Validation** (`evaluation-validation.md`): `EvaluationValidationCheck` + `EVALUATION_VALIDATION_CHECKS`
  (4 ordered: well-formedness, grounding, scoring, constitutional), with `evaluationValidationCheckAtOrAfter`.
- **Compatibility** (`evaluation-compatibility.md`): `EvaluationCompatibilityKind` +
  `EVALUATION_COMPATIBILITY_KINDS` (2: subject, version).
- **Boundaries** (`evaluation-boundaries.md`): `EvaluationBoundary` + `EVALUATION_BOUNDARIES` (6: behavior,
  decision, subject, one-directional, truth, implementation).
- **Versioning** (`evaluation-versioning.md`): `EvaluationVersioningAspect` + `EVALUATION_VERSIONING_ASPECTS`
  (4: version-rules, evolution, migration, deprecation).
- **Metrics, scoring, benchmarking, comparison** (`evaluation-metrics.md`, `evaluation-scoring.md`,
  `evaluation-benchmarking.md`, `evaluation-comparison.md`): principles and invariants only; their Specification
  sections narrate heterogeneous facets of one model, not closed taxonomies the model refers to by identity (the
  modeling rule recorded in
  [docs/implementation/13-retrieval.md](../../../docs/implementation/13-retrieval.md) section 4). The quality a
  metric measures against, and the business truth grounding rests on, are owned by the subject namespaces and
  the knowledge repository, referenced not recreated.

Every exported symbol traces directly to a frozen `ai/evaluation/` document. No metric mechanism, test harness,
scorer, comparator, or assessment engine (`measure(...)`, `score(...)`, `evaluate(output)`) is exported; that
boundary is absolute (ADR-0020).

## Dependency direction

Per the frozen `ai/architecture/dependency-map.md`, Evaluation depends on the constitution and Governance
(dependency-cruiser `NAMESPACE_DEPS.evaluation = ['governance']`). As a pure domain model it uses no type owned
by Governance and imports no package - it references the governance rules it applies, the subject namespaces it
observes, and the knowledge repository in prose and never restates or imports them (ADR-0021, import only what
you use; referenced-model non-restatement) - so it imports nothing and its dependency edges are `[]`. Evaluation
observes the subject namespaces one-directionally, and no subject depends on it, so no cycle is possible.

## Non-responsibilities

It owns no governance rule, no safety rule, no business truth, no subject behavior (reasoning, retrieval,
prompts, memory, agents, providers, tools) and no definition of that behavior's quality, no decision or
protection its results inform, and no implementation. It defines the evaluation model; measuring, scoring, and
assessing a concrete output are the operational runtime's, which consumes this model.
