# Runtime predicate baselines

Observational micro-baselines (Engineering Rule 5, ADR-0022). Measurement only: these run outside `src`,
never on a runtime path, and never change behavior. The Runtime namespace is an immutable, stateless domain
model (ADR-0020) whose constitutional role is ADR-0024 category 3 (Runtime Service); its executable surface
is five pure deterministic algorithms over runtime-owned classifications:

- `transitionAllowed` - the execution state-transition relation (ai/runtime/execution-states.md, with the
  Recovering transitions sourced from ai/runtime/failure-recovery.md; see the module note).
- `executionPhaseAtOrAfter` - the execution-lifecycle phase order (ai/runtime/execution-lifecycle.md).
- `sessionPhaseAtOrAfter` - the session-lifecycle phase order (ai/runtime/session-lifecycle.md).
- `workflowStepAtOrAfter` - the execution-workflow step order (ai/runtime/execution-workflow.md).
- `validationStageAtOrAfter` - the validation-pipeline stage order (ai/runtime/validation-pipeline.md).

All other runtime concerns are immutable definitions with no executable predicate to benchmark.

Run with `pnpm --filter @openlance/aios-runtime bench`. Each predicate is pure, total, and deterministic
over a runtime-owned classification and resolves in constant time (a single rank comparison or a fixed-size
membership check), so throughput is on the order of millions of operations per second and the numbers are
recorded here only as an observational baseline, not a threshold.
