# Dependency Injection Integration, Freeze Declaration (Phase 3, Stage 3)

**Status:** FROZEN (implemented, validated, and independently audited twice CLEAN).
**Package:** `@openlance/aios-di-integration` (`apps/di-integration`).
**Scope:** Phase 3, Stage 3: the static dependency-injection integration, the third `apps/`-layer package, built
on the frozen Phase 2A substrate, the 13 frozen Phase 2B namespaces, the frozen Stage 1 composition root, and the
frozen Stage 2 namespace wiring. Decision: ADR-0028 (Accepted). Design: `docs/implementation/25-di-integration.md`.

## The gate this stage resolved

The Stage 3 mandate (register services, resolve dependencies, validate the dependency graph, produce activation
metadata, so later runtime stages can activate services) conflicts with the frozen surface: registration,
resolution, and graph validation are owned by the frozen DI mechanism (ADR-0005) and re-implementing them is
prohibited (ADR-0026 Decision 1); the 13 namespaces export no services and no DI tokens (verified by source
scan), so there is nothing to register or activate; the composition root already exposes the DI-integration seam
(`CompositionConfig.modules`); and activation and lifecycle are owned by `ai/runtime/` and the namespace lifecycle
models, with Stage 4 being Runtime Lifecycle. Per ADR-0007 and the mandate's own instruction, implementation
stopped at the design artifacts and awaited a direction. **Option A** (a descriptive integration-readiness layer)
was approved and is what this package implements.

## What this stage owns

An immutable, validated **`IntegratedApplication`** that joins the composition root and the namespace wiring:
the consumed `WiredApplication` (which nests the Stage 1 `Application`), the injectable substrate surface
referenced from the composition root, and the per-namespace injection readiness. It **describes, never owns**: it
is descriptive metadata, never a container, registry, service locator, resolver, scheduler, or orchestrator. It
**registers no service, resolves nothing for execution, activates nothing, and runs no lifecycle.**

## What was built

| Module | Owns |
|---|---|
| `src/integration.ts` | the public types, `integrate`, and the internal readiness/injectable helpers |
| `src/errors.ts` | `DiIntegrationError` (a `BaseError` subtype, `infrastructure`) |
| `src/index.ts` | the single explicit barrel (no wildcard) |

## Public API

- `integrate(wired: WiredApplication): Result<IntegratedApplication, DiIntegrationError[]>` - join the
  composition root and the namespace wiring, validating by delegation and failing closed.
- `IntegratedApplication`, `NamespaceInjectionReadiness`, `InjectableSurface`, `DiIntegrationError`.

`IntegratedApplication = { wired, injectable, readiness, validated: true }` (deep-frozen). `injectable` is the
substrate DI token descriptions available for future injection, **referenced** from
`Application.diagnostics.services`. Each `NamespaceInjectionReadiness` records `available`, `ready`, and an empty
`serviceBindings` (no namespace has an operational service yet); `validated: true` records that the frozen
`Container.validate()` passed.

## Consume, never recreate; never duplicate the constitution

It consumes the frozen DI mechanism (ADR-0005), the composition root (ADR-0026), and the namespace wiring
(ADR-0027), and recreates no container, registry, provider model, module host, dependency-resolution algorithm,
or validation engine. Registration, resolution, and graph validation stay the frozen DI's: `integrate` performs
no validation of its own, delegating to `Container.validate()`. The injectable surface is referenced from the
composition root's already-registered services, never re-registered. It re-encodes no constitutional dependency
map and re-produces no namespace manifest. "Activation metadata" is reframed as **injection-readiness metadata**
because an app-layer activation concept is not defined by the constitution and activation is Runtime-owned;
producing it would recreate a Runtime or namespace-lifecycle model (ADR-0025) or invent architecture.

## Validation (delegated, fail closed)

`integrate` calls the frozen `Container.validate()` and, on any `DependencyError`, returns `DiIntegrationError[]`
with no partial result; runtime, execution, provider, and service compatibility are later phases. Failures ride
the `Result` channel (ADR-0006), never thrown.

## Immutability

The `IntegratedApplication`, its `readiness` array, each readiness record, and each record's `serviceBindings`
(the shared frozen `NO_BINDINGS`) are all `Object.freeze`d; `injectable` references the composition root's
already-frozen array. `integrate` builds a fresh graph each call and retains no mutable state. Both audits
verified the deep freeze empirically.

## Dependency graph

`@openlance/aios-di-integration -> { @openlance/aios-namespace-wiring, @openlance/aios-composition-root, kernel,
errors }` (its `src/` edges, recorded in `dependency-graph.snapshot.json`; config and logging are test-only
devDependencies). The `app -> app` edges are legal (ADR-0028); no dependency-cruiser rule or namespace edge
changed. The `apps/` layer was already covered by the gates (extended in Stage 1), so the package participates
automatically; the graph snapshot was regenerated.

## Validation and audits

- Full `pnpm run validate` green end to end (typecheck, lint, format:check, depcruise, arch:check 10/10,
  graph:check, docs-check 27 packages / 28 ADRs / 255 constitution ids, test, bench, docs, build).
- 100% statements/branches/functions/lines coverage; 5 tests; benchmark recorded; no `.only`/`.skip`.
- Two independent source audits, both CLEAN. Audit 1 (traceability and design-fidelity) and Audit 2 (purity,
  immutability, and regression) each returned CLEAN with no Tier 1/2 defects; one Tier-3 cosmetic test-title
  wording noted by Audit 1 was corrected. Deep immutability, the fail-closed delegation, and the
  no-duplication constraint were verified empirically.

## Regression

`ai/` and `knowledge/` byte-identical; the frozen Phase 2A substrate, all 13 frozen Phase 2B namespaces, the
frozen Stage 1 composition root, and the frozen Stage 2 namespace wiring unchanged; `.dependency-cruiser.cjs` and
`scripts/` unchanged; no other ADR's decision changed except the new ADR-0028 (Accepted). The complete change set
is the di-integration package, its design doc, ADR-0028, the ADR index row, the graph snapshot, and
`pnpm-lock.yaml`.

## What "frozen" means

The integration layer's public API, behavior (delegated fail-closed validation, immutable `IntegratedApplication`,
descriptive injection-readiness only), consume-not-recreate boundary, non-duplication of the constitution and of
the frozen DI, and dependency edges are settled for Stage 3. Dependency injection of namespace services, namespace
activation, runtime lifecycle, and the execution pipeline are **not** part of this stage.

## Allowed changes (no architecture review required)

Only compiler compatibility, security vulnerabilities, dependency updates, and critical bug fixes may change a
frozen di-integration file without an architecture change process, each still running the full validation
pipeline. Any change to the public API, the describe-never-own boundary, the fail-closed delegated-validation
contract, the immutable `IntegratedApplication` shape, or the consume-not-recreate boundary is an architectural
modification requiring a new or superseding ADR, an architecture review, an independent audit, and full
validation.

## Constitutional and prior-phase layers remain immutable

`ai/` and `knowledge/` remain immutable (CI constitutional guard). The frozen substrate, namespaces, composition
root, and namespace wiring are unchanged; this stage consumes them and modifies none.

## Do not begin Stage 4

Phase 3 Stage 4 (Runtime Lifecycle) is not started. It is a separate, design-first stage.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
