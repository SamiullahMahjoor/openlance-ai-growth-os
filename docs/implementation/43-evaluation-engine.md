# 43 - Evaluation Engine (Platform Completion, PC-1)

Design artifact for `@openlance/aios-evaluation-engine`, approved with [ADR-0046](adr/0046-evaluation-engine.md) under the ADR-0007 design-first cadence and the ADR-0023 development lifecycle. This document is the Stage design; on completion the engine is validated, benchmarked, independently audited, documented, committed, and frozen (`EVALUATION-ENGINE-FREEZE.md`).

This is the first item of the Platform Completion milestone (the prerequisite to Phase 5, AI Growth OS Features). It is not Phase 5.

## 1. Purpose

The Evaluation Engine is the Runtime's operational assessment subsystem: the operational realization of the frozen `ai/evaluation/` assessment model. It completes the observation tier of the AI Operating System, alongside the Operations Engine: Operations judges the health of the running layer; Evaluation judges the quality of the layer's output. It measures, scores, validates, and compares a subject namespace's output, deterministically and neutrally, and produces an immutable result that informs a decision it never makes.

## 2. Constitutional grounding

- Namespace: `ai/evaluation/` (Specification authority). Ownership map: Evaluation owns "Quality, testing, grounding, and self-review."
- Frozen model consumed: `@openlance/aios-evaluation` (ADR-0024 category 1, Pure Domain Model). The engine applies its classifications and the two pure ordering predicates; it redefines none of them.
  - `EVALUATION_PARTS` = identity, subject-output, metrics, benchmark.
  - `EVALUATION_LIFECYCLE_PHASES` = framing, measurement, scoring, validation, result; ordered by `evaluationPhaseAtOrAfter`.
  - `EVALUATION_VALIDATION_CHECKS` = well-formedness, grounding, scoring, constitutional; ordered by `evaluationValidationCheckAtOrAfter`, conjunctive.
  - `EVALUATION_BOUNDARIES` = behavior, decision, subject, one-directional, truth, implementation.
- Invariants realized: measures-never-performs, observes-one-directionally, deterministic, grounded-and-validated, result-informs-never-decides, owns-no-subject-behavior-or-quality-definition, single-owned-technology-neutral-scalable.

## 3. Inputs and outputs

- Input: an immutable `EvaluationRequest { evaluation, subject, metrics, benchmark? }`.
  - `evaluation`: the distinct, stable evaluation identity.
  - `subject`: `{ kind, reference }` where kind is a subject namespace (agent, reasoning, retrieval, prompt, provider, tool, memory) and reference identifies the concrete output; the engine never reaches into the subject's internals.
  - `metrics`: framed measurements, each `{ metric, value, grounded }`; the measured value is supplied by the caller (measured against the subject's quality definition, which evaluation does not own).
  - `benchmark?`: the name of a registered benchmark to compare against, where a comparison is made.
- Output: an immutable `EvaluationResult` with a content-hash id, carrying the measured metrics, the derived `Score` (or null when withheld), an optional `Comparison`, the `ValidationOutcome`, the benchmark version compared against (or null), and a verdict of `accepted` or `withheld`. The result informs; it carries no decision.

## 4. Lifecycle and validation

The engine drives the frozen lifecycle for one request:

1. Framing: read the subject output, the framed metrics, and the optional benchmark; establish what is assessed and against what.
2. Measurement: record each framed measurement as a `MeasuredMetric`, observing the value and never changing it.
3. Scoring: derive a `Score` from the measured metrics by a defined, transparent, traceable calculation (the arithmetic mean of the measured values), recording the metric names it derived from. Not derivable (no metrics, or a non-finite or out-of-range value) yields no score.
4. Validation: apply the conjunctive checks in the frozen order, short-circuiting at the first failure.
   - well-formedness: a defined subject output (known kind, non-empty reference), at least one defined metric with a finite value in `[0, 1]`, and, where a benchmark name is given, a registered benchmark.
   - grounding: every measured metric is grounded (rests on defined ground, never invented).
   - scoring: the score is traceable to exactly the measured metrics it was derived from.
   - constitutional: the evaluation stays within evaluation's constitutional position (a known subject, a result that informs and carries no decision). The governance rule the check conforms to is owned by `ai/governance/` and applied downstream, never restated here.
5. Result: produce the immutable result. Accepted iff every check passed; otherwise withheld, with the score and comparison withheld and the failing check recorded.

## 5. Determinism, fail-closed, zero-trust

- Deterministic: the result and its FNV-1a content-hash id are a pure function of the request and the registered benchmarks, over canonically sorted arrays; no `Date.now`, `Math.random`, or wall clock enters any decision or output path. An injected `Clock` stamps framework events and audit entries only and is excluded from every id.
- Fail-closed: an invalid evaluation yields no accepted result (verdict withheld), and informs no decision.
- Zero-trust: a structurally malformed or out-of-contract request never makes the public API throw; missing arrays are treated as empty and rejected by validation.
- Idempotent: re-evaluating the same evaluation identity yields the same result and is recorded once (the audit is the idempotency authority).

## 6. Dependencies and boundaries

- Edges (6): `@openlance/aios-evaluation` (the frozen model), and the substrate `di`, `errors`, `events`, `kernel`, `plugins`. No governance import (the frozen model's own edge is `[]`), no subject engine import, no other operational engine, no vendor. An acyclic leaf: nothing depends on it.
- Registration: through the frozen composition-root seam (ADR-0026 `CompositionConfig.modules`), under `EVALUATION_MANAGER`.
- Extension point: a benchmark registry. Named, versioned benchmarks are registered directly or adopted from a plugin (frozen `PluginManifest`), validated and frozen through one factory. Benchmarks are data; an extension can never grant the engine a decision or an execution.

## 7. What it never does

It never reasons, retrieves, executes, orchestrates, schedules, authorizes, protects, refuses, escalates, ranks for action, or selects or invokes a provider. It defines no metric mechanism and no test harness. It redefines no subject's quality definition and reaches into no subject's behavior. It carries no business truth of its own. It holds no vendor knowledge. These are enforced by src-scanning guard tests (no execution, no decision, no vendor knowledge).

## 8. Module inventory

`types` (type-only contracts), `errors` (`EvaluationError`, `EVALUATION.*`), `hash` (FNV-1a), `normalizer`, `configuration`, `measurement`, `scoring`, `comparison`, `validation`, `evaluator` (the lifecycle coordinator), `benchmark-factory`, `benchmark-registry`, `plugin-bridge`, `audit` (idempotency authority), `eval-metrics` (engine counters), `events`, `module` (DI token), `manager` (facade and DI entry), `index` (barrel).

## 9. Validation and Definition of Done

`pnpm run validate` exits 0 (typecheck, lint, format, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build). 100% coverage (ADR-0015). Benchmarks recorded. Two independent audits (architecture/constitution and correctness/security) CLEAN, all Tier-1 and Tier-2 findings resolved. Frozen with `EVALUATION-ENGINE-FREEZE.md`. `ai/` and `knowledge/` remain byte-identical.
