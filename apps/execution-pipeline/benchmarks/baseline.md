# Execution-pipeline baseline

Observational micro-baseline (Engineering Rule 5, ADR-0022). Measurement only: it composes the Stage 4 runtime
lifecycle plan with the frozen runtime pipeline model and proves the frozen workflow order; it executes nothing,
drives no step, orchestrates nothing, and holds no runtime state. The one executable path is
`buildExecutionPipelinePlan`, which:

- proves the frozen workflow order is well-formed by delegating each consecutive step pair to the frozen
  `workflowStepAtOrAfter` (`validateWorkflowOrder`), failing closed,
- references the frozen workflow steps, validation stages, context inputs, and lifecycle events, re-declaring
  nothing, and
- returns an immutable `ExecutionPipelinePlan` binding the consumed `RuntimeLifecyclePlan` to the referenced
  pipeline model.

The measured cost is a bounded delegated order check over the 14 workflow steps plus a shallow freeze; it
re-declares no step/stage/input/event and runs no operational namespace.

Run with `pnpm --filter @openlance/aios-execution-pipeline bench`. `buildExecutionPipelinePlan` is deterministic
over the fixed frozen inputs, so throughput is high and the number is recorded here only as an observational
baseline, not a threshold.
