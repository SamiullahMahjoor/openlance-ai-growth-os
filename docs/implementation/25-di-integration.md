# 25. Dependency Injection Integration design (Phase 3, Stage 3)

**Status: IMPLEMENTED and frozen (Phase 3, Stage 3).** This document raised an Ambiguity Gate (Sections 2, 3):
Stage 3 as literally specified conflicts with the frozen DI (ADR-0005), the composition root's existing seam
(ADR-0026), and the fact that no namespace has services yet. The gate was resolved by approval of **Option A**
(Section 4), the descriptive integration-readiness layer, which is what `apps/di-integration`
(`@openlance/aios-di-integration`) implements. [ADR-0028](adr/0028-di-integration-layer.md) is Accepted. The
conflict analysis below is retained as the rationale for the shape.

## 1. Mandate

Stage 3 is to own "dependency-injection integration between the already-frozen Composition Root and Namespace
Wiring so later runtime stages can activate services," building one new package "if constitutionally required,"
and to: register services, resolve dependencies, validate the dependency graph, and produce immutable dependency
metadata and immutable activation metadata, with no activation, no execution, and no lifecycle transitions.

The mandate also instructs: consume never recreate; do not duplicate containers, registries, providers,
factories, builders, dependency graphs, validation, or lifecycle already owned elsewhere; and, if any
duplication risk, frozen-package conflict, ownership conflict, or ambiguity exists, stop and produce design
artifacts only. Reading the frozen sources in full surfaces exactly those conflicts, so this document raises the
gate rather than implementing.

## 2. The frozen surface (what already exists and who owns it)

