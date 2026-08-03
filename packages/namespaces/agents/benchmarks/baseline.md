# Agent predicate baseline

Observational micro-baseline (Engineering Rule 5, ADR-0022). Measurement only: it runs outside `src`,
never on a runtime path, and never changes behavior. The Agents namespace is an immutable, stateless
domain model (ADR-0020) in ADR-0024 category 1 (Pure Domain Model, declared per §42); its executable
surface is one pure ordering predicate over an agent-owned classification:

- `agentPhaseAtOrAfter` - the agent lifecycle phase order, registration to retirement
  (ai/agents/agent-lifecycle.md).

All other agent concerns are immutable definitions with no executable predicate to benchmark. In
particular, the coordination and communication topologies are described in prose rather than enumerated as
closed sets, and versioning narrates heterogeneous facets (like prompt-versioning), so none carries a
classification or predicate.

Run with `pnpm --filter @openlance/aios-agents bench`. The predicate is pure, total, and deterministic
over an agent-owned classification and resolves in constant time (a single rank comparison), so throughput
is on the order of millions of operations per second and the number is recorded here only as an
observational baseline, not a threshold.
