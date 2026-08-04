# Event-flow baseline

Observational micro-baseline (Engineering Rule 5, ADR-0022). Measurement only: it validates a declared event flow
topology and realizes each event; it publishes, subscribes, dispatches nothing, and holds no runtime state. The one
executable path is `buildEventFlowPlan`, which:

- validates the declared topology (blank type, duplicate type), failing closed, and for each valid node delegates
  to the frozen `createEvent` to realize a canonical immutable `FrameworkEvent` (never dispatched), and
- returns an immutable `EventFlowPlan` attached to the Stage 7 `ErrorPropagationPlan`, with diagnostics (event
  count and types).

The measured cost is a bounded topology validation plus a frozen-constructor realization per node and a shallow
freeze; it re-declares no bus/dispatcher/subscription and calls no bus operation.

Run with `pnpm --filter @openlance/aios-event-flow bench`. `buildEventFlowPlan` is deterministic over the fixed
inputs (fixed clock), so throughput is high and the number is recorded here only as an observational baseline, not
a threshold.
