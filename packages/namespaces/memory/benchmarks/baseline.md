# Memory predicate baselines

Observational micro-baselines (Engineering Rule 5, ADR-0022). Measurement only: these run outside
`src`, never on a runtime path, and never change behavior. The Memory namespace is a Pure Domain Model
(ADR-0020); its only executable predicates are the three ordering predicates over memory-owned
classifications: `lifecyclePhaseAtOrAfter` (memory lifecycle phases), `workflowStepAtOrAfter` (memory
workflow order), and `retentionAtLeast` (retention classes by persistence). All other memory concerns
are immutable definitions with no executable predicate to benchmark.

Run with `pnpm --filter @openlance/aios-memory bench`. Each predicate is pure, total, and deterministic
over a memory-owned classification and resolves in constant time (a single rank comparison), so
throughput is on the order of millions of operations per second and the numbers are recorded here only
as an observational baseline, not a threshold.
