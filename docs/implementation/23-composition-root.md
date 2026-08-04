# 23. Application composition root implementation design (Phase 3, Stage 1)

**Status: IMPLEMENTED and frozen (Phase 3, Stage 1).** Built after the design review approval per ADR-0007
(design-first). [ADR-0026](adr/0026-application-composition-root.md) is Accepted and supersedes ADR-0017.
Package: `apps/composition-root` (`@openlance/aios-composition-root`).

## 1. Scope and ownership

Phase 3, Stage 1 builds the **application composition root**: the production bootstrap that constructs the AIOS
object graph. It owns the bootstrap entry, the substrate service-registration set, composition validation and
diagnostics, startup configuration, and the immutable application handle. It **consumes the frozen
`@openlance/aios-di` mechanism** (ADR-0005) and the substrate services' ADR-0014 tokens; it defines no new
container, registry, module host, provider model, dependency-resolution algorithm, or validation engine.

It owns **only** composition. It does not execute runtime, wire or call any namespace, call a provider or tool,
run reasoning/memory/retrieval/prompts/agents, load plugins, run the event loop, hold runtime state, or perform
any AI behavior. Those belong to later Phase 3 stages.

## 2. Category and the consume-not-recreate principle

ADR-0024 category 5 (Composition Root) is the constitutional **role** the Operations namespace models; this
package is its `app`-layer realization (ADR-0026). It **consumes** the frozen DI mechanism rather than
recreating it:

| DI concept frozen in `@openlance/aios-di` (ADR-0005) | Used by the composition root as |
|---|---|
| `createContainer` / `Container` (register, resolve, scope, `validate`, `dispose`) | the object graph and its lifetime |
| `createModuleHost` / `ModuleHost` (collect, order, register, validate, build) | the graph builder |
| `Module` / `Registry` / `Provider` (`useValue`) | the registration primitives |
| `token()` and the `CONFIG_SERVICE` / `LOGGER` / `EVENT_BUS` tokens (ADR-0014) | the service keys |
| `Container.validate()` -> `Result<void, DependencyError[]>` | composition validation |

Nothing in that column is rebuilt.

## 3. What Stage 1 composes (and what it defers)

The only cross-package services with runtime code are the three substrate services fixed by ADR-0014:
`ConfigService` (`createConfigService`, fallible), the logger (`createLogger`), and the event bus
(`createEventBus`). All 13 namespace packages are pure ADR-0020 domain models with dependency edge `[]` and no
runtime code, so there is nothing else to compose. Stage 1 therefore registers those three services as `di`
modules under their tokens, builds a validated `Container`, and returns an immutable `Application`; it registers
no namespace or operational service. Later stages register their services through the extension seam
(`CompositionConfig.modules`), which is inert in Stage 1.

## 4. Public API and package layout

Package `apps/composition-root`, name `@openlance/aios-composition-root`, `aios.layer: "app"`. Single explicit
barrel (`src/index.ts`, no wildcard). Modules: `bootstrap.ts` (the public types and the `bootstrap` function),
`errors.ts` (`CompositionError`).

```ts
// Startup configuration (immutable). Supplies exactly what each substrate builder needs, plus the seam.
export interface CompositionConfig {
  readonly config: readonly ConfigProvider[]; // providers for createConfigService
  readonly logging: LoggerOptions;            // level, clock, sinks for createLogger
  readonly modules?: readonly Module[];        // extension seam: optional, inert, immutable
}

// The immutable composition state returned on success.
export interface Application {
  readonly container: Container;                 // the validated di container (resolve-only downstream)
  readonly registry: CompositionRegistry;        // frozen RegisteredService[] (token, module, lifetime)
  readonly diagnostics: CompositionDiagnostics;  // { modules, services, validated: true }
  readonly configuration: CompositionConfig;     // the frozen config it was composed from
  readonly metadata: CompositionMetadata;        // { package, stage, serviceCount, moduleCount }
  dispose(): Promise<void>;                       // delegates to container.dispose (reverse order)
}

// Bootstrap entry: build the object graph, failing closed. No throw for expected problems.
export function bootstrap(config: CompositionConfig): Result<Application, CompositionError[]>;
```

`bootstrap` builds each substrate service through its owning-package builder (`createConfigService`, failing
closed; `createLogger`; `createEventBus` wired with the logger), wraps each as a `di` `Module` registering the
built instance as a `useValue` singleton, hands the three modules plus `config.modules` to
`createModuleHost().build()`, and returns the immutable `Application` over the validated container or the
aggregated `CompositionError[]`. `CompositionError` is an `@openlance/aios-errors` `BaseError` subtype
(`infrastructure`); failures stay on the `Result` channel (ADR-0006). The `di` module host used to build the
graph is local and discarded, so no mutable builder remains after a successful bootstrap.

## 5. Deliverable reconciliation

