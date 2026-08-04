# @openlance/aios-composition-root

The AIOS application composition root (Phase 3, Stage 1). It bootstraps the layer by composing the substrate
services into a validated, immutable object graph. It is the first `apps/`-layer package.

- **Layer:** `app` (a composition root; `apps/*` per docs/implementation/00-repository-architecture.md).
- **Design:** [docs/implementation/23-composition-root.md](../../docs/implementation/23-composition-root.md).
  **Decision:** [ADR-0026](../../docs/implementation/adr/0026-application-composition-root.md) (supersedes
  ADR-0017).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

A thin application layer over the frozen `@openlance/aios-di` mechanism (ADR-0005). It **consumes** DI; it does
not recreate it. `bootstrap(config)` builds the three substrate services (`CONFIG_SERVICE`, `LOGGER`,
`EVENT_BUS`) through their owning-package builders (`createConfigService`, `createLogger`, `createEventBus`),
wraps each as a `di` `Module`, hands them plus any extension modules to `createModuleHost().build()` (which
orders, registers, and runs `di`'s startup `validate()`), and returns one immutable `Application`, or fails
closed with `CompositionError[]`.

It performs **registration only**. It runs no runtime execution, no execution pipeline, no namespace wiring, no
runtime lifecycle, no plugin loading, no orchestration, and no provider or agent execution. Those are later
Phase 3 stages, which register their services through the extension seam. It is the app-layer realization of the
constitutional Composition Root role (ADR-0024 category 5, modeled by `ai/operations/`); it references that
model and restates none of it.

### Consume, never recreate (ADR-0026)

Every "container / registry / builder / validation" concern is owned by frozen `@openlance/aios-di` and is
consumed, not rebuilt:

| Frozen `di` symbol | Used as |
|---|---|
| `createContainer` / `Container` (`register`, `resolve`, `validate`, `dispose`) | the object graph |
| `createModuleHost` / `ModuleHost` (order, register, validate, build) | the graph builder |
| `Module` / `Registry` / `Provider` (`useValue`) | the registration primitives |
| `token()` and the `CONFIG_SERVICE` / `LOGGER` / `EVENT_BUS` tokens (ADR-0014) | the service keys |
| `Container.validate()` | composition validation |

The composition root adds none of these; it adds the bootstrap entry, the substrate service-registration set,
composition diagnostics, startup configuration, and the immutable `Application`.

## Public API (single barrel, Engineering Rule 1)

- `bootstrap(config: CompositionConfig): Result<Application, CompositionError[]>` - the bootstrap entry.
- `CompositionConfig` - startup configuration: `config` (the `ConfigProvider[]`), `logging` (the
  `LoggerOptions`: level, clock, sinks), and the optional, inert, immutable `modules` extension seam.
- `Application` - the immutable composition state: `container` (the validated `di` container, resolve-only
  downstream), `registry` (the frozen `RegisteredService[]`), `diagnostics`, `configuration`, `metadata`, and
  `dispose()` (delegates to the container).
- `CompositionRegistry` / `RegisteredService`, `CompositionDiagnostics`, `CompositionMetadata` - read-only
  composition-state types.
- `CompositionError` - a `BaseError` subtype (`infrastructure`) with `COMPOSITION.*` codes.

## Fail closed

If the configuration service fails to build, or the composed dependency graph fails validation, `bootstrap`
returns `err(CompositionError[])` and builds no partial `Application`. Success returns one immutable
`Application`; the `di` module host used to build it is local and discarded, so no mutable builder remains.

## Dependency direction

Substrate only: `@openlance/aios-composition-root -> { di, config, logging, events, kernel, errors }`. It imports
no AI namespace package and wires none (namespace composition is a later Phase 3 stage). Its package-level edges
are recorded in `dependency-graph.snapshot.json`, so any future namespace edge appears as a reviewable diff
(Engineering Rule 2).

## Non-responsibilities

It owns no container, registry, module host, or validation (frozen `di` owns those); no runtime execution,
orchestration, lifecycle, events emission, plugin loading, monitoring, or AI behavior; and no namespace wiring.
It composes the substrate object graph and returns it; running the layer is a later stage's concern.
