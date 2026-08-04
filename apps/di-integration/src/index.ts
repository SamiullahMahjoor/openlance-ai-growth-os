/**
 * @packageDocumentation
 * `@openlance/aios-di-integration`
 *
 * The AIOS dependency-injection integration (Phase 3, Stage 3). It joins the Stage 1 composition root and the
 * Stage 2 namespace wiring into one immutable, validated `IntegratedApplication`: the consumed `WiredApplication`,
 * the injectable substrate surface referenced from the composition root, and the per-namespace injection
 * readiness (with an empty binding set today, because no frozen namespace exposes an operational service). It
 * validates only by delegating to the frozen `di` container's `validate()`, failing closed with
 * `DiIntegrationError[]`.
 *
 * It is a thin application layer over the frozen `@openlance/aios-di` mechanism (ADR-0005), the frozen composition
 * root (ADR-0026), and the frozen namespace wiring (ADR-0027). It consumes them and defines no container,
 * registry, provider model, module host, dependency-resolution algorithm, or validation engine. It registers no
 * service, resolves nothing for execution, activates nothing, runs no lifecycle, and holds no runtime state; those
 * are later Phase 3 stages, which register their services through the composition root's extension seam
 * (`CompositionConfig.modules`). Decision: ADR-0028. This file is the single supported public API (Engineering
 * Rule 1); deep imports into internal modules are prohibited and fail CI.
 *
 * Design: docs/implementation/25-di-integration.md.
 */

export { integrate } from './integration.js';
export type {
  InjectableSurface,
  NamespaceInjectionReadiness,
  IntegratedApplication,
} from './integration.js';
export { DiIntegrationError } from './errors.js';
