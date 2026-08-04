# Provider-engine baseline

Observational micro-baselines (Engineering Rule 5, ADR-0022). Measurement only, deterministic over fixed inputs (a
fixed clock and in-memory stub providers that hold no vendor knowledge). Five hot paths are measured:

- **register**: `ProviderRegistry.register` on a fresh registry (identity check plus Map insertion).
- **lookup**: `ProviderRegistry.get` on a populated registry (a single Map lookup).
- **select**: `ProviderSelector.select` over one eligible provider (route filter plus first element).
- **execute**: `ProviderExecutor.execute` for one eligible provider under a valid clearance (clearance check, route,
  one invocation, response normalization).
- **failover**: `ProviderExecutor.execute` over a failing primary and a succeeding fallback (one failed invocation,
  one failover, one succeeding invocation, normalization).

Run with `pnpm --filter @openlance/aios-provider-engine bench`. Each path is deterministic over its fixed inputs, so
throughput is high and the numbers are recorded here only as observational baselines, not thresholds. No path performs
network, filesystem, or vendor work: the engine executes over the `Provider` abstraction only, and the clearance is
minted through the test-and-benchmark seam that stands in for a completed governance validation.
