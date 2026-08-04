# Plugin Loading, Freeze Declaration (Phase 3, Stage 6)

**Status:** FROZEN (implemented, validated, and independently audited twice CLEAN).
**Package:** `@openlance/aios-plugin-loading` (`apps/plugin-loading`).
**Scope:** Phase 3, Stage 6: the application-level plugin loading integration, the sixth `apps/`-layer package,
built on the frozen Phase 2A substrate (in particular the frozen `@openlance/aios-plugins` framework) and the
frozen Stage 1 to Stage 5 packages. Decision: ADR-0032 (Accepted; supersedes ADR-0031, reopening Phase 3 to
continue through Stage 9). Design: `docs/implementation/29-plugin-loading.md`.

Note on the freeze boundary: per ADR-0032 the Phase 3 integration layer is frozen together at the consolidated
Stage 9 Runtime Freeze. This document records that Stage 6 is settled and audited; it does not pre-empt the
Stage 9 layer-wide freeze.

## What this stage owns

An immutable **`PluginLoadingPlan`** declaring, for the integrated application, which plugins are available,
enabled, compatible, and ready, attached to the Stage 5 runtime integration chain handle. It **describes, never
owns**: it references the frozen plugin framework and re-declares nothing, and it **executes nothing**: it does not
discover, load, initialize, start, stop, or schedule plugins, and runs no provider, tool, agent, or workflow. Those
are Phase 4.

## What was built

| Module | Owns |
|---|---|
| `src/plugin-loading.ts` | the public types, `buildPluginLoadingPlan`, `validatePluginLoading` |
| `src/errors.ts` | `PluginLoadingError` (a `BaseError` subtype, `infrastructure`) |
| `src/index.ts` | the single explicit barrel (no wildcard) |

## Public API

- `buildPluginLoadingPlan(pipeline: ExecutionPipelinePlan, host: PluginHost, declaration: PluginDeclaration): Result<PluginLoadingPlan, PluginLoadingError[]>`
  - build the plan, attaching it to the chain and delegating compatibility, failing closed.
- `validatePluginLoading(host: PluginHost, manifests: readonly PluginManifest[]): Result<readonly PluginManifest[], PluginLoadingError[]>`
  - validate a manifest set by delegating to the frozen `validateCompatibility`, failing closed.
- `PluginDeclaration`, `PluginLoadingPlan`, `PluginLoadingDiagnostics`, `PluginLoadingError`.

`PluginLoadingPlan = { pipeline, available, enabled, compatible, ready, diagnostics, validated: true }`
(deep-frozen). `enabled` is all available plugins, or the named subset; `compatible` and `ready` are the validated
enabled set (the frozen compatibility check is all-or-nothing and fails closed, so a built plan's enabled set is
wholly compatible).

## Consume, never recreate

The plugin loading mechanism is owned, in full, by the frozen substrate package `@openlance/aios-plugins`
(subsystem 07, ADR-0012, ADR-0013): the `PluginHost` (`discover`/`validateCompatibility`/`load`/`start`/`stop`),
`createPluginHost`, the register -> init -> start / stop -> dispose activation model, compatibility validation, and
the contracts. This package recreates none of them; it receives a frozen `PluginHost` and consumes only its
`validateCompatibility`, and consumes the frozen `ExecutionPipelinePlan`. It re-declares no `PluginManifest`,
`PluginContext`, `Plugin`, or `PluginError` (it consumes those types), and no chain handle. Actually loading and
activating plugins is Phase 4.

## Validation (delegated, fail closed)

`validatePluginLoading` performs no validation of its own; it delegates to the frozen `host.validateCompatibility`
and, on any `PluginError`, returns one `PLUGIN_LOADING.INCOMPATIBLE` error per problem (wrapping the frozen error as
its cause), building no partial set. `buildPluginLoadingPlan` uses it (through kernel `map`) to validate the enabled
set, failing closed. Failures ride the `Result` channel (ADR-0006), never thrown.

## Immutability

The `PluginLoadingPlan`, its `available`, `enabled`, `compatible`, `ready` arrays, and its `diagnostics` are all
`Object.freeze`d; `compatible` and `ready` are the frozen array returned by `validatePluginLoading`; `pipeline` is
the already-deep-frozen Stage 5 object. Both functions are pure; the package holds no mutable state. Both audits
verified the deep freeze empirically.

## Dependency graph

`@openlance/aios-plugin-loading -> { @openlance/aios-execution-pipeline, @openlance/aios-plugins, kernel, errors }`
(its `src/` edges, recorded in `dependency-graph.snapshot.json`; composition-root, namespace-wiring, di-integration,
runtime-lifecycle, config, logging, events are test-only devDependencies). The `app -> app` (execution-pipeline)
and `app -> substrate` (plugins, the terminal substrate package) edges are legal; no dependency-cruiser rule or
namespace edge changed.

## Validation and audits

- Full `pnpm run validate` green end to end (typecheck, lint, format:check, depcruise, arch:check 10/10,
  graph:check, docs-check 30 packages / 32 ADRs / 255 constitution ids, test, bench, docs, build).
- 100% statements/branches/functions/lines coverage; 8 tests; benchmark recorded; no `.only`/`.skip`.
- Two independent source audits, both CLEAN on the first pass, no findings at any severity. Audit 1 (constitutional
  ownership, traceability, ADR compliance including the ADR-0031 supersession, documentation fidelity, API
  correctness, no duplication) and Audit 2 (purity, architecture, dependency correctness, regression, immutability,
  implementation correctness). Deep immutability, the no-execution constraint, the delegated compatibility, and the
  no-duplication constraint were verified empirically.

## Regression

`ai/` and `knowledge/` byte-identical; the frozen Phase 2A substrate (including `packages/plugins`), all 13 frozen
namespaces, and the five frozen Stage 1 to Stage 5 packages unchanged; `.dependency-cruiser.cjs` and `scripts/`
unchanged. The complete change set is the plugin-loading package, its design doc, ADR-0032, the ADR-0031 status
flip (Decision body unedited), the ADR index, the `PHASE-3-COMPLETE.md` reopening note, the graph snapshot, and
`pnpm-lock.yaml`.

## What "frozen" means

The plugin loading plan's public API, behavior (delegated fail-closed compatibility validation, immutable
`PluginLoadingPlan`, consume-not-recreate boundary, executes-nothing boundary), and dependency edges are settled
for Stage 6. Discovering, loading, initializing, starting, stopping, or scheduling plugins, and all provider / tool
/ agent / workflow execution, are Phase 4 and not part of this stage.

## Allowed changes (no architecture review required)

Only compiler compatibility, security vulnerabilities, dependency updates, and critical bug fixes may change a
frozen plugin-loading file without an architecture change process, each still running the full validation pipeline.
Any change to the public API, the describe-never-own boundary, the executes-nothing boundary, the fail-closed
delegated-validation contract, the immutable `PluginLoadingPlan` shape, or the consume-not-recreate boundary is an
architectural modification requiring a new or superseding ADR, an architecture review, an independent audit, and
full validation.

## Constitutional and prior layers remain immutable

`ai/` and `knowledge/` remain immutable (CI constitutional guard). The frozen substrate (including the plugin
framework), namespaces, and the five prior Phase 3 packages are unchanged; this stage consumes them and modifies
none.

## Do not begin Stage 7

Phase 3 Stage 7 (Error Propagation), Stage 8 (Event Flow), and Stage 9 (Runtime Freeze) are not started. Each is a
separate, design-first stage; Stage 9 will be the consolidated Phase 3 Runtime Freeze.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
