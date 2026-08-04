# 30. Error Propagation implementation design (Phase 3, Stage 7)

**Status: IMPLEMENTED and frozen (Phase 3, Stage 7).** Built design-first per ADR-0007.
[ADR-0033](adr/0033-error-propagation-plan.md) is Accepted (no supersession; ADR-0032 already anticipates Stage 7).
Package: `apps/error-propagation` (`@openlance/aios-error-propagation`).

## 1. Scope and ownership

Stage 7 builds the **application-level error propagation** integration layer: an immutable `ErrorPropagationPlan`
that describes how errors propagate through the already-built integration chain, as a declared topology of coded
error surfaces (each on the frozen `Result` channel, in a frozen `ErrorCategory`), attached to the chain. It
answers only: which coded errors propagate through the chain, in which category, and is the topology well-formed.

It **consumes, never recreates.** The error framework is owned, in full, by the frozen Phase 2A substrate: the
error hierarchy (`BaseError`, the `domain`/`infrastructure`/`validation` categories), `DomainError`/
`InfrastructureError`/`ValidationError`, the per-package error-code registry (`InMemoryErrorCodeRegistry`), and the
throw-to-`Result` bridges (`fromThrowable`, `toResult`) in `@openlance/aios-errors` (ADR-0006), and the `Result`
channel and its combinators in `@openlance/aios-kernel`. This stage recreates none of them; it consumes the frozen
`ErrorCategory` type, the frozen `InMemoryErrorCodeRegistry` (to validate code uniqueness), and the frozen `Result`
channel, and consumes the Stage 6 `PluginLoadingPlan` (the runtime integration chain handle).

It **executes nothing.** It does not catch, retry, recover, roll back, orchestrate, schedule, or handle any runtime
error; it runs no provider, tool, agent, plugin, namespace, or workflow. Those are Phase 4 or the frozen substrate.
It validates a declared topology and produces an immutable descriptive plan.

## 2. Why this is not duplication

The frozen substrate owns error *modeling* and the `Result` *propagation channel*; each frozen integration stage
already surfaces its own coded `BaseError` subtype on that channel and fails closed. What no package owns is the
application-level *description* of the chain's aggregate error surface: which coded errors propagate through the
composed chain, in which category. That descriptive topology, validated for code uniqueness through the frozen
registry, is this stage's only ownership, directly parallel to Plugin Loading (Stage 6) declaring the plugin set.
It re-declares no error type, category set, registry, or bridge.

## 3. Public API and package layout

Package `apps/error-propagation`, name `@openlance/aios-error-propagation`, `aios.layer: "app"`. Single explicit
barrel (`src/index.ts`, no wildcard). Modules: `error-propagation.ts` (types + functions), `errors.ts`
(`ErrorPropagationError`).

```ts
// One declared error-propagation node: a coded error surface that propagates on the Result channel, in a category.
export interface ErrorPropagationNode {
  readonly code: string;             // the stable error code (for example 'COMPOSITION.CONFIG_BUILD_FAILED')
  readonly category: ErrorCategory;  // the frozen ErrorCategory: domain | infrastructure | validation
}

// A read-only report over the plan.
export interface ErrorPropagationDiagnostics {
  readonly nodeCount: number;
  readonly codes: readonly string[];
}

// The immutable error propagation plan, attached to the runtime integration chain. Descriptive; executes nothing.
export interface ErrorPropagationPlan {
  readonly chain: PluginLoadingPlan;                 // the Stage 6 chain handle, consumed unchanged
  readonly nodes: readonly ErrorPropagationNode[];   // the declared propagation topology
  readonly diagnostics: ErrorPropagationDiagnostics;
  readonly validated: true;
}

// Validate the declared topology: the error codes are globally unique, delegating to the frozen error-code
// registry. Fail closed.
export function validateErrorPropagation(
  nodes: readonly ErrorPropagationNode[],
): Result<readonly ErrorPropagationNode[], ErrorPropagationError[]>;

// Build the immutable plan, attaching it to the chain, delegating validation. Fail closed.
export function buildErrorPropagationPlan(
  chain: PluginLoadingPlan,
  nodes: readonly ErrorPropagationNode[],
): Result<ErrorPropagationPlan, ErrorPropagationError[]>;
```

