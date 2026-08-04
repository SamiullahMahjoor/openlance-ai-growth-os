# @openlance/aios-runtime-lifecycle

The AIOS runtime lifecycle plan (Phase 3, Stage 4). It binds the DI-integrated application to the frozen runtime
lifecycle model, producing one immutable **`RuntimeLifecyclePlan`**.

- **Layer:** `app` (the lifecycle-plan counterpart to the composition root, namespace wiring, and DI integration;
  `apps/*`).
- **Design:** [docs/implementation/26-runtime-lifecycle.md](../../docs/implementation/26-runtime-lifecycle.md).
  **Decision:** [ADR-0029](../../docs/implementation/adr/0029-runtime-lifecycle-plan.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

A thin application layer that **consumes** the frozen `IntegratedApplication` (Stage 3) and the frozen
`@openlance/aios-runtime` lifecycle model, and produces one immutable `RuntimeLifecyclePlan`.
`buildRuntimeLifecyclePlan(integrated)` references the frozen model's initial state and lifecycle phases, proves
the model's deterministic admission sequence against the frozen transition relation, and returns the frozen plan,
or fails closed with `RuntimeLifecycleError[]`.

The plan is **descriptive planning metadata, not runtime state**. It holds no runtime state, has no current
state, and **carries nothing out**: it drives no transition, executes nothing, activates nothing, schedules
nothing, instantiates no runtime engine, and performs no orchestration. It simply proves that an
`IntegratedApplication` is constitutionally ready to enter the execution pipeline (Stage 5), which consumes the
plan.

### Consume, never recreate

It recreates no container, registry, resolver, namespace manifest, or composition root (all frozen in Stages 1 to
3), and re-declares no execution state, transition, lifecycle phase, session phase, workflow step, validation
stage, boundary, or event: the runtime lifecycle model is owned by the frozen `@openlance/aios-runtime` namespace
and is referenced here, never duplicated. "Lifecycle transitions" is realized as a pure validator over the frozen
relation (`validateLifecyclePath`, delegating to `transitionAllowed`), never as a live state machine; "the
runtime lifecycle model" is realized as a reference view onto the frozen namespace.

## Public API (single barrel, Engineering Rule 1)

- `buildRuntimeLifecyclePlan(integrated: IntegratedApplication): Result<RuntimeLifecyclePlan, RuntimeLifecycleError[]>`
  - bind the integrated application to the frozen lifecycle model, failing closed.
- `validateLifecyclePath(states: readonly ExecutionState[]): Result<readonly ExecutionState[], RuntimeLifecycleError[]>`
  - validate a proposed sequence of execution states against the frozen transition relation, failing closed.
- `RuntimeLifecyclePlan` - the read-only plan type.
- `RuntimeLifecycleError` is a `BaseError` subtype (`infrastructure`) with `RUNTIME_LIFECYCLE.*` codes.

`RuntimeLifecyclePlan` holds the consumed `integrated` (unchanged), the `initialState` (`created`, referenced from
the frozen model), the `phases` (referenced from `EXECUTION_LIFECYCLE_PHASES`), the validated `admissionPath` (the
model's deterministic entry sequence), and `validated: true`, which records that the admission path passed
delegated validation.

## Validation (delegated, fail closed)

`validateLifecyclePath` performs no validation of its own: it delegates each consecutive transition to the frozen
`transitionAllowed` and aggregates one `RUNTIME_LIFECYCLE.FORBIDDEN_TRANSITION` error per forbidden pair, building
no partial path. `buildRuntimeLifecyclePlan` uses it to prove the admission sequence, failing closed.

## Dependency direction

`@openlance/aios-runtime-lifecycle -> { @openlance/aios-di-integration, @openlance/aios-runtime, kernel, errors }`
(its `src/` edges, recorded in `dependency-graph.snapshot.json`; composition-root, namespace-wiring, config, and
logging are test-only devDependencies). The `app -> namespace` (runtime) and `app -> app` (di-integration) edges
are legal (ADR-0027/0028); no namespace edge or rule changes.

## Non-responsibilities

No execution, orchestration, scheduling, or event processing; no provider / agent / prompt / reasoning /
retrieval / memory / tool execution; no live state machine, no current state, no mutable or partial runtime
state; no runtime engine. It binds and validates the static lifecycle plan; driving it is the execution pipeline
(Stage 5).
