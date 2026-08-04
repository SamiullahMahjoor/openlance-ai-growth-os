# Composition Root, Freeze Declaration (Phase 3, Stage 1)

**Status:** FROZEN (implemented, validated, and independently audited twice CLEAN).
**Package:** `@openlance/aios-composition-root` (`apps/composition-root`).
**Scope:** Phase 3, Stage 1: the AIOS application composition root, the first `apps/`-layer package, built on top
of the immutable Phase 2A substrate and the frozen Phase 2B namespaces. It is the app-layer realization of the
Composition Root role (ADR-0024 category 5, modeled by `ai/operations/`). Decision: ADR-0026 (Accepted;
supersedes ADR-0017). Design: `docs/implementation/23-composition-root.md`.

## What this stage owns

The composition root bootstraps AIOS by composing the substrate services into a validated, immutable object
graph. It owns the bootstrap entry, the substrate service-registration set, composition validation and
diagnostics, startup configuration, and the immutable application handle. It is a **thin application over the
frozen `@openlance/aios-di` mechanism** (ADR-0005): it consumes the container, module host, registry, tokens,
and startup `validate()`, and defines no container, registry, module host, `token()`, provider model,
dependency-resolution algorithm, or validation engine of its own (ADR-0026). It performs registration only: no
runtime execution, execution pipeline, namespace wiring, runtime lifecycle, plugin loading, orchestration, or
provider/agent execution.

## What was built

| Module | Owns |
|---|---|
| `src/bootstrap.ts` | `bootstrap(config): Result<Application, CompositionError[]>`, the public types (`CompositionConfig`, `Application`, `CompositionRegistry`, `RegisteredService`, `CompositionDiagnostics`, `CompositionMetadata`), and the internal substrate-module assembly |
| `src/errors.ts` | `CompositionError` (a `@openlance/aios-errors` `BaseError` subtype, `infrastructure`) |
| `src/index.ts` | the single explicit barrel (no wildcard) |

## Public API

- `bootstrap(config: CompositionConfig): Result<Application, CompositionError[]>` - the bootstrap entry.
- `CompositionConfig` - `{ config: readonly ConfigProvider[]; logging: LoggerOptions; modules?: readonly Module[] }`.
- `Application` - immutable: `{ container, registry, diagnostics, configuration, metadata, dispose() }`.
- `CompositionRegistry` / `RegisteredService`, `CompositionDiagnostics`, `CompositionMetadata`, `CompositionError`.

## Consume, never recreate (recorded for the freeze)

Every container/registry/builder/validation concern is owned by frozen `@openlance/aios-di` and consumed:
`createModuleHost`/`ModuleHost` is the graph builder; `Container`/`register`/`resolve`/`validate`/`dispose` is
the object graph; `Module`/`Registry`/`Provider` (`useValue`) are the registration primitives; `token()` and the
ADR-0014 tokens (`CONFIG_SERVICE`, `LOGGER`, `EVENT_BUS`) are the service keys. The composition root's
`CompositionRegistry` is read-only, deep-frozen DATA (no `register` method), not a reimplemented `di` `Registry`.
Both audits verified no reimplementation.

## Behavior (recorded for the freeze)

`bootstrap` builds `ConfigService` (`createConfigService`, failing closed), the `Logger` (`createLogger`), and
the `EventBus` (`createEventBus`, wired with the logger); wraps each as a `di` module registering the built
instance as a `useValue` singleton under its token; hands the three modules plus any extension modules to
`createModuleHost().build()` (topological order + startup `validate()`); and returns an immutable `Application`
over the validated container, or the aggregated `CompositionError[]`.

- **Fail closed.** On a configuration-build failure or a graph-validation failure, `bootstrap` returns
  `err(CompositionError[])` and builds no partial `Application`. No throw for expected failures (ADR-0006).
- **Immutable, no mutable builder retained.** The `Application` and its `registry` (deep), `diagnostics`, and
  `metadata` are `Object.freeze`d; the `di` module host used to build the graph is local and discarded.
- **Extension seam.** `CompositionConfig.modules` is optional, inert, and immutable: the composition root
  performs no discovery, loading, scanning, or registration side effects on it; it hands the modules verbatim to
  the frozen `di` host. It is inert in Stage 1 (the substrate is all there is to compose).

## Dependency graph and layer wiring

`@openlance/aios-composition-root -> { config, di, errors, events, kernel, logging }` (substrate only, recorded
in `dependency-graph.snapshot.json`). No namespace edge. The workspace, `depcruise`, and Turborepo already
included `apps/*`; two source-derived gates were extended, additively and non-weakening, to cover the new `app`
layer: `scripts/graph-snapshot.mjs` records the app's package edges (Rule 2, so any future namespace edge is a
reviewable diff), and `scripts/docs-check.mjs` validates the app's README, `aios` metadata (`layer: "app"`), ADR
references, and `.only`/`.skip` hygiene. No dependency-cruiser forbidding rule was added, removed, or weakened.

## Validation and audits

- Full `pnpm run validate` green end to end (typecheck, lint, format:check, depcruise, arch:check 10/10,
  graph:check, docs-check 25 packages, test, bench, docs, build).
- 100% statements/branches/functions/lines coverage; 8 tests; benchmark recorded; no `.only`/`.skip`.
- Two independent source audits, both CLEAN. One LOW finding (registry element records were not deep-frozen
  despite the documented "frozen data only" contract) was fixed (each `RegisteredService` is now
  `Object.freeze`d, with a test asserting it) and both audits re-run CLEAN. Two additive-coverage observations
  (docs-check `.only`/ADR-reference scans and a graph-snapshot existence guard) were also addressed.

## Regression

`ai/` and `knowledge/` byte-identical; the frozen Phase 2A substrate and all 13 frozen Phase 2B namespaces
unchanged; no ADR decision changed except the authorized supersession (ADR-0017 status flipped to "Superseded by
ADR-0026", its Decision body unedited; ADR-0026 added, Accepted). The complete change set is the composition-root
package, its design doc, ADR-0026, the ADR-0017 status flip, the ADR index, the two extended scripts, the graph
snapshot, and `pnpm-lock.yaml`.

## What "frozen" means

The composition root's public API, behavior (fail-closed bootstrap, immutable `Application`, substrate-only
composition), consume-not-recreate boundary, and dependency edge are settled for Stage 1. Namespace wiring,
runtime execution, and operational services are **not** part of this stage; they are later Phase 3 stages, each
under its own design document and, where it needs a concept the constitution does not define, its own ADR, and
each registers its services through the extension seam without changing this package's core.

## Allowed changes (no architecture review required)

Only these may change a frozen composition-root file without an architecture change process, each still running
the full validation pipeline: **compiler compatibility**, **security vulnerabilities**, **dependency updates**,
and **critical bug fixes**. Any change to the public API, the fail-closed contract, the immutable-`Application`
shape, or the consume-not-recreate boundary is an architectural modification requiring a new or superseding ADR,
an architecture review, an independent audit, and full validation.

## Constitutional and Phase 2A/2B layers remain immutable

`ai/` and `knowledge/` remain immutable (CI constitutional guard). The frozen substrate and namespaces are
unchanged; this stage consumes them and modifies none.

## Do not begin Stage 2

Phase 3 Stage 2 (Namespace Wiring) is not started. It is a separate, design-first stage.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
