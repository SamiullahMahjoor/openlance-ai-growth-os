# Plugin-loading baseline

Observational micro-baseline (Engineering Rule 5, ADR-0022). Measurement only: it builds the application-level
plugin loading plan and delegates compatibility to the frozen plugin host; it executes nothing, loads no plugin,
drives no lifecycle, and holds no runtime state. The one executable path is `buildPluginLoadingPlan`, which:

- computes the enabled subset of the declared available plugins,
- validates the enabled set by delegating to the frozen `PluginHost.validateCompatibility` (apiVersion range,
  dependency presence and range, and acyclicity), failing closed, and
- returns an immutable `PluginLoadingPlan` attached to the Stage 5 `ExecutionPipelinePlan`, with diagnostics.

The measured cost is a bounded delegated compatibility check over the declared manifests plus a shallow freeze; it
re-declares no host/registry/loader/lifecycle and drives no plugin.

Run with `pnpm --filter @openlance/aios-plugin-loading bench`. `buildPluginLoadingPlan` is deterministic over the
fixed inputs, so throughput is high and the number is recorded here only as an observational baseline, not a
threshold.
