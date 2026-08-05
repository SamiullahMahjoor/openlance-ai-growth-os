# @openlance/aios-evaluation-engine

The AIOS **Evaluation Engine** (Platform Completion, PC-1): the Runtime's operational assessment subsystem, the operational realization of the frozen `ai/evaluation/` assessment model. See [ADR-0046](../../docs/implementation/adr/0046-evaluation-engine.md) and the [design doc](../../docs/implementation/43-evaluation-engine.md).

This is the first item of the Platform Completion milestone (the prerequisite to Phase 5, AI Growth OS Features). It is not Phase 5.

## What it does

For an immutable `EvaluationRequest` (an evaluation identity, a subject namespace's output by reference, framed metric measurements, and an optional benchmark name), the engine deterministically runs the frozen lifecycle: framing, measurement (records the framed measured values, observing them), scoring (derives a transparent, traceable score by the mean of the measured values), optional comparison against a registered benchmark (like-for-like, records the benchmark version), and validation through the conjunctive, ordered checks `well-formedness -> grounding -> scoring -> constitutional` (short-circuiting at the first failure). It produces an immutable, content-hashed `EvaluationResult` carrying the measured metrics, the score, an optional comparison, and the validation outcome, with a verdict of `accepted` or `withheld`.

Alongside the Operations Engine, it completes the observation tier: Operations judges the health of the running layer; Evaluation judges the quality of the layer's output.

## What it never does

It never reasons, retrieves, executes, orchestrates, schedules, authorizes, protects, refuses, escalates, ranks for action, or selects or invokes a provider; the decision or protective response drawn from a result is owned by `ai/governance/` and `ai/safety/`. It defines no metric mechanism and no test harness, redefines no subject's quality definition, reaches into no subject's behavior, and carries no business truth of its own. It is deterministic, fail-closed (an invalid evaluation yields no accepted result), zero-trust (a malformed request never throws), idempotent, and holds no vendor knowledge.

## Public API

`EvaluationManager` (facade and DI entry, registered under `EVALUATION_MANAGER` through the composition-root seam) exposes `evaluate` (an `EvaluationRequest`), the benchmark extension (`registerBenchmark`, `removeBenchmark`, `benchmarks`, `adopt`), and the immutable read accessors (`audit`, `statistics`, `diagnostics`). See `src/index.ts`.

## Boundaries

The Evaluation Engine depends only on the frozen `evaluation` namespace (the model it applies) and the substrate (`di`, `errors`, `events`, `kernel`, `plugins`). It imports no governance, no subject engine, no other operational engine, and no vendor. It observes subject outputs one-directionally, and nothing depends on it (an acyclic leaf).
