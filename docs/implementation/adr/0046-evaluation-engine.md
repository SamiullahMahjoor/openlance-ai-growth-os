---
id: ADR-0046
title: The Evaluation Engine is the Runtime's operational assessment subsystem; it operationalizes the frozen ai/evaluation model to measure, score, validate, and compare a subject namespace's output and produces an immutable EvaluationResult, and it never performs, decides, or changes behavior
status: Accepted
date: 2026-08-06
supersedes: []
superseded_by: null
---

# ADR-0046: The Evaluation Engine is the Runtime's operational assessment subsystem; it operationalizes the frozen ai/evaluation model to measure, score, validate, and compare a subject namespace's output and produces an immutable EvaluationResult, and it never performs, decides, or changes behavior

## Status

**Accepted** (Platform Completion, PC-1). Approved under ADR-0007's design-first cadence before implementation began. It introduces no duplicate constitutional or engineering truth, changes no frozen work, supersedes nothing, and preserves every prior ADR and the frozen `phase-4-frozen` baseline.

## Context

Phase 4 froze eleven operational engines (ADR-0035 to ADR-0045) that realize the runtime pipeline `Agent -> Governance -> Safety -> Runtime Execution -> Provider`, observed by Operations. Of the thirteen frozen `packages/namespaces/*` models, exactly two have no operational engine: `evaluation` and `evolution`. The Platform Completion milestone (PC-1) operationalizes `evaluation`; `evolution` is deliberately left a pure domain model (its constitution states it "performs no behavior itself").

A full source reading fixes the facts this ADR must honor:

- **Evaluation measures behavior; it never performs it.** `ai/evaluation/README.md`: "Evaluation measures behavior; it never performs it: it never reasons, executes, decides, or changes the behavior it assesses, and it never defines a metric mechanism, a test harness, a provider, a model, a framework, or code." Its role is "the assessment layer of the AI Operating System ... it observes the outputs of the namespaces it evaluates, one-directionally, without those namespaces depending on it."
- **A result informs; it never decides.** The frozen boundary: "An evaluation result informs a decision but never makes one; the decision, ranking-for-action, or change of behavior drawn from an evaluation is owned by ai/governance/, and any protective response by ai/safety/; evaluation reports and never acts."
- **Evaluation is deterministic, and is a function of fixed inputs.** `ai/evaluation/evaluation.md`: "an evaluation is a function of fixed inputs alone, the given output under assessment, the defined metrics and benchmark, and the rules owned by ai/governance/, applied through defined measurement, scoring, and comparison."
- **The frozen model is a Pure Domain Model (ADR-0024 category 1).** `@openlance/aios-evaluation` exports the classifications (`EVALUATION_PARTS`, `EVALUATION_LIFECYCLE_PHASES`, `EVALUATION_VALIDATION_CHECKS`, boundaries, versioning aspects, compatibility kinds, invariants) and exactly two pure ordering predicates (`evaluationPhaseAtOrAfter`, `evaluationValidationCheckAtOrAfter`); it defines no `EvaluationResult`, `Score`, or `Metric` runtime type. The design doc records that "the assessment of a concrete output is the runtime's."

Source read from origin this session: every `ai/evaluation/*.md` document, `packages/namespaces/evaluation/src/*.ts`, `ai/architecture/ownership-map.md`, `ai/README.md`, and the Phase 4 operational-engine pattern (`apps/operations-engine`, ADR-0045).

## Decision

1. **The Evaluation Engine (Platform Completion, PC-1) is the Runtime's operational assessment subsystem.** It is an `apps/*` package (`@openlance/aios-evaluation-engine`, `aios.layer: "app"`) that consumes the frozen `@openlance/aios-evaluation` model and the substrate, and realizes the operational behavior the frozen model defines: framing, measurement, scoring, validation, comparison, and a validated result. It re-owns nothing; the assessment model stays owned by `ai/evaluation/`, and the engine is its operational realization, exactly as ADR-0035 established for the Phase 4 operational layer.

2. **It consumes an immutable `EvaluationRequest` and produces an immutable `EvaluationResult`.** The request carries the frozen `EVALUATION_PARTS`: an evaluation identity, the subject output under assessment (a subject namespace's output, by reference, never the subject's internals), the framed metrics (each a defined measurement with a caller-supplied measured value, because evaluation "never defines a metric mechanism"), and, where a comparison is made, a benchmark. The result is a deep-frozen, content-hashed record of the measured metrics, the derived score, an optional comparison, and the validation outcome, carrying a verdict of `accepted` or `withheld`.

3. **It runs the frozen lifecycle and validation orders.** The engine drives framing -> measurement -> scoring -> validation -> result, and validates through the conjunctive, ordered checks well-formedness -> grounding -> scoring -> constitutional, both orders taken verbatim from the frozen predicates `evaluationPhaseAtOrAfter` and `evaluationValidationCheckAtOrAfter`. Validation short-circuits at the first failing check (a malformed evaluation is rejected early).

4. **It is fail-closed.** An evaluation that fails any validation check yields no accepted result: the verdict is `withheld`, the score and comparison are withheld, and the failing check is recorded. A structurally malformed or out-of-contract request never makes the public API throw (zero-trust); it is measured as far as it can be and withheld.

