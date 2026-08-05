# EVALUATION ENGINE FREEZE (Platform Completion, PC-1)

**Status:** COMPLETE - VALIDATED - AUDITED - FROZEN
**Package:** `@openlance/aios-evaluation-engine` (`apps/evaluation-engine`)
**ADR:** [ADR-0046](adr/0046-evaluation-engine.md) · **Design:** [43-evaluation-engine.md](43-evaluation-engine.md)
**Milestone:** Platform Completion, item PC-1 (prerequisite to Phase 5, AI Growth OS Features). This is not Phase 5.

The Evaluation Engine is the Runtime's operational assessment subsystem: the operational realization of the frozen `ai/evaluation/` assessment model, and the twelfth operational engine (the twelfth namespace realized). Alongside the Operations Engine it completes the observation tier: Operations judges the health of the running layer; Evaluation judges the quality of the layer's output.

## What it is

For an immutable `EvaluationRequest` (an evaluation identity, a subject namespace's output by reference, framed metric measurements, and an optional benchmark name), the engine deterministically runs the frozen lifecycle framing -> measurement -> scoring -> validation -> result: it records the framed measurements (observing, never changing), derives a transparent, traceable score (the mean of the measured values), optionally compares against a registered benchmark like-for-like (recording the benchmark version), and validates through the conjunctive, frozen-order checks well-formedness -> grounding -> scoring -> constitutional, short-circuiting at the first failure. It produces an immutable, content-hashed `EvaluationResult` carrying the measured metrics, the score, an optional comparison, and the validation outcome, with a verdict of `accepted` or `withheld`.

## What it never does

It never reasons, retrieves, executes, orchestrates, schedules, authorizes, protects, refuses, escalates, ranks for action, or selects or invokes a provider; the decision or protective response drawn from a result is owned by `ai/governance/` and `ai/safety/`. It defines no metric mechanism and no test harness, redefines no subject's quality definition, reaches into no subject's behavior, and carries no business truth of its own. It is deterministic, fail-closed (an invalid evaluation yields no accepted result), zero-trust (a malformed or null request never throws), idempotent, and holds no vendor knowledge.

## Dependency graph (leaf)

Outbound edges (6), from `dependency-graph.snapshot.json`: `{ evaluation, di, errors, events, kernel, plugins }`. It imports no governance, no subject engine, no other operational engine, and no vendor; all imports are barrel-only. It is an acyclic leaf: nothing depends on it. It registers through the frozen composition-root seam (ADR-0026 `CompositionConfig.modules`) under `EVALUATION_MANAGER` and defines no new container, registry, event bus, or error framework.

## Validation

`pnpm run validate` exits 0 (41 tasks: typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build). 100% coverage (ADR-0015): 49 tests, statements/branches/functions/lines all 100%. Benchmarks recorded (evaluate, measurement, scoring, comparison, validation). Guard tests enforce the boundaries structurally: `no-execution` (no execution/decision/runtime-internal token) and `no-vendor-knowledge` (no vendor/model/SDK/URL/auth token).

## Audits

Two independent audits, both CLEAN (zero Tier 1, zero Tier 2):

- **Architecture / constitution / ownership / dependency:** confirmed the 6-edge acyclic leaf, faithful lifecycle and validation realization, informs-never-decides, no metric-mechanism redefinition, single-owner with no leak into Operations / Governance / Safety, full immutability, seam registration, and additive regression.
- **Correctness / security / determinism:** confirmed a pure-function result and FNV-1a id (the injected Clock is excluded), fail-closed (no path to `accepted` without all four checks), field-level zero-trust, correct scoring / comparison / validation with reachable distinct failure paths, idempotency, and fault-isolated events.

Three Tier-3 findings were surfaced and **resolved** (they made a claim honest or hardened a boundary; none was blocking):

1. Whole-request `null`/`undefined` could throw, contradicting the "never throws" guarantee. **Fixed:** the evaluator coerces a null/undefined request to an empty request and withholds it (`src/evaluator.ts`).
2. Duplicate metric names could hash differently by input order, contradicting the "same distinct metrics in any order yield the same measurement" claim. **Fixed:** well-formedness validation now rejects duplicate metric names (`src/validation.ts`), and the measurement docstring is precise.
3. `benchmark-registry.list()` returned a readonly-typed array whose container was not frozen. **Fixed:** the returned array is now `Object.freeze`d (`src/benchmark-registry.ts`).

One recorded Repository Evolution Note (non-blocking, not applied): distinct blank-identity withheld evaluations collapse under one audit key, since a blank identity is itself invalid; this affects only withheld-observability, never a returned verdict.

## Regression

`git diff phase-4-frozen HEAD -- ai/ knowledge/` is empty; every Phase 4 engine under `apps/` is byte-identical. The change set is additive only: the new `apps/evaluation-engine/`, the design doc, ADR-0046, one ADR index row, the graph snapshot edge, and the lockfile.

## Freeze statement

The Evaluation Engine (PC-1) is frozen. Its ownership (assessment only), its public contracts (immutable `EvaluationResult` and the benchmark extension), and its 6-edge acyclic-leaf dependency boundary are the canonical reference for Platform Completion and Phase 5. Changing any of them requires a superseding ADR and full validation.
