---
id: ADR-0028
title: The DI-integration layer consumes the frozen DI, composition root, and namespace wiring; it registers nothing and activates nothing
status: Accepted
date: 2026-08-04
supersedes: []
superseded_by: null
---

# ADR-0028: The DI-integration layer consumes the frozen DI, composition root, and namespace wiring; it registers nothing and activates nothing

## Status

**Accepted** (Phase 3, Stage 3). This ADR raised an Ambiguity Gate: the Stage 3 mandate, read against the frozen
surface, presents duplication, frozen-package, ownership, and invention conflicts. The gate was resolved by
approval of **Option A** (the descriptive integration-readiness layer), recorded below as the decision and
implemented by `@openlance/aios-di-integration`. It introduces no duplicate constitutional truth, preserves
ADR-0005, ADR-0020, ADR-0021, ADR-0026, and ADR-0027, and modifies no frozen namespace. See
`docs/implementation/25-di-integration.md`.

## Context

Phase 3 Stage 1 (ADR-0026) built the composition root, which registers the substrate services through the frozen
DI mechanism and exposes an extension seam (`CompositionConfig.modules`) documented as the way "later Phase 3
stages register their services." Stage 2 (ADR-0027) built the immutable namespace manifest. Stage 3 is asked to
own "dependency-injection integration between the already-frozen Composition Root and Namespace Wiring so later
runtime stages can activate services": to register services, resolve dependencies, validate the dependency
graph, and produce immutable dependency metadata and activation metadata, with no activation, execution, or
lifecycle transition.

Three frozen facts constrain what Stage 3 can do:

- **The DI mechanism (ADR-0005, High stability) already owns registration, resolution, and dependency-graph
  validation** (`Container.register` / `resolve` / `validate`, `ModuleHost`, `validateGraph`). ADR-0026 Decision 1
  forbids re-implementing any of them.
- **The composition root (ADR-0026) already consumes that mechanism and already exposes the integration seam**
  through which later stages register services. Re-creating the seam or the registration path duplicates it.
- **The 13 namespaces are pure ADR-0020 models with no services and no DI tokens** (verified by source scan).
  There is nothing to register, resolve, or activate; creating namespace operational services is each namespace's
  own later stage (ADR-0026 Consequences). "Activation" and lifecycle are owned by `ai/runtime/` and the
  namespace lifecycle models, and `ai/operations/` (the model this app layer conforms to) forbids execution,
  orchestration, and scheduling. Stage 4 is Runtime Lifecycle.

So the operations the mandate names are frozen and owned, the metadata it names is already produced or not yet
constitutionally definable, and the integration point already exists. That is why this is design-first with the
gate raised.

## Decision

The decision is **Option A**: build a new `apps/`-layer package, `@openlance/aios-di-integration`, that is a
**descriptive integration-readiness layer**. It:

1. **Consumes** the frozen `WiredApplication` (which nests the composition root `Application`), the frozen DI
   `Container`, and the frozen namespace manifest; it defines no container, registry, provider model, module
   host, resolution algorithm, or validation engine, and re-implements none of them (ADR-0005, ADR-0026).
2. **Registers nothing and activates nothing.** No namespace has a service to register, so it registers none; it
   resolves nothing for execution; it performs no activation and no lifecycle transition. It records the
   injectable substrate surface by **referencing** the composition root's already-registered services, and
   records per-namespace **injection readiness** with an empty binding set (populated by each namespace's future
   operational stage, through the composition root's existing seam).
3. **Validates only by delegation** to the frozen `Container.validate()`, recording the result; it fails closed,
   returning `DiIntegrationError[]` with no partial result, and is immutable throughout.
4. Reframes the mandate's "activation metadata" as **injection-readiness metadata**, because an app-layer
   "activation" concept is not defined by the constitution and activation is Runtime-owned; producing it would
   invent architecture or recreate a Runtime or namespace-lifecycle model (ADR-0025).

## Alternatives considered

- **Option B, formal deferral.** Record that the composition root's frozen extension seam is the DI-integration
  point, that namespace service DI folds into each namespace's own later operational stage, and that no
  independent Stage 3 package is built until namespace operational services exist. This mirrors ADR-0017's
  original deferral of the composition root ("most meaningful once there is something to compose"). Zero
  duplication and zero invention risk; produces a contract, not a package.
- **Option C, pure integration verifier.** Build only a fail-closed verifier that a `WiredApplication` is
  internally consistent and ready for later registration, delegating to the frozen `validate()`, emitting an
  immutable report and no injection-readiness projection. Option A minus the readiness metadata.
- **Literal implementation of the mandate** (a package that registers services, resolves dependencies, and
  validates the graph). Rejected: it re-implements the frozen DI (ADR-0026 Decision 1 prohibition), has no
  services to register, and would produce a Runtime-owned "activation" model (ADR-0025 and "never invent
  architecture" violations).

## Consequences

- A new `apps/`-layer package exists, depending on the namespace wiring, the composition root (type only), and
  the kernel/errors substrate; its edges are recorded in `dependency-graph.snapshot.json`. It introduces no new
  container, registry, validation, or lifecycle, and imports no frozen namespace for behavior.
- The layer is thin today (empty binding sets) and gains substance as namespace operational services arrive and
  register through the composition root's seam.
- No frozen namespace, no constitution document, no dependency rule, the composition root, the namespace wiring,
  and no other ADR's decision changes. ADR-0005, ADR-0020, ADR-0021, ADR-0026, and ADR-0027 are preserved.

## Related constitutional references

`ai/operations/` (ADR-0024 category 5, the Composition Root role this app layer conforms to; referenced, never
restated) and `ai/architecture/dependency-map.md` (owner of the namespace dependency topology; referenced). This
ADR records an engineering composition decision; it realizes no constitutional concept and changes no
constitutional ownership.

## Related ADRs

Builds on ADR-0005 (DI mechanism), ADR-0026 (composition root and its extension seam), ADR-0027 (namespace
wiring), ADR-0020 and ADR-0021 (namespace model and dependency policy), ADR-0024 (Operations is category 5), and
ADR-0007 (design-first cadence). Relates to ADR-0017 (deferral reasoning), whose logic Option B would mirror.
