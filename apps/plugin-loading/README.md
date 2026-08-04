# @openlance/aios-plugin-loading

The AIOS application-level plugin loading (Phase 3, Stage 6). It declares which plugins are available, enabled,
compatible, and ready for the integrated application, and attaches that declaration to the runtime integration
chain, producing one immutable **`PluginLoadingPlan`**.

- **Layer:** `app` (the plugin-integration counterpart to the composition root, namespace wiring, DI integration,
  runtime lifecycle plan, and execution pipeline plan; `apps/*`).
- **Design:** [docs/implementation/29-plugin-loading.md](../../docs/implementation/29-plugin-loading.md).
  **Decision:** [ADR-0032](../../docs/implementation/adr/0032-plugin-loading-integration.md) (supersedes ADR-0031).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

A thin application layer that **consumes** the frozen `@openlance/aios-plugins` framework and the Stage 5
`ExecutionPipelinePlan`, and produces one immutable `PluginLoadingPlan`. `buildPluginLoadingPlan(pipeline, host,
declaration)` computes the enabled subset of the declared available plugins, validates it by delegating to the
frozen `PluginHost.validateCompatibility`, and returns the frozen plan, or fails closed with
`PluginLoadingError[]`.

The plan is **descriptive planning metadata, not runtime state**. It holds no runtime state and **executes
nothing**: it does not discover, load, initialize, start, stop, or schedule plugins, and runs no provider, tool,
agent, or workflow. Those are Phase 4 operational concerns. It answers only: which plugins are available, enabled,
compatible, and ready, and how that declaration attaches to the chain.

### Consume, never recreate

The plugin loading mechanism is owned, in full, by the frozen substrate package `@openlance/aios-plugins`
(subsystem 07, ADR-0012, ADR-0013): the `PluginHost` (`discover`/`validateCompatibility`/`load`/`start`/`stop`),
`createPluginHost`, the register -> init -> start / stop -> dispose activation model, compatibility validation, and
the contracts. This package recreates none of them; it **receives** a frozen `PluginHost` and consumes only its
`validateCompatibility`, and consumes the frozen `ExecutionPipelinePlan`. It re-declares no `PluginManifest`,
`PluginContext`, `Plugin`, or `PluginError`. Actually loading and activating plugins is Phase 4.

## Public API (single barrel, Engineering Rule 1)

- `buildPluginLoadingPlan(pipeline: ExecutionPipelinePlan, host: PluginHost, declaration: PluginDeclaration): Result<PluginLoadingPlan, PluginLoadingError[]>`
  - build the plan, attaching it to the chain and delegating compatibility, failing closed.
- `validatePluginLoading(host: PluginHost, manifests: readonly PluginManifest[]): Result<readonly PluginManifest[], PluginLoadingError[]>`
  - validate a manifest set by delegating to the frozen `validateCompatibility`, failing closed.
- `PluginDeclaration`, `PluginLoadingPlan`, `PluginLoadingDiagnostics` - the read-only types.
- `PluginLoadingError` is a `BaseError` subtype (`infrastructure`) with `PLUGIN_LOADING.*` codes, wrapping the
  frozen `PluginError` as its cause.

`PluginLoadingPlan` holds the consumed `pipeline` (unchanged), the `available` / `enabled` / `compatible` / `ready`
manifest sets, `diagnostics` (their counts), and `validated: true`. Because the frozen compatibility check is
all-or-nothing and fails closed, a built plan's enabled set is wholly compatible and ready; any incompatibility
returns errors and no partial plan.

## Validation (delegated, fail closed)

`validatePluginLoading` performs no validation of its own: it calls the frozen `host.validateCompatibility` and, on
any `PluginError`, returns one `PLUGIN_LOADING.INCOMPATIBLE` error per problem (wrapping the frozen error), building
no partial set. `buildPluginLoadingPlan` uses it to validate the enabled set.

## Dependency direction

`@openlance/aios-plugin-loading -> { @openlance/aios-execution-pipeline, @openlance/aios-plugins, kernel, errors }`
(its `src/` edges, recorded in `dependency-graph.snapshot.json`; composition-root, namespace-wiring, di-integration,
runtime-lifecycle, config, logging, events are test-only devDependencies used to build the chain and a host). The
`app -> app` (execution-pipeline) and `app -> substrate` (plugins) edges are legal; no namespace edge or rule
changes.

## Non-responsibilities

No plugin discovery, loading, initialization, start, stop, or scheduling; no provider / tool / agent / workflow
execution; no runtime execution, orchestration, or event emission; no mutable or runtime state; no plugin
implementation. It declares and validates the static plugin loading plan; driving it is a Phase 4 loader's concern.