`validateErrorPropagation` registers each node's code into a fresh frozen `InMemoryErrorCodeRegistry` and asserts
uniqueness; a duplicate code makes it return one `ERROR_PROPAGATION.DUPLICATE_CODE` error (wrapping the frozen
registry's `DomainError` as its cause) and no validated topology. `buildErrorPropagationPlan` uses it and, on
success, returns an immutable plan whose `nodes` are the validated topology and whose `diagnostics` report the node
count and codes. Each `node.category` is the frozen `ErrorCategory` type, so an invalid category cannot be declared
(compile-time enforced). `ErrorPropagationError` is an `@openlance/aios-errors` `BaseError` subtype
(`infrastructure`) with `ERROR_PROPAGATION.*` codes; failures ride the `Result` channel (ADR-0006).

## 4. Consume, never recreate

| Concern | Owned by (frozen) | Stage 7 disposition |
|---|---|---|
| BaseError, the error hierarchy, ErrorCategory, DomainError/InfrastructureError/ValidationError | `@openlance/aios-errors` | consume the types; never recreate |
| The error-code registry (uniqueness) | `@openlance/aios-errors` `InMemoryErrorCodeRegistry` | delegate code-uniqueness validation to it |
| The Result channel and combinators; throw-to-Result bridges | `@openlance/aios-kernel`, `@openlance/aios-errors` | consume; never recreate |
| The runtime integration chain | Stages 1 to 6 (frozen) | consume the `PluginLoadingPlan`; recreate nothing |

## 5. What it must not do

No catching, retry, recovery, rollback, orchestration, scheduling, or async/exception handling of runtime errors;
no logging, monitoring, or telemetry; no provider/tool/agent/plugin/namespace/workflow execution; no runtime
execution; no mutable or runtime state. It validates a declared topology and builds an immutable plan.

## 6. Dependency graph and layer wiring

`@openlance/aios-error-propagation -> { @openlance/aios-plugin-loading, @openlance/aios-errors, kernel }` (its
`src/` edges, recorded in `dependency-graph.snapshot.json`; the chain-building packages, plugins, config, logging,
and events are test-only devDependencies). The `app -> app` (plugin-loading) and `app -> substrate` (errors) edges
are legal; no dependency-cruiser rule or namespace edge changes.

## 7. Testing strategy (ADR-0022 / Rule 6)

100% statements/branches/functions/lines. `validateErrorPropagation` is tested with an empty topology (ok), a
unique-code topology (ok, frozen), and a duplicate-code topology (err, `ERROR_PROPAGATION.DUPLICATE_CODE`,
delegated to the frozen registry). `buildErrorPropagationPlan` is tested with a valid topology (ok plan, correct
nodes and diagnostics, attached to the chain) and a duplicate-code topology (err, no partial plan). Immutability
(`Object.isFrozen`) is asserted on the plan, its nodes, its diagnostics, and its codes. Benchmark: the
`buildErrorPropagationPlan` path (Rule 5 baseline).

## 8. Acceptance criteria (met)

- Consumes the frozen error subsystem (`ErrorCategory`, `InMemoryErrorCodeRegistry`, `Result`) and the Stage 6
  `PluginLoadingPlan`; recreates no error framework, hierarchy, registry, bridge, or chain handle.
- `buildErrorPropagationPlan` returns an immutable, validated `ErrorPropagationPlan` or a `Result` error, failing
  closed with no partial plan; it executes nothing.
- Full validation green; 100% coverage; benchmark recorded; two independent source audits CLEAN.
- Zero regression: `ai/`, `knowledge/`, the frozen substrate, all 13 namespaces, and the six frozen Phase 3
  packages unchanged.
