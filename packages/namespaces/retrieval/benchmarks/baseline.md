# Retrieval predicate baselines

Observational micro-baselines (Engineering Rule 5, ADR-0022). Measurement only: these run outside
`src`, never on a runtime path, and never change behavior. The Retrieval namespace is a Pure Domain
Model (ADR-0020); its only executable predicates are the two ordering predicates over retrieval-owned
classifications: `retrievalPhaseAtOrAfter` (retrieval lifecycle phases) and `retrievalStepAtOrAfter`
(retrieval workflow order). All other retrieval concerns are immutable definitions with no executable
predicate to benchmark.

Run with `pnpm --filter @openlance/aios-retrieval bench`. Each predicate is pure, total, and
deterministic over a retrieval-owned classification and resolves in constant time (a single rank
comparison), so throughput is on the order of millions of operations per second and the numbers are
recorded here only as an observational baseline, not a threshold.