- **The DI mechanism, `@openlance/aios-di` (ADR-0005, stability High).** Its own barrel documentation states it
  "owns service registration, the three lifetimes, scopes, module registration and composition, and
  deterministic startup validation that rejects missing dependencies, cycles, and lifetime mismatches." Concrete
  surface: `Container` (`register`, `resolve`, `createScope`, `validate(): Result<void, DependencyError[]>`,
  `dispose`), `ModuleHost` (whose doc-comment names it "The composition root: collect modules, then build a
  validated container"), `token()`, `Provider` (`useValue` / `useClass` / `useFactory`), and `validateGraph`
  (missing dependency, circular dependency, lifetime mismatch). Registration, resolution, and dependency-graph
  validation are owned here, in full.
- **The Composition Root, `@openlance/aios-composition-root` (ADR-0026).** It composes the substrate services
  (`CONFIG_SERVICE`, `LOGGER`, `EVENT_BUS`) through the frozen `createModuleHost().build()`, validates through
  the frozen `container.validate()`, and returns an immutable `Application` (`container`, `registry`,
  `diagnostics`, `configuration`, `metadata`, `dispose`). It already exposes an **extension seam**:
  `CompositionConfig.modules?: readonly Module[]`, documented verbatim as "the extension seam: additional frozen
  `di` modules later Phase 3 stages register their services through," handed "verbatim, to the frozen `di` module
  host, which registers and validates them alongside the substrate modules." ADR-0026 Decision 1 forbids
  re-implementing the container, registry, provider model, module host, resolution algorithm, or validation
  engine; Decision 2 and the Consequences designate this seam as the mechanism by which "later Phase 3 stages
  (runtime execution, provider adapters, namespace operational services) register their services."
- **Namespace Wiring, `@openlance/aios-namespace-wiring` (ADR-0027).** It produces the immutable, validated
  `NamespaceManifest` (a descriptor per namespace, each carrying its actual, empty dependency edges) and the
  `WiredApplication` (`{ application, namespaces, diagnostics }`), which already nests the composition root's
  `Application`. It is the immutable dependency metadata for the namespace graph.
- **The 13 namespaces (ADR-0020, ADR-0021).** Each is a pure domain model with dependency edge `[]`, no DI
  token, no service, no runtime code (verified: a source scan of `packages/namespaces` finds zero
  `Service`/`Token`/`Provider`/`Factory`/`Container` exports and zero `token(`/`register(`/`useValue`/
  `useFactory`/`useClass` usages). ADR-0021 states a namespace "receives cross-cutting services by dependency
  injection at composition time rather than importing them," and ADR-0026 places the creation of those
  operational services in "each namespace's operational implementation," a later stage.
- **The constitutional model, `ai/operations/` (ADR-0024 category 5, the Composition Root role).** The app
  layer conforms to it. It states, normatively: "Operations is not the runtime. The runtime executes,
  orchestrates, and schedules ... Operations never executes, orchestrates, or schedules"; and it owns "no runtime
  execution." Activation of services and lifecycle transitions are Runtime-owned (`ai/runtime/`) and, at the
  model level, are namespace-lifecycle concerns (the `activation` phase owned by Providers, Tools, and Agents).

## 3. The conflicts (why the gate fires)

1. **Register / resolve / validate the dependency graph are owned by the frozen DI mechanism (ADR-0005) and are
   already consumed by the Composition Root (ADR-0026).** A Stage 3 package that registers services, resolves
   dependencies, or validates the graph would re-implement `Container.register` / `Container.resolve` /
   `Container.validate` and `ModuleHost`, which ADR-0026 Decision 1 explicitly prohibits ("Re-implementing any of
   them is prohibited"). This is a direct frozen-package and duplication conflict.

2. **There are no services to register, resolve, or activate.** The namespaces export none, and creating them is
   each namespace's own later operational stage (ADR-0026 Consequences). "So later runtime stages can activate
   services" presupposes services that do not yet exist. Registering nothing is not registration; a package whose
   registration set is necessarily empty has no registration to own.

3. **"Produce immutable dependency metadata" is already produced.** The `NamespaceManifest` (ADR-0027) is the
   immutable namespace dependency metadata, and the composition `registry` / `diagnostics` (ADR-0026) is the
   immutable substrate-service metadata. Producing a third copy duplicates one or both.

4. **"Activate services" and "activation / dependency lifecycle" are owned elsewhere, and Stage 4 is Runtime
   Lifecycle.** Activation and lifecycle transitions belong to `ai/runtime/` and to the namespace lifecycle
   models; `ai/operations/` (the model this layer conforms to) forbids execution, orchestration, and scheduling.
   There is no app-layer "activation" concept defined in the constitution, so producing "activation metadata"
   would either recreate a Runtime or namespace-lifecycle model (an ADR-0025 dimension-independence violation) or
   invent a new architectural concept (a "never invent architecture" violation). The mandate itself forbids
   activation and lifecycle transitions and defers Runtime Lifecycle to Stage 4.

5. **The DI-integration point already exists.** The Composition Root's extension seam
   (`CompositionConfig.modules`) is, by ADR-0026, the sanctioned mechanism through which later stages integrate
   their services into the DI graph. A separate "DI integration" package that registers services would duplicate
   that seam; today it would also have nothing to pass through it.

In short: everything Stage 3 is asked to *do* (register, resolve, validate) is frozen and owned; everything it
is asked to *produce* (dependency metadata, activation metadata) is either already produced or not yet
constitutionally definable; and the integration point it is asked to create already exists. That is the gate.

## 4. Options for the user (the decision this document raises)

### Option A (recommended): a descriptive integration-readiness layer, no services, no activation

A new `apps/di-integration` package (`@openlance/aios-di-integration`, layer `app`) that **consumes** the frozen
`WiredApplication` (which nests the composition root `Application`) and produces one immutable
`IntegratedApplication`. It:

- **records the injectable substrate surface** by referencing the composition root's already-registered services
  (`Application.diagnostics.services`), never re-registering them;
- **records per-namespace injection readiness**: for each wired namespace, a descriptor whose service-binding set
  is **empty today** (no namespace has operational services), marking the namespace present, available, and ready
  to receive substrate services at a future operational stage;
- **re-validates by delegation**: it calls the frozen `Application.container.validate()` and records the result;
  it implements no validation of its own;
- is immutable, fails closed (any validation error returns `DiIntegrationError[]` with no partial result), and
  performs no registration, no resolution for execution, no activation, and no lifecycle transition.

This reframes "activation metadata" as **injection-readiness metadata** to avoid inventing a Runtime-owned
"activation" concept, and it registers nothing (there is nothing to register) and validates only by delegating
to the frozen container. Its genuine, non-duplicating contribution is the single immutable handle that a later
activation stage (Stage 4+) consumes: the wired namespaces bound to the injectable substrate surface, verified
consistent. Requires ADR-0028 (Proposed here). Honest caveat: today its binding sets are empty, so the layer is
thin; its value is realized when namespace operational services arrive.

### Option B: a formal deferral (mirrors ADR-0017's original deferral of the composition root)

Record, in ADR-0028, that the DI-integration point between the Composition Root and future namespace services is
the composition root's **already-frozen extension seam**, consumed by each namespace's own later operational
stage; and that there is no non-duplicating, non-inventing independent Stage 3 package to build until namespace
operational services exist. This is the same reasoning ADR-0017 used to defer the composition root itself ("a
composition root is most meaningful once there is something to compose"). Stage 3 then produces the integration
**contract** (design doc + ADR) and no runtime package now; namespace service DI folds into each namespace's
operational stage. Zero duplication and zero invention risk.

### Option C: a pure integration verifier

A package that only **verifies**, fail-closed, that a `WiredApplication` is internally consistent and ready for
later service registration, delegating graph validation to the frozen `container.validate()` and manifest
validation to the frozen namespace wiring, and emits an immutable `IntegrationReport`. It registers nothing and
produces no "activation metadata" (dropped as premature). This is Option A minus the injection-readiness
projection; cleaner, but its only output is a verdict.

## 5. Recommended shapes (Option A), for review only

```ts
// The substrate DI token descriptions available for future injection, referenced from the composition root.
export type InjectableSurface = readonly string[];

// Per-namespace readiness: present, available, and (today) bound to no services. Descriptive metadata only.
export interface NamespaceInjectionReadiness {
  readonly namespace: string;              // slug, from the frozen manifest
  readonly available: true;                // from the frozen manifest
  readonly serviceBindings: readonly string[]; // empty today; a future operational stage populates it
  readonly ready: true;                    // preconditions recorded; NOT an activation
}

// The Composition Root + Namespace Wiring joined into one immutable, validated integration handle.
export interface IntegratedApplication {
  readonly wired: WiredApplication;                       // consumed, unchanged (nests the Application)
  readonly injectable: InjectableSurface;                 // referenced from Application.diagnostics.services
  readonly readiness: readonly NamespaceInjectionReadiness[];
  readonly validated: true;                               // records that container.validate() passed
}

// Join and validate by delegation; fail closed. Pure; no IO; no registration; no activation.
export function integrate(
  wired: WiredApplication,
): Result<IntegratedApplication, DiIntegrationError[]>;
```

`integrate` delegates graph validation to `wired.application.container.validate()` (frozen `di`), reads the
injectable surface from `wired.application.diagnostics.services`, reads the namespaces from
`wired.namespaces`, records each namespace's readiness with an empty binding set, and returns a deep-frozen
`IntegratedApplication`, or `DiIntegrationError[]` with no partial result. `DiIntegrationError` is an
`@openlance/aios-errors` `BaseError` subtype (`infrastructure`) with `DI_INTEGRATION.*` codes.

## 6. What Stage 3 will not do (any option)

No container, registry, provider, factory, builder, module host, resolution algorithm, or validation engine
(all frozen in `di`). No new copy of the namespace manifest or the composition registry. No service
implementation. No activation, execution, orchestration, scheduling, lifecycle transition, runtime behavior,
namespace logic, provider or agent or plugin execution, event processing, or business logic. No modification to
`ai/`, `knowledge/`, the substrate, the namespaces, the composition root, or the namespace wiring.

## 7. Non-duplication and ownership table

| Asked to own | Already owned by | Stage 3 disposition |
|---|---|---|
| Register services | `di` `Container.register` / `ModuleHost`; consumed by composition root seam | consume the seam; register nothing (no services exist) |
| Resolve dependencies | `di` `Container.resolve` | never re-implement; not resolved for execution |
| Validate dependency graph | `di` `Container.validate` / `validateGraph` | delegate to the frozen `validate()` |
| Immutable dependency metadata | `NamespaceManifest` (ADR-0027), composition `registry` (ADR-0026) | reference, do not re-produce |
| Activation metadata / activation | `ai/runtime/`, namespace lifecycle models; Stage 4 | not produced (invention risk); reframed as injection-readiness or deferred |
| DI integration point | composition root extension seam (ADR-0026) | consume it; do not duplicate |

## 8. If Option A or C is approved: the build plan

New `apps/di-integration` (`@openlance/aios-di-integration`, layer `app`), single explicit barrel, modules
`integration.ts` + `errors.ts`. Dependencies: `@openlance/aios-namespace-wiring`, `@openlance/aios-composition-root`
(type only), `@openlance/aios-kernel`, `@openlance/aios-errors`. Full `pnpm run validate` green; 100% coverage;
benchmark of the `integrate` path; regenerate `dependency-graph.snapshot.json`; ADR-0028 flips to Accepted;
freeze document; two independent audits (traceability, purity, regression); completion report; commit; freeze;
stop before Stage 4 (Runtime Lifecycle). If Option B is approved, ADR-0028 records the deferral and no package is
built.

## 9. The gate and its resolution

A duplication risk, a frozen-package conflict, an ownership conflict, and an architectural-invention risk all
exist, as Sections 2 and 3 show. Per the Stage 3 mandate and ADR-0007, implementation stopped at the design
artifacts (this document and the Proposed ADR-0028) and awaited a direction. **Option A was approved**, and this
package implements it exactly: `integrate(wired): Result<IntegratedApplication, DiIntegrationError[]>`, which
delegates graph validation to the frozen `Container.validate()`, references the injectable substrate surface from
the composition root, records per-namespace injection readiness with empty binding sets, registers and activates
nothing, and fails closed. ADR-0028 is Accepted. Stage 4 (Runtime Lifecycle) is not begun.
