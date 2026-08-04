# @openlance/aios-error-propagation

The AIOS application-level error propagation (Phase 3, Stage 7). It declares the runtime integration chain's coded
error topology (which coded errors propagate, in which category, on the `Result` channel) and attaches it to the
Stage 6 chain, producing one immutable **`ErrorPropagationPlan`**.

- **Layer:** `app` (the error-topology counterpart to the prior Phase 3 integration packages; `apps/*`).
- **Design:** [docs/implementation/30-error-propagation.md](../../docs/implementation/30-error-propagation.md).
  **Decision:** [ADR-0033](../../docs/implementation/adr/0033-error-propagation-plan.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

A thin application layer that **consumes** the frozen `@openlance/aios-errors` framework and the Stage 6
`PluginLoadingPlan`, and produces one immutable `ErrorPropagationPlan`. `buildErrorPropagationPlan(chain, nodes)`
validates the declared topology by delegating code-uniqueness to the frozen `InMemoryErrorCodeRegistry`, and
returns the frozen plan attached to the chain, or fails closed with `ErrorPropagationError[]`.

The plan is **descriptive planning metadata, not runtime state**. It holds no runtime state and **executes
nothing**: it does not catch, retry, recover, roll back, orchestrate, schedule, or handle any runtime error, and
runs no provider, tool, agent, plugin, namespace, or workflow. Those are Phase 4 or the frozen substrate. It
answers only: which coded errors propagate through the chain, in which category, and is the topology well-formed.

### Consume, never recreate

The error framework is owned, in full, by the frozen substrate: the error hierarchy (`BaseError`, the
`domain`/`infrastructure`/`validation` `ErrorCategory`), the error-code registry (`InMemoryErrorCodeRegistry`), and
the throw-to-`Result` bridges (`@openlance/aios-errors`, ADR-0006), and the `Result` channel
(`@openlance/aios-kernel`). This package recreates none of them; it consumes the frozen `ErrorCategory` type, the
frozen registry (for code uniqueness), and the frozen `Result` channel, and consumes the frozen chain handle. It
re-declares no error type, category set, registry, or bridge.

## Public API (single barrel, Engineering Rule 1)

- `buildErrorPropagationPlan(chain: PluginLoadingPlan, nodes: readonly ErrorPropagationNode[]): Result<ErrorPropagationPlan, ErrorPropagationError[]>`
  - build the plan, attaching it to the chain and delegating validation, failing closed.
- `validateErrorPropagation(nodes: readonly ErrorPropagationNode[]): Result<readonly ErrorPropagationNode[], ErrorPropagationError[]>`
  - validate the declared topology's code uniqueness via the frozen registry, failing closed.
- `ErrorPropagationNode`, `ErrorPropagationPlan`, `ErrorPropagationDiagnostics` - the read-only types.
- `ErrorPropagationError` is a `BaseError` subtype (`infrastructure`) with `ERROR_PROPAGATION.*` codes.

`ErrorPropagationNode` is `{ code, category }`, where `category` is the frozen `ErrorCategory` type (an invalid
category cannot be declared). `ErrorPropagationPlan` holds the consumed `chain` (unchanged), the validated `nodes`,
`diagnostics` (node count and codes), and `validated: true`.

## Validation (delegated, fail closed)

`validateErrorPropagation` registers each node's code into a fresh frozen `InMemoryErrorCodeRegistry` and asserts
uniqueness; a duplicate code returns one `ERROR_PROPAGATION.DUPLICATE_CODE` error (wrapping the frozen registry's
error as its cause), building no partial topology. No runtime error is caught, mapped, or handled.

## Dependency direction

`@openlance/aios-error-propagation -> { @openlance/aios-plugin-loading, @openlance/aios-errors, kernel }` (its
`src/` edges, recorded in `dependency-graph.snapshot.json`; the chain-building packages, plugins, config, logging,
and events are test-only devDependencies). The `app -> app` (plugin-loading) and `app -> substrate` (errors) edges
are legal; no namespace edge or rule changes.

## Non-responsibilities

No catching, retry, recovery, rollback, orchestration, scheduling, or exception handling; no logging / monitoring /
telemetry; no provider / tool / agent / plugin / namespace / workflow execution; no runtime execution; no mutable
or runtime state. It declares and validates the static error propagation topology; handling errors at run time is a
Phase 4 concern.
