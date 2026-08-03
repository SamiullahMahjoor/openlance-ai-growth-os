# Reasoning predicate baselines

Observational micro-baselines (Engineering Rule 5, ADR-0022). Measurement only: these run outside
`src`, never on a runtime path, and never change behavior. The Reasoning namespace is an immutable,
stateless domain model (ADR-0020) in ADR-0024 category 2 (Pure Algorithms); its executable surface is
three pure deterministic predicates:

- `reasoningPhaseAtOrAfter` - the reasoning lifecycle phase ordering (ai/reasoning/reasoning-lifecycle.md).
- `reasoningStepAtOrAfter` - the reasoning workflow step ordering (ai/reasoning/reasoning-workflow.md).
- `transitionAllowed` - the reasoning state-transition relation (ai/reasoning/reasoning-stages.md).

All other reasoning concerns are immutable definitions with no executable predicate to benchmark.

Run with `pnpm --filter @openlance/aios-reasoning bench`. Each predicate is pure, total, and
deterministic over a reasoning-owned classification and resolves in constant time (a single rank
comparison or a fixed-size membership check), so throughput is on the order of millions of operations
per second and the numbers are recorded here only as an observational baseline, not a threshold.
