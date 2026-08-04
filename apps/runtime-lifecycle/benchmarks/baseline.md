# Runtime-lifecycle baseline

Observational micro-baseline (Engineering Rule 5, ADR-0022). Measurement only: it binds the DI-integrated
application to the frozen runtime lifecycle model and validates the admission path; it executes nothing, drives no
transition, activates nothing, and holds no runtime state. The one executable path is `buildRuntimeLifecyclePlan`,
which:

- validates the model's deterministic admission sequence (created, initializing, loading, validating) by
  delegating each consecutive pair to the frozen `transitionAllowed` (`validateLifecyclePath`), failing closed,
- references the frozen model's initial state and lifecycle phases, re-declaring nothing, and
- returns an immutable `RuntimeLifecyclePlan` binding the consumed `IntegratedApplication` to the validated
  lifecycle entry.

The measured cost is a bounded delegated transition check over a four-state path plus a shallow freeze; it
re-declares no state/transition/phase and instantiates no runtime engine.

Run with `pnpm --filter @openlance/aios-runtime-lifecycle bench`. `buildRuntimeLifecyclePlan` is deterministic
over the fixed frozen inputs, so throughput is high and the number is recorded here only as an observational
baseline, not a threshold.