5. **It is deterministic and one-directional.** The result and its content-hash id are a pure function of the request and the registered benchmarks, with no `Date.now`, no `Math.random`, and no wall clock in any decision or output path (an injected `Clock` stamps framework events and audit entries only, and is excluded from every id). The engine observes subject outputs one-directionally: it depends only on its own frozen namespace and the substrate, and no subject namespace or engine depends on it (an acyclic leaf).

6. **It never performs, decides, or changes behavior, and holds no vendor knowledge.** It never reasons, retrieves, executes, orchestrates, schedules, authorizes, protects, refuses, escalates, ranks for action, or selects or invokes a provider; the decision or protective response drawn from a result is owned by `ai/governance/` and `ai/safety/`. It redefines no subject's quality definition and reaches into no subject's behavior. These invariants are enforced structurally by src-scanning guard tests (no execution, no decision, no vendor knowledge).

7. **Its extension point is a benchmark registry.** Named, versioned benchmarks (the frozen benchmarking concern: "the fixed reference standards an evaluation measures against") may be registered directly or adopted from a plugin through the frozen `PluginManifest`, validated and frozen through one factory. The engine defines no new container, registry mechanism, event bus, or error framework; those are consumed from the frozen substrate, and it registers through the composition-root seam (ADR-0026 `CompositionConfig.modules`).

## Rationale

The naive reading of "Evaluation Engine" (a service that judges quality by its own definition) would violate the frozen boundary that evaluation "owns no subject behavior or quality definition" and "never defines a metric mechanism." The decision reframes it as what the constitution anticipates: the deterministic operational realization of the frozen assessment model over caller-framed measurements, mirroring how the Operations Engine (ADR-0045) realized the frozen observability model over caller-supplied runtime outputs while never executing. Alternatives considered and rejected:

- **An engine that measures quality itself (owns metrics/quality).** Rejected: it would re-own the subject namespaces' quality definitions and define a metric mechanism, both forbidden by `ai/evaluation/evaluation-boundaries.md`. Measured values are framed inputs; the engine records, scores, validates, and compares them.
- **An engine that decides or ranks outputs for action.** Rejected: "evaluation reports and never acts"; the decision belongs to `ai/governance/`. The result informs only, and carries no decision field.
- **An engine that imports the subject engines to type their outputs.** Rejected: it would risk a cycle and couple evaluation to the pipeline. The subject output is carried by reference with a subject kind, keeping evaluation an acyclic leaf that observes one-directionally.
- **Importing the governance engine to perform constitutional-validation.** Rejected: the frozen model says "Validation defines what is checked and in what order, never the governance rule, which is owned by ai/governance/." The engine's constitutional-validation check verifies the evaluation stays within evaluation's own constitutional position (informs-never-decides, references truth as ground, assesses a known subject); the governance rule is applied downstream when governance consumes the result. The frozen model package itself carries dependency edge `[]`, and the engine mirrors that: it imports no governance.
- **Deferring PC-1 until a bootstrap exists.** Rejected: the Evaluation Engine is self-contained, unblocked, and an acyclic leaf; it is the clean first Platform Completion item and destabilizes nothing.

## Consequences

- The `apps/` layer gains a twelfth operational engine, the operational realization of the twelfth namespace. The thirteenth (`evolution`) remains a pure domain model by decision.
- The Platform Completion milestone continues (PC-2 Provider Adapter architecture, PC-3 AIOS bootstrap) under this same pattern and the ADR-0007 / ADR-0023 cadence; each needs a fresh ADR only for a genuinely new architectural concept.
- The engine's benchmark registry is an operator- and plugin-facing extension point; concrete benchmarks are data, never code in the engine, and can never grant the engine a decision or an execution.
- Changing any of these decisions requires a superseding ADR, an architecture review, and full validation. No frozen namespace, substrate package, constitution document, dependency rule, or prior ADR's decision changes; `ai/` and `knowledge/` remain byte-identical.

## Related constitutional references

Referenced and conformed to, never restated or modified: `ai/evaluation/README.md` and `ai/evaluation/evaluation.md` (evaluation measures and never performs; observes one-directionally; deterministic), `ai/evaluation/evaluation-lifecycle.md` and `ai/evaluation/evaluation-validation.md` (the lifecycle and validation orders realized here), `ai/evaluation/evaluation-boundaries.md` (what evaluation never owns), `ai/governance/` and `ai/safety/` (own the decision and the protective response a result informs), `ai/architecture/ownership-map.md` (Evaluation owns "Quality, testing, grounding, and self-review"), and ADR-0020 / ADR-0024 / ADR-0026 / ADR-0035 (the namespace model, purity categories, composition-root seam, and operational-layer pattern).

## Related ADRs

Supersedes none. Builds on ADR-0035 (the operational-layer pattern and the composition-root seam), ADR-0045 (the Operations Engine, the observer pattern this mirrors), ADR-0026 (the composition-root extension seam), ADR-0005 / ADR-0006 (the frozen DI mechanism and Result error handling), ADR-0020 / ADR-0024 (the namespace model and purity categories), ADR-0007 / ADR-0023 (design-first cadence and development lifecycle), and ADR-0015 (100% coverage). It opens the Platform Completion milestone (PC-1).
