# Operations predicate baselines

Observational micro-baselines (Engineering Rule 5, ADR-0022). Measurement only: these run outside `src`,
never on an operational path, and never change behavior. The Operations namespace is an immutable, stateless
domain model (ADR-0020) whose constitutional role is ADR-0024 category 5 (Composition Root); its executable
surface is two pure deterministic algorithms over operations-owned classifications:

- `operationsPhaseAtOrAfter` - the operations-lifecycle phase order (ai/operations/operations-lifecycle.md).
- `healthStateAtOrAfter` - the health-state order (ai/operations/health-management.md, "ordered from healthy
  to degraded to failed").

All other operations concerns are immutable definitions with no executable predicate to benchmark.

Run with `pnpm --filter @openlance/aios-operations bench`. Each predicate is pure, total, and deterministic
over an operations-owned classification and resolves in constant time (a single rank comparison), so
throughput is on the order of millions of operations per second and the numbers are recorded here only as an
observational baseline, not a threshold.
