# Providers predicate baselines

Observational micro-baselines (Engineering Rule 5, ADR-0022). Measurement only: these run outside
`src`, never on a runtime path, and never change behavior. The Providers namespace is a Pure Domain
Model (ADR-0020); its only executable predicates are the provider lifecycle predicates
(`phaseAtOrAfter`, `usableInPhase`). All other provider concerns are immutable definitions with no
executable predicate to benchmark.

Run with `pnpm --filter @openlance/aios-providers bench`. Both predicates are pure, total, and
deterministic over the provider-owned `ProviderLifecyclePhase` classification and resolve in constant
time (a rank comparison and a two-way membership test, respectively), so throughput is on the order of
millions of operations per second and the numbers are recorded here only as an observational baseline,
not a threshold.
