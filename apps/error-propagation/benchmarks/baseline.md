# Error-propagation baseline

Observational micro-baseline (Engineering Rule 5, ADR-0022). Measurement only: it validates a declared error
propagation topology and builds an immutable plan; it executes nothing, catches no runtime error, and holds no
runtime state. The one executable path is `buildErrorPropagationPlan`, which:

- delegates code-uniqueness of the declared topology to the frozen `InMemoryErrorCodeRegistry` (register + assert
  unique), failing closed, and
- returns an immutable `ErrorPropagationPlan` attached to the Stage 6 `PluginLoadingPlan`, with diagnostics (node
  count and codes).

The measured cost is a bounded code-uniqueness check over the declared nodes plus a shallow freeze; it re-declares
no error hierarchy, registry, or bridge and handles no runtime error.

Run with `pnpm --filter @openlance/aios-error-propagation bench`. `buildErrorPropagationPlan` is deterministic over
the fixed inputs, so throughput is high and the number is recorded here only as an observational baseline, not a
threshold.