| Requested deliverable | Disposition |
|---|---|
| Container, DI container, Service registry, Factory registry, Dependency registry, Builder, Composition graph, Object creation order, Dependency graph verification, Dependency resolution | **Owned by frozen `@openlance/aios-di`**; consumed, never rebuilt. |
| AIOS bootstrap, Application startup, Bootstrap entry, Application bootstrap | `bootstrap(config): Result<Application, ...>` |
| Service / Factory / Registry / Dependency registration | Registering the three substrate services as `di` modules under their ADR-0014 tokens (`useValue` singletons) |
| Composition validation, Bootstrap validation, Composition verification | `createModuleHost().build()` running `Container.validate()`, surfaced on the `Result` |
| Composition diagnostics | `CompositionDiagnostics` (read-only report) |
| Startup configuration | `CompositionConfig` |
| Composition graph / object creation order | The validated `Container` plus the frozen `CompositionRegistry` |
| Bootstrap tests | Vitest suite (success, extension seam, config fail-closed, graph-validation fail-closed, diagnostics, registry, disposal) |

Out of Stage 1 (Strict Boundaries, ADR-0017, ADR-0026): runtime execution, execution pipeline, namespace
wiring, provider/tool/reasoning/memory/retrieval/prompt/agent execution, plugin loading, events emission,
monitoring, lifecycle execution, runtime state, and any AI behavior.

## 6. Boundaries

- Consumes `@openlance/aios-di`; never reimplements a container/registry/validation.
- Registers only the substrate services; namespace/operational services are a later stage via the seam. No
  frozen namespace package is imported or wired.
- No runtime execution, event emission, plugin loading, monitoring, or mutable runtime state.
- Fails closed on the `Result` channel (ADR-0006); builds no partial `Application`.
- Modifies no Phase 2A substrate, no Phase 2B namespace, no constitution, and no other ADR's decision.

## 7. Dependency graph and layer wiring

`@openlance/aios-composition-root -> { di, config, logging, events, kernel, errors }` (substrate only). It adds
no reverse edge and no namespace edge. The workspace, `depcruise`, and Turborepo already include `apps/*`, so
the package participates in typecheck, lint, format, depcruise, test, bench, and build automatically. Two
source-derived gates that previously scanned only `packages/` were extended to cover the new `app` layer:
`scripts/graph-snapshot.mjs` now records the app's package edges (so any future namespace edge is a reviewable
diff, Engineering Rule 2), and `scripts/docs-check.mjs` now validates the app's README and `aios` metadata
block (layer `app`). No dependency-cruiser forbidding rule was added: the app depends only on substrate barrels,
`no-circular`/`no-orphan` already cruise `apps/`, and the graph snapshot makes any new edge reviewable; a
namespace edge becomes legal, per stage, only when a later stage designs that wiring. No existing edge, rule, or
snapshot entry changed.

## 8. Testing strategy (ADR-0022 / Rule 6)

100% statements/branches/functions/lines. The suite covers: a valid bootstrap composes and resolves the three
services; the registry and diagnostics report the composed graph; configuration and metadata are immutable; an
extension module composes alongside the substrate and resolves; a failing configuration provider makes
`bootstrap` return `err` without throwing; an invalid extension graph (missing dependency) is surfaced as
`CompositionError[]`; and disposal resolves. Benchmark: the `bootstrap` build path (Rule 5 baseline).

## 9. Approved decisions (resolved at review)

1. **Package** - `apps/composition-root` (`@openlance/aios-composition-root`). Approved.
2. **Scope** - compose the three substrate services (`CONFIG_SERVICE`, `LOGGER`, `EVENT_BUS`); registration
   only, no execution/namespace-wiring/lifecycle/pipeline/plugin/orchestration/provider/agent execution.
   Approved.
3. **Extension seam** - include the optional, inert, immutable `modules?: Module[]`; no discovery, loading,
   scanning, execution, or registration side effects by the composition root. Approved.
4. **Application** - one immutable `Application` (container, registry, diagnostics, configuration, metadata);
   no mutable builder remains. Approved.
5. **Fail closed** - on any failure, build nothing, return the failure, never a partial `Application`. Approved.
6. **Consume, never recreate** - thin layer over frozen `di`; recreate no container/registry/host/token/
   validate/graph/factory. Approved.

## 10. Acceptance criteria (met)

- Consumes `@openlance/aios-di`; defines no new container/registry/validation; every requested
  container/registry/builder deliverable maps to a consumed `di` symbol.
- `bootstrap` returns a validated, immutable `Application` or a `Result` error, failing closed; runs nothing.
- Substrate-only dependency edge `[]` beyond substrate; no namespace imported or wired.
- Full validation green; 100% coverage; benchmark recorded; two independent source audits CLEAN.
- Zero regression: `ai/`, `knowledge/`, the frozen substrate, all 13 frozen namespaces, and every other ADR's
  decision unchanged.
