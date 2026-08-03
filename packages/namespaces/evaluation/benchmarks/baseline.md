# Evaluation predicate baselines

Observational micro-baselines (Engineering Rule 5, ADR-0022). Measurement only: these run outside `src`,
never on an evaluation path, and never change behavior. The Evaluation namespace is an immutable, stateless
domain model (ADR-0020) whose constitutional role is ADR-0024 category 1 (Pure Domain Model, declared per
ADR-0024 §42); its executable surface is two pure deterministic algorithms over evaluation-owned
classifications:

- `evaluationPhaseAtOrAfter` - the evaluation-lifecycle phase order (ai/evaluation/evaluation-lifecycle.md).
- `evaluationValidationCheckAtOrAfter` - the evaluation-validation check order
  (ai/evaluation/evaluation-validation.md).

All other evaluation concerns are immutable definitions with no executable predicate to benchmark.

Run with `pnpm --filter @openlance/aios-evaluation bench`. Each predicate is pure, total, and deterministic
over an evaluation-owned classification and resolves in constant time (a single rank comparison), so
throughput is on the order of millions of operations per second and the numbers are recorded here only as an
observational baseline, not a threshold.
