/**
 * @packageDocumentation
 * `@openlance/aios-composition-root`
 *
 * The AIOS application composition root (Phase 3, Stage 1). It bootstraps the layer by composing the substrate
 * services - `CONFIG_SERVICE`, `LOGGER`, `EVENT_BUS` - into a validated, immutable object graph, and returns a
 * single immutable `Application` (its container, registry, diagnostics, configuration, and metadata) or, failing
 * closed, `CompositionError[]`.
 *
 * It is a thin application layer over the frozen `@openlance/aios-di` mechanism (ADR-0005, ADR-0026). It
 * consumes `createModuleHost`, the `Container`, `Module`/`Registry`, and `di`'s startup `validate()`, and the
 * ADR-0014 tokens exposed by config, logging, and events; it defines no container, service registry, module
 * host, factory model, dependency-resolution algorithm, or validation engine of its own. It performs
 * registration only: no runtime execution, no namespace wiring, no runtime lifecycle, no execution pipeline, no
 * plugin loading, no orchestration, no provider or agent execution. Those are later Phase 3 stages, which
 * register their services through the extension seam (`CompositionConfig.modules`), inert in Stage 1.
 *
 * It is the app-layer realization of the constitutional Composition Root role (ADR-0024 category 5, modeled by
 * `ai/operations/`); it references that model and restates none of it. This file is the single supported public
 * API (Engineering Rule 1); deep imports into internal modules are prohibited and fail CI.
 *
 * Design: docs/implementation/23-composition-root.md. Decision: ADR-0026.
 */

export { bootstrap } from './bootstrap.js';
export type {
  CompositionConfig,
  Application,
  CompositionRegistry,
  RegisteredService,
  CompositionDiagnostics,
  CompositionMetadata,
} from './bootstrap.js';
export { CompositionError } from './errors.js';
