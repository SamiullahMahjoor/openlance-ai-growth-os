# @openlance/aios-di-integration

The AIOS dependency-injection integration (Phase 3, Stage 3). It joins the Stage 1 composition root and the
Stage 2 namespace wiring into one immutable, validated **`IntegratedApplication`**.

- **Layer:** `app` (the integration counterpart to the composition root and the namespace wiring; `apps/*`).
- **Design:** [docs/implementation/25-di-integration.md](../../docs/implementation/25-di-integration.md).
  **Decision:** [ADR-0028](../../docs/implementation/adr/0028-di-integration-layer.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

A thin application layer that **consumes** the frozen `WiredApplication` (which nests the Stage 1 `Application`)
and produces one immutable `IntegratedApplication`: the consumed `WiredApplication`, the injectable substrate
surface referenced from the composition root, and the per-namespace injection readiness. `integrate(wired)`
delegates dependency-graph validation to the frozen `di` container, records the readiness, and returns the frozen
handle, or fails closed with `DiIntegrationError[]`.

The integration is **descriptive metadata, not runtime state**. It is never a container, registry, service
locator, resolver, scheduler, or orchestrator. This stage **registers no service, resolves nothing for
execution, activates nothing, and runs no lifecycle**: no namespace exposes an operational service yet
(ADR-0020), so there is nothing to register or activate. "Activation metadata" is reframed as
**injection-readiness metadata**, because activation and lifecycle are owned by `ai/runtime/` and the namespace
lifecycle models, and Stage 4 is Runtime Lifecycle.

### Consume, never recreate

It recreates no container, registry, provider model, module host, resolution algorithm, or validation engine
(all owned by `@openlance/aios-di`, ADR-0005), and no composition root or namespace manifest (ADR-0026,
ADR-0027). Registration, resolution, and dependency-graph validation are the frozen DI mechanism's, consumed
here: `integrate` validates only by delegating to `Container.validate()`. The injectable surface is
**referenced** from the composition root's already-registered services, never re-registered. Each namespace's
`serviceBindings` is empty today; a later stage populates it through the composition root's extension seam
(`CompositionConfig.modules`, ADR-0026), once namespaces have operational services (ADR-0021).

## Public API (single barrel, Engineering Rule 1)

- `integrate(wired: WiredApplication): Result<IntegratedApplication, DiIntegrationError[]>` - join the
  composition root and the namespace wiring, validating by delegation and failing closed.
- `IntegratedApplication`, `NamespaceInjectionReadiness`, `InjectableSurface` - the read-only integration types.
- `DiIntegrationError` is a `BaseError` subtype (`infrastructure`) with `DI_INTEGRATION.*` codes.

`IntegratedApplication` holds the consumed `wired` (unchanged), the `injectable` surface (the substrate DI token
descriptions available for future injection, referenced from `Application.diagnostics.services`), the per-
namespace `readiness` (each `available`, `ready`, with an empty `serviceBindings`), and `validated: true`, which
records that the frozen container's `validate()` passed.

## Validation (delegated, fail closed)

`integrate` performs no validation of its own. It calls the frozen `Container.validate()` and, on any
`DependencyError`, returns `DiIntegrationError[]` with no partial result; runtime, execution, provider, and
service compatibility are later phases.

## Dependency direction

`@openlance/aios-di-integration -> { @openlance/aios-namespace-wiring, @openlance/aios-composition-root, kernel,
errors }` (its `src/` edges, recorded in `dependency-graph.snapshot.json`; config and logging are test-only
devDependencies). The `app -> app` edges are legal (ADR-0028); no namespace edge or rule changes.

## Non-responsibilities

No dependency-injection container, registry, or resolver; no service registration; no namespace activation; no
runtime lifecycle; no execution pipeline; no orchestration, scheduling, event processing, or business logic
(those are the frozen DI's, or later Phase 3 stages). It joins and validates the static integration and produces
immutable injection-readiness metadata; running the layer is a later stage's concern.
