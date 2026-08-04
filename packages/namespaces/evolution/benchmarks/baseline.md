# Evolution predicate baselines

Observational micro-baselines (Engineering Rule 5, ADR-0022). Measurement only: these run outside `src`,
never on an evolution path, and never change behavior. The Evolution namespace is an immutable, stateless
domain model (ADR-0020) whose constitutional role is ADR-0024 category 1 (Pure Domain Model, declared per
ADR-0024 §42); its executable surface is two pure deterministic algorithms over evolution-owned
classifications:

- `evolutionPhaseAtOrAfter` - the evolution-lifecycle phase order (ai/evolution/evolution-lifecycle.md).
- `deprecationStateAtOrAfter` - the deprecation-state order (ai/evolution/deprecation-model.md, "A part passes
  from active to deprecated to retired").

All other evolution concerns are immutable definitions with no executable predicate to benchmark.

Run with `pnpm --filter @openlance/aios-evolution bench`. Each predicate is pure, total, and deterministic
over an evolution-owned classification and resolves in constant time (a single rank comparison), so
throughput is on the order of millions of operations per second and the numbers are recorded here only as an
observational baseline, not a threshold.
